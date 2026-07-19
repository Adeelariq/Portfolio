"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import HeroJourney from "../components/HeroJourney";

// Dynamic lazy-loading for the main sections below the fold
const PortfolioContent = dynamic(() => import("../components/PortfolioContent"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-spacebg" />,
});

export default function Home() {
  useEffect(() => {
    // 1. Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      syncTouch: true, // Enable smooth momentum scrolling on touch devices
    });

    // 2. Continuous requestAnimationFrame scroll loop
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // 3. Connect GSAP ScrollTrigger updating directly to Lenis
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Hook GSAP custom ticker to drive Lenis updates
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div id="page-wrapper" className="relative min-h-screen bg-spacebg w-full">
      {/* Premium Minimal Navigation (Sticky) */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/20 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-xs font-semibold tracking-[0.2em] text-white hover:text-neutral-400 transition-colors uppercase font-mono"
            >
              Adeel Ariq
            </a>
            <div className="flex items-center space-x-6 md:space-x-8">
              <a
                href="#about"
                className="text-[10px] font-light tracking-[0.2em] text-neutral-400 hover:text-white uppercase transition-colors duration-300"
              >
                About
              </a>
              <a
                href="#projects"
                className="text-[10px] font-light tracking-[0.2em] text-neutral-400 hover:text-white uppercase transition-colors duration-300"
              >
                Projects
              </a>
              <a
                href="#skills"
                className="text-[10px] font-light tracking-[0.2em] text-neutral-400 hover:text-white uppercase transition-colors duration-300"
              >
                Skills
              </a>
              <a
                href="#contact"
                className="text-[10px] font-light tracking-[0.2em] text-neutral-400 hover:text-white uppercase transition-colors duration-300"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Cinematic space journey Hero canvas sequence */}
      <HeroJourney />

      {/* Lazy-loaded projects, skills, contact content */}
      <PortfolioContent />
    </div>
  );
}
