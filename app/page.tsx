"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";

import HeroJourney from "../components/HeroJourney";

// Dynamic lazy-loading for the main sections below the fold
const PortfolioContent = dynamic(() => import("../components/PortfolioContent"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-spacebg" />,
});

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      syncTouch: true,
    });

    lenisRef.current = lenis;
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    lenisRef.current?.scrollTo(0);
  };

  return (
    <div id="page-wrapper" className="relative min-h-screen bg-spacebg w-full">
      {/* Premium Minimal Navigation (Sticky) */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/20 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a
              href="#"
              onClick={scrollToTop}
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
