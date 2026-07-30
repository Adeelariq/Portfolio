"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import OutlineFillText from "./FlickerText";

const TOTAL_FRAMES = 192;
const LATE_FRAME_BATCH_SIZE = 30;

const VIDEO_SRC = "/images/Firefly Astronaut drifts near the Sun, exactly as shown in the first reference image. The Sun remain.mp4";
const VIDEO_FALLBACK_SRC = "/images/astronaut.mp4";

// Utility to pad frame index to match filenames (e.g. 00001.webp)
const getFrameUrl = (index: number) => {
  const frameNum = String(index + 1).padStart(5, "0");
  return `/new-images/${frameNum}.webp`;
};

// Asynchronously load and decode an image off the main thread
const decodeImage = (src: string): Promise<HTMLImageElement | ImageBitmap> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (typeof window !== "undefined" && typeof window.createImageBitmap === "function") {
        window.createImageBitmap(img)
          .then((bitmap) => {
            resolve(bitmap);
          })
          .catch(() => {
            if (typeof img.decode === "function") {
              img.decode()
                .then(() => resolve(img))
                .catch(() => resolve(img));
            } else {
              resolve(img);
            }
          });
      } else if (typeof img.decode === "function") {
        img.decode()
          .then(() => resolve(img))
          .catch(() => resolve(img));
      } else {
        resolve(img);
      }
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = src;
  });
};

const releaseImage = (img: HTMLImageElement | ImageBitmap | null) => {
  if (!img) return;
  if ("close" in img && typeof img.close === "function") {
    img.close();
  }
};

