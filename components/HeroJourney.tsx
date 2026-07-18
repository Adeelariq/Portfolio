"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TOTAL_FRAMES = 192;
const INITIAL_PRELOAD_COUNT = 25;
const MAX_CONCURRENT_DOWNLOADS = 3;
const MAX_CACHE_LIMIT = 80;

const VIDEO_SRC = "/images/Firefly Astronaut drifts near the Sun, exactly as shown in the first reference image. The Sun remain.mp4";
const VIDEO_FALLBACK_SRC = "/images/astronaut.mp4";

// Utility to pad frame index to match filenames (e.g. 00001.jpg)
const getFrameUrl = (index: number) => {
  const frameNum = String(index + 1).padStart(5, "0");
  return `/new-images/${frameNum}.jpg`;
};

// Asynchronously load and decode an image off the main thread
const decodeImage = (src: string): Promise<HTMLImageElement | ImageBitmap> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
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

    // Enable high-quality smoothing before drawing to preserve fine star/astronaut detail
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Contain Strategy (fills the entire screen, fitting inside, astronaut/planets never cropped, centered)
    const ratio = Math.min(cw / iw, ch / ih);
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
    let loadedCount = 0;
    const evictableIndices: number[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (preloadedImagesRef.current[i] !== null) {
        loadedCount++;
        // Do not evict initial preload frames (0 to INITIAL_PRELOAD_COUNT - 1)
        if (i >= INITIAL_PRELOAD_COUNT) {
          evictableIndices.push(i);
        }
      }
    }

    if (loadedCount <= MAX_CACHE_LIMIT) return;

    const curr = activeFrameIndexRef.current;
    // Sort indices furthest from current active index first
    evictableIndices.sort((a, b) => Math.abs(b - curr) - Math.abs(a - curr));

    const numToEvict = loadedCount - MAX_CACHE_LIMIT;
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
  const triggerBackgroundLoad = useCallback(() => {
    const unloadedIndices: number[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (preloadedImagesRef.current[i] === null && !activeDownloadsRef.current.has(i)) {
        unloadedIndices.push(i);
      }
    }

    if (unloadedIndices.length === 0) return;
    if (activeDownloadsRef.current.size >= MAX_CONCURRENT_DOWNLOADS) return;

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

    const slotsAvailable = MAX_CONCURRENT_DOWNLOADS - activeDownloadsRef.current.size;
    const toDownload = unloadedIndices.slice(0, slotsAvailable);

    toDownload.forEach((idx) => {
      activeDownloadsRef.current.add(idx);

      const scheduleWork = (cb: () => void) => {
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          window.requestIdleCallback(() => cb());
        } else {
          setTimeout(cb, 1);
        }
      };

      scheduleWork(() => {
        decodeImage(getFrameUrl(idx))
          .then((decoded) => {
            preloadedImagesRef.current[idx] = decoded;
            activeDownloadsRef.current.delete(idx);

            manageCacheMemory();

            // If the loaded frame is the current frame, draw it immediately
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
      });
    });
  }, [drawFrame, manageCacheMemory]);

  // 1. Preload initial image sequence frames before hiding loading screen
  useEffect(() => {
    let loadedCount = 0;

    // Direct block scroll on mount
    document.body.style.overflow = "hidden";

    const handleImageLoad = (index: number, img: HTMLImageElement | ImageBitmap) => {
      preloadedImagesRef.current[index] = img;
      loadedCount++;

      // Update progress percent based ONLY on initial preload count
      const percent = Math.round((loadedCount / INITIAL_PRELOAD_COUNT) * 100);
      setProgress(percent);

      // Draw the first frame immediately once loaded so the page is never blank
      if (index === 0) {
        requestAnimationFrame(drawFrame);
      }

      // Hide loading screen and enable scroll as soon as the initial frames are ready
      if (loadedCount === INITIAL_PRELOAD_COUNT) {
        requestAnimationFrame(() => {
          // Double-ensure frame 1 (index 0) is drawn on canvas before loader screen fades out
          drawFrame();
          setIsLoading(false);
          document.body.style.overflow = "";
          // Start background downloader asynchronously
          triggerBackgroundLoad();
        });
      }
    };

    const handleImageError = (index: number) => {
      console.warn(`Initial frame ${index} failed to load, skipping.`);
      loadedCount++;

      const percent = Math.round((loadedCount / INITIAL_PRELOAD_COUNT) * 100);
      setProgress(percent);

      if (loadedCount === INITIAL_PRELOAD_COUNT) {
        requestAnimationFrame(() => {
          drawFrame();
          setIsLoading(false);
          document.body.style.overflow = "";
          triggerBackgroundLoad();
        });
      }
    };

    // Trigger load of the initial frames in parallel
    for (let i = 0; i < INITIAL_PRELOAD_COUNT; i++) {
      decodeImage(getFrameUrl(i))
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
  }, [drawFrame, triggerBackgroundLoad]);

  // 3. Handle responsive resizing of the canvas backing store (DPR clamped to 2)
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      // Prevent division by zero
      if (maxScroll <= 0) return;

      const scrollProgress = Math.max(0, Math.min(1, scrollY / maxScroll));

      if (!useVideo) {
        // Map scroll progress directly from top of page (0%) to bottom of footer (100%)
        const frameIndex = Math.round(scrollProgress * (TOTAL_FRAMES - 1));
        const prevIndex = activeFrameIndexRef.current;
        if (frameIndex !== prevIndex) {
          scrollDirectionRef.current = frameIndex > prevIndex ? "forward" : "backward";
          activeFrameIndexRef.current = frameIndex;
          if (!isResizingRef.current) {
            requestAnimationFrame(drawFrame);
          }
          triggerBackgroundLoad();
        }
      } else {
        const video = videoRef.current;
        if (video && video.duration) {
          requestAnimationFrame(() => {
            video.currentTime = scrollProgress * video.duration;
          });
        }
      }
    };

    // Run once to match initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isLoading, useVideo, drawFrame, triggerBackgroundLoad]);

  // Smooth scroll helper for the Explore button (smoothly targets projects section)
  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector("#projects");
    if (target) {
      const offsetTop = (target as HTMLElement).offsetTop;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
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
        
        {/* Section 1: Hero Intro (Headline: ADEEL ARIQ) */}
        <section className="min-h-screen w-full flex items-center justify-start px-6 md:px-24 bg-transparent">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-lg text-left"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase text-white leading-none mb-4">
              Adeel Ariq
            </h1>
            <p className="text-neutral-400 font-light tracking-wide text-sm md:text-base leading-relaxed">
              Frontend Developer &bull; Creative Developer<br />
              Building premium digital experiences.
            </p>
          </motion.div>
        </section>

        {/* Section 2: Curiosity (Headline: Every journey starts with curiosity.) */}
        <section className="min-h-screen w-full flex items-center justify-end px-6 md:px-24 bg-transparent">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-lg text-left"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase text-white leading-tight">
              Every journey<br />starts with curiosity.
            </h2>
          </motion.div>
        </section>

        {/* Section 3: Mars (Headline: Building ideas into reality.) */}
        <section className="min-h-screen w-full flex items-center justify-start px-6 md:px-24 bg-transparent">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-lg text-left"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase text-white leading-tight mb-4">
              Building ideas<br />into reality.
            </h2>
            <div className="text-neutral-400 font-light tracking-wider text-xs md:text-sm leading-relaxed space-y-1">
              <p>Modern interfaces.</p>
              <p>Creative engineering.</p>
              <p>Meaningful experiences.</p>
            </div>
          </motion.div>
        </section>

        {/* Section 4: Earth (Headline: Turning vision into products.) */}
        <section className="min-h-screen w-full flex items-center justify-end px-6 md:px-24 bg-transparent">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-lg text-left"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase text-white leading-tight">
              Turning vision<br />into products.
            </h2>
          </motion.div>
        </section>

        {/* Section 5: Call to Action (Headline: Let's Build Something Extraordinary.) */}
        <section className="min-h-screen w-full flex items-center justify-start px-6 md:px-24 bg-transparent">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-lg text-left"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase text-white leading-none mb-8">
              Let's Build Something<br />Extraordinary.
            </h2>
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
