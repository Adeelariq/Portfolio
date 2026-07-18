"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TOTAL_FRAMES = 192;
const VIDEO_SRC = "/images/Firefly Astronaut drifts near the Sun, exactly as shown in the first reference image. The Sun remain.mp4";
const VIDEO_FALLBACK_SRC = "/images/astronaut.mp4";

// Utility to pad frame index to match filenames (e.g. 00001.jpg)
const getFrameUrl = (index: number) => {
  const frameNum = String(index + 1).padStart(5, "0");
  return `/new-images/${frameNum}.jpg`;
};

export default function HeroJourney() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [useVideo, setUseVideo] = useState(false);

  // Initialize array with nulls for 192 frames to store them as they stream in
  const preloadedImagesRef = useRef<(HTMLImageElement | null)[]>(
    Array(TOTAL_FRAMES).fill(null)
  );
  const activeFrameIndexRef = useRef<number>(0);
  const isResizingRef = useRef<boolean>(false);

  // 1. Preload image sequence frames completely before enabling scrolling
  useEffect(() => {
    let loadedCount = 0;
    let frameZeroLoaded = false;

    // Direct block scroll on mount
    document.body.style.overflow = "hidden";

    const handleImageLoad = (index: number, img: HTMLImageElement) => {
      preloadedImagesRef.current[index] = img;
      loadedCount++;
      
      // Update progress percent
      const percent = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      setProgress(percent);

      // Draw the first frame immediately once loaded so the page is never blank
      if (index === 0) {
        frameZeroLoaded = true;
        requestAnimationFrame(drawFrame);
      }

      // Preload all 192 frames before disabling loading screen & enabling scroll
      if (loadedCount === TOTAL_FRAMES && frameZeroLoaded) {
        setIsLoading(false);
        document.body.style.overflow = "";
      }
    };

    const handleImageError = (index: number) => {
      console.warn(`Frame ${index} failed to load, skipping.`);
      loadedCount++;
      
      if (loadedCount === TOTAL_FRAMES) {
        setIsLoading(false);
        document.body.style.overflow = "";
      }
    };

    // Trigger load of all frames in parallel
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => handleImageLoad(i, img);
      img.onerror = () => handleImageError(i);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // 2. Draw canvas frames using "contain" strategy and nearest loaded frame fallback
  const drawFrame = () => {
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
  };

  // 3. Handle responsive resizing of the canvas backing store (DPR clamped to 2)
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Clamped device pixel ratio

    // Update backing store dimension to match Retina/High-DPI pixels
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    drawFrame();
  };

  // Set initial dimensions immediately on mount so the first frame loads at full resolution
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
        if (frameIndex !== activeFrameIndexRef.current) {
          activeFrameIndexRef.current = frameIndex;
          if (!isResizingRef.current) {
            requestAnimationFrame(drawFrame);
          }
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
  }, [isLoading, useVideo]);

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