export default function HeroJourney() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [useVideo, setUseVideo] = useState(false);

  // Initialize array with nulls for 192 frames to store them as they stream in
  const preloadedImagesRef = useRef<(HTMLImageElement | ImageBitmap | null)[]>(
    Array(TOTAL_FRAMES).fill(null)
  );
  const activeFrameIndexRef = useRef<number>(0);
  const isResizingRef = useRef<boolean>(false);
  const isMobileRef = useRef<boolean>(false);
  const lastWidthRef = useRef<number>(0);

  // Tracks active downloads to limit network concurrency
  const activeDownloadsRef = useRef<Set<number>>(new Set());
  // Tracks scroll direction for prioritizing downloads
  const scrollDirectionRef = useRef<"forward" | "backward">("forward");

  // 2. Draw canvas frames using "contain" strategy and nearest loaded frame fallback
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameIndex = activeFrameIndexRef.current;
    
    // Find closest loaded frame if the exact index is still loading
    let image = preloadedImagesRef.current[frameIndex];
    if (!image) {
      let dist = 1;
      while (dist < TOTAL_FRAMES) {
        if (frameIndex - dist >= 0 && preloadedImagesRef.current[frameIndex - dist]) {
          image = preloadedImagesRef.current[frameIndex - dist];
          break;
        }
        if (frameIndex + dist < TOTAL_FRAMES && preloadedImagesRef.current[frameIndex + dist]) {
          image = preloadedImagesRef.current[frameIndex + dist];
          break;
        }
        dist++;
      }
    }

    // If still no image is found, clear to black
    if (!image) {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = image.width;
    const ih = image.height;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = isMobileRef.current ? "medium" : "high";

    // Cover Strategy (fills the entire screen, scaling to cover, cropped if necessary, centered)
    const ratio = Math.max(cw / iw, ch / ih);
    const nw = iw * ratio;
    const nh = ih * ratio;
    const x = (cw - nw) / 2;
    const y = (ch - nh) / 2;

    // Clear background to strict spacebg
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, cw, ch);

    ctx.drawImage(image, x, y, nw, nh);
  }, []);

  // Keep track of loaded image cache size to maintain stable GPU/system memory
  const manageCacheMemory = useCallback(() => {
    const isMobile = isMobileRef.current;
    const currentPreloadCount = isMobile ? 6 : 30;
    const currentMaxCacheLimit = isMobile ? 60 : 120;
    const lateFrameStart = TOTAL_FRAMES - LATE_FRAME_BATCH_SIZE;

    let loadedCount = 0;
    const evictableIndices: number[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (preloadedImagesRef.current[i] !== null) {
        loadedCount++;
        const isProtected =
          i < currentPreloadCount || i >= lateFrameStart;
        if (!isProtected) {
          evictableIndices.push(i);
        }
      }
    }

    if (loadedCount <= currentMaxCacheLimit) return;

    const curr = activeFrameIndexRef.current;
    // Sort indices furthest from current active index first
    evictableIndices.sort((a, b) => Math.abs(b - curr) - Math.abs(a - curr));

    const numToEvict = loadedCount - currentMaxCacheLimit;
    for (let i = 0; i < Math.min(numToEvict, evictableIndices.length); i++) {
      const evictIdx = evictableIndices[i];
      const img = preloadedImagesRef.current[evictIdx];
      if (img) {
        releaseImage(img);
        preloadedImagesRef.current[evictIdx] = null;
      }
    }
  }, []);

  // Asynchronously download and decode remaining frames with priority sorting
  const preloadLateFrames = useCallback(() => {
    const isMobile = isMobileRef.current;
    const maxConcurrent = isMobile ? 4 : 6;
    const lateFrameStart = TOTAL_FRAMES - LATE_FRAME_BATCH_SIZE;

    const loadNextLateFrame = () => {
      if (activeDownloadsRef.current.size >= maxConcurrent) return;

      for (let i = lateFrameStart; i < TOTAL_FRAMES; i++) {
        if (activeDownloadsRef.current.size >= maxConcurrent) return;
        if (preloadedImagesRef.current[i] !== null || activeDownloadsRef.current.has(i)) {
          continue;
        }

        activeDownloadsRef.current.add(i);
        decodeImage(getFrameUrl(i))
          .then((decoded) => {
            preloadedImagesRef.current[i] = decoded;
            if (i === activeFrameIndexRef.current) {
              requestAnimationFrame(drawFrame);
            }
          })
          .catch(() => {
            // Ignore late-frame preload failures; forward loader will retry.
          })
          .finally(() => {
            activeDownloadsRef.current.delete(i);
            manageCacheMemory();
            loadNextLateFrame();
          });
        return;
      }
    };

    loadNextLateFrame();
  }, [drawFrame, manageCacheMemory]);

  const triggerBackgroundLoad = useCallback(() => {
    const isMobile = isMobileRef.current;
    const currentMaxConcurrentDownloads = isMobile ? 4 : 6;

    const unloadedIndices: number[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (preloadedImagesRef.current[i] === null && !activeDownloadsRef.current.has(i)) {
        unloadedIndices.push(i);
      }
    }

    if (unloadedIndices.length === 0) return;
    if (activeDownloadsRef.current.size >= currentMaxConcurrentDownloads) return;

    const curr = activeFrameIndexRef.current;
    const dir = scrollDirectionRef.current;

    // Prioritize next 10 frames in scroll direction, then nearest remaining
    const getFramePriority = (index: number) => {
      if (index === curr) return 0;

      if (dir === "forward") {
        if (index > curr && index <= curr + 10) {
          return index - curr; // Priority 1 to 10
        }
      } else {
        if (index < curr && index >= curr - 10) {
          return curr - index; // Priority 1 to 10
        }
      }

      return 100 + Math.abs(index - curr);
    };

    unloadedIndices.sort((a, b) => getFramePriority(a) - getFramePriority(b));

    const slotsAvailable = currentMaxConcurrentDownloads - activeDownloadsRef.current.size;
    const toDownload = unloadedIndices.slice(0, slotsAvailable);

    toDownload.forEach((idx) => {
      activeDownloadsRef.current.add(idx);

      const isHighPriority =
        dir === "forward"
          ? idx > curr && idx <= curr + 10
          : idx < curr && idx >= curr - 10;

      const startDownload = () => {
        decodeImage(getFrameUrl(idx))
          .then((decoded) => {
            preloadedImagesRef.current[idx] = decoded;
            activeDownloadsRef.current.delete(idx);

            manageCacheMemory();

            if (idx === activeFrameIndexRef.current) {
              requestAnimationFrame(drawFrame);
            }

            triggerBackgroundLoad();
          })
          .catch((err) => {
            console.warn(`Failed to load frame ${idx}:`, err);
            activeDownloadsRef.current.delete(idx);
            triggerBackgroundLoad();
          });
      };

      if (isHighPriority) {
        startDownload();
        return;
      }

      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        window.requestIdleCallback(() => startDownload());
      } else {
        setTimeout(startDownload, 1);
      }
    });
  }, [drawFrame, manageCacheMemory]);

  // 1. Preload initial image sequence frames before hiding loading screen
  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768;
    const currentPreloadCount = isMobileRef.current ? 6 : 30;
    let loadedCount = 0;

    // Direct block scroll on mount
    document.body.style.overflow = "hidden";

    const handleImageLoad = (index: number, img: HTMLImageElement | ImageBitmap) => {
      preloadedImagesRef.current[index] = img;
      loadedCount++;

      // Update progress percent based ONLY on initial preload count
      const percent = Math.round((loadedCount / currentPreloadCount) * 100);
      setProgress(percent);

      // Draw the first frame immediately once loaded so the page is never blank
      if (index === 0) {
        requestAnimationFrame(drawFrame);
      }

      // Hide loading screen and enable scroll as soon as the initial frames are ready
      if (loadedCount === currentPreloadCount) {
        requestAnimationFrame(() => {
          // Double-ensure frame 1 (index 0) is drawn on canvas before loader screen fades out
          drawFrame();
          setIsLoading(false);
          document.body.style.overflow = "";
          triggerBackgroundLoad();
          preloadLateFrames();
        });
      }
    };

    const handleImageError = (index: number) => {
      console.warn(`Failed to load initial frame ${index}`);
      loadedCount++;

      const percent = Math.round((loadedCount / currentPreloadCount) * 100);
      setProgress(percent);

      if (loadedCount === currentPreloadCount) {
        requestAnimationFrame(() => {
          drawFrame();
          setIsLoading(false);
          document.body.style.overflow = "";
          triggerBackgroundLoad();
          preloadLateFrames();
        });
      }
    };

    // Trigger load of the initial frames in parallel
    for (let i = 0; i < currentPreloadCount; i++) {
      const url = getFrameUrl(i);
      decodeImage(url)
        .then((img) => handleImageLoad(i, img))
        .catch(() => handleImageError(i));
    }

    return () => {
      document.body.style.overflow = "";
      // Clean up / release all loaded image bitmaps
      preloadedImagesRef.current.forEach((img) => {
        if (img) releaseImage(img);
      });
    };
  }, [drawFrame, triggerBackgroundLoad, preloadLateFrames]);

  // 3. Handle responsive resizing of the canvas backing store (DPR clamped to 2)
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    if (lastWidthRef.current === width) return;
    lastWidthRef.current = width;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Clamped device pixel ratio

    // Update backing store dimension to match Retina/High-DPI pixels
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    drawFrame();
  }, [drawFrame]);

  // Set initial dimensions immediately on mount so the first frame loads at full resolution
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  // 4. Native window scroll calculation mapped to frame progress
  useEffect(() => {
    if (isLoading) return;

    let scrollRafId = 0;

    const handleScroll = () => {
      if (scrollRafId) return;

      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = 0;

        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        if (maxScroll <= 0) return;

        const scrollProgress = Math.max(0, Math.min(1, scrollY / maxScroll));

        if (!useVideo) {
          const frameIndex = Math.round(scrollProgress * (TOTAL_FRAMES - 1));
          const prevIndex = activeFrameIndexRef.current;
          if (frameIndex !== prevIndex) {
            scrollDirectionRef.current = frameIndex > prevIndex ? "forward" : "backward";
            activeFrameIndexRef.current = frameIndex;
            if (!isResizingRef.current) {
              drawFrame();
            }
            triggerBackgroundLoad();
          }
        } else {
          const video = videoRef.current;
          if (video && video.duration) {
            video.currentTime = scrollProgress * video.duration;
          }
        }
      });
    };

    // Run once to match initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (scrollRafId) cancelAnimationFrame(scrollRafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isLoading, useVideo, drawFrame, triggerBackgroundLoad]);

  // Smooth scroll helper for the Explore button (smoothly targets projects section)
  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector("#projects");
    if (!target) return;

    const lenis = (window as Window & { __lenis?: { scrollTo: (target: Element) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(target);
      return;
    }

    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* 1. Premium Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]"
          >
            <div className="w-64 flex flex-col items-center gap-4">
              <span className="text-xs font-light tracking-[0.25em] text-white/70 uppercase">
                Preparing Journey...
              </span>
              <div className="w-full h-[1px] bg-white/10 overflow-hidden relative">
                <div
                  className="absolute top-0 left-0 h-full bg-white transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-white/35">
                {progress}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Global Fixed Canvas background (layered under everything) */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0">
        {!useVideo ? (
          <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none block"
            style={{ width: "100vw", height: "100vh" }}
          />
        ) : (
          <video
            ref={videoRef}
            muted
            playsInline
            className="fixed inset-0 pointer-events-none object-cover"
            style={{ width: "100vw", height: "100vh", backgroundColor: "#050505" }}
          >
            <source src={VIDEO_SRC} type="video/mp4" />
            <source src={VIDEO_FALLBACK_SRC} type="video/mp4" />
          </video>
        )}
        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* 3. Hero Journey Pinned Content triggers text scroll animations (Naturally flowing min-h-screen segments) */}
      <div className="relative w-full z-10 select-none bg-transparent">
        
        {/* Section 1: Hero Intro & CTA Combined */}
        <section className="min-h-screen w-full flex items-center justify-start px-6 md:px-24 bg-transparent">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl text-left"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase text-white leading-none mb-4">
              Adeel Ariq
            </h1>
            <p className="text-neutral-400 font-light tracking-wide text-sm md:text-base leading-relaxed mb-6">
              Frontend Developer &bull; Creative Developer<br />
              Building premium digital experiences.
            </p>
            <OutlineFillText
              tag="h2"
              text={"LET'S BUILD SOMETHING\nEXTRAORDINARY."}
              className="text-2xl md:text-4xl font-bold tracking-tighter uppercase text-white leading-tight mb-8"
              style={{ whiteSpace: "pre-line" }}
              font={{}}
              flicker={{
                position: "above",
                replay: "yes",
                restState: "filled",
                delay: 0.5,
                ease: { type: "tween", duration: 1.5, ease: "easeInOut" },
                flickerCount: 8,
                showStroke: false,
                strokePosition: "start",
                strokeCount: 1,
                strokeColor: "#ffffff",
                strokeWidth: 1.5,
                wordFlickerEnabled: false,
                shakeEnabled: false,
                shakeWidth: 10,
                shakeSpeed: 10,
                letterFlickerEnabled: true,
                letterFlickerMode: "opacity",
                letterFlickerOpacity: 10,
                letterFlickerIntensity: 15,
              }}
            />
            <div className="flex gap-4 flex-wrap">
              <a
                href="#projects"
                onClick={scrollToProjects}
                className="inline-block border border-white text-white bg-transparent hover:bg-white hover:text-black tracking-widest text-xs uppercase px-8 py-4 font-mono font-medium rounded-full transition-all duration-500 hover:scale-105"
              >
                Explore My Work
              </a>
              <a
                href="/images/Adeel_Ariq_CV.pdf"
                className="inline-block border border-white/20 text-neutral-300 hover:text-white bg-transparent hover:border-white tracking-widest text-xs uppercase px-8 py-4 font-mono font-medium rounded-full transition-all duration-500 hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>
            </div>
          </motion.div>
        </section>

      </div>

      {/* Secret/Debug Toggle Pill (Bottom Right) to compare Canvas vs HTML5 Video */}
      <button
        onClick={() => setUseVideo(!useVideo)}
        className="fixed bottom-4 right-4 z-50 text-[9px] tracking-widest text-white/20 hover:text-white/80 uppercase font-mono bg-neutral-950/80 border border-white/5 px-3 py-1.5 rounded-full transition-all duration-300"
      >
        Render: {useVideo ? "HTML5 Video" : "Canvas Sequence"}
      </button>
    </>
  );
}
