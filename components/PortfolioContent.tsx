"use client";

import React from "react";
import Image from "next/image";

export default function PortfolioContent() {
  return (
    <div className="bg-transparent text-white relative z-10 font-sans w-full">
      {/* Divider line to separate hero from content */}
      <div className="w-full h-[1px] bg-white/5" />

      {/* About Section */}
      <section id="about" className="py-32 md:py-48 w-full bg-transparent border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Profile Image Container */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-white/10 bg-neutral-900">
              <Image
                src="/images/me_opt.webp"
                alt="Adeel Ariq - Frontend Web Developer, BCA student, and aspiring Data Analyst"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-all duration-700"
                priority
              />
            </div>
          </div>
          {/* About Text */}
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 uppercase text-white/90">
              About Me
            </h2>
            <div className="space-y-6 text-neutral-400 leading-relaxed text-lg font-light tracking-wide">
              <p>
                I am currently pursuing a Bachelor of Computer Applications (BCA)
                and studying to become a data analyst, while exploring the world
                of programming and web development. Although I do not have professional
                experience yet, I am continuously learning and building projects
                to improve my skills. I am passionate about creating user-friendly,
                visually appealing interfaces, and uncovering insights from data.
              </p>
              <p>
                Along with programming, I enjoy exploring design patterns,
                problem-solving, and keeping up with new technologies. In the
                future, I hope to expand my expertise in frameworks like React,
                Vue, and backend technologies like Node.js.
              </p>
            </div>

            <div className="flex items-center gap-6 mt-10">
              <a
                href="https://github.com/Adeelariq"
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile of Adeel Ariq"
                title="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/adeel-ariq-2a30513a2/"
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile of Adeel Ariq"
                title="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>



      {/* Projects Section */}
      <section id="projects" className="py-32 md:py-48 w-full bg-transparent border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 uppercase text-white/90">
              Featured Projects
            </h2>
            <p className="text-neutral-500 font-light tracking-widest text-sm uppercase">
              A collection of my recent work
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="group bg-neutral-950/85 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-[520px]">
              <div className="relative h-48 w-full bg-neutral-900 border-b border-white/5 overflow-hidden">
                <Image
                  src="/images/chinar_agro_ai.webp"
                  alt="Chinar Agro AI project by Adeel Ariq"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white/90 tracking-wide mb-3">Chinar Agro AI</h3>
                  <p className="text-neutral-400 font-light text-sm leading-relaxed tracking-wide line-clamp-4">
                    An AI precision farming platform built during a hackathon with Aatif Khan and Kamran Bhat. It features a PyTorch disease detection ensemble, climate-aware crop recommendation, yield forecasting, and Gemini-driven pesticide authentication.
                  </p>
                </div>
                <div className="pt-6">
                  <a
                    href="https://chinar-agro-ai-nu.vercel.app/"
                    className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-neutral-300 hover:text-white border-b border-neutral-700 hover:border-white pb-1 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="group bg-neutral-950/85 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-[520px]">
              <div className="relative h-48 w-full bg-neutral-900 border-b border-white/5 overflow-hidden">
                <Image
                  src="/images/paper_thesis.webp"
                  alt="Thesis Treasure Website project"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white/90 tracking-wide mb-3">Thesis Treasure</h3>
                  <p className="text-neutral-400 font-light text-sm leading-relaxed tracking-wide line-clamp-4">
                    A comprehensive web platform designed to assist students in
                    accessing and downloading syllabi, previous year question
                    papers, and study notes. Highly functional Resource Hub.
                  </p>
                </div>
                <div className="pt-6">
                  <a
                    href="https://cluster-university-resource-hub.netlify.app/"
                    className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-neutral-300 hover:text-white border-b border-neutral-700 hover:border-white pb-1 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Project 3 */}
            <div className="group bg-neutral-950/85 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-[520px]">
              <div className="relative h-48 w-full bg-neutral-900 border-b border-white/5 overflow-hidden">
                <Image
                  src="/images/Champion.webp"
                  alt="Champion Textiles Website project"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white/90 tracking-wide mb-3">Champion Textiles</h3>
                  <p className="text-neutral-400 font-light text-sm leading-relaxed tracking-wide line-clamp-4">
                    A modern digital storefront built to showcase textile collections with a clean and structured layout. Designed to provide a smooth browsing experience, highlighting products with minimal distractions and responsive performance.
                  </p>
                </div>
                <div className="pt-6">
                  <a
                    href="https://champion-textiles.netlify.app/"
                    className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-neutral-300 hover:text-white border-b border-neutral-700 hover:border-white pb-1 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Project 4 */}
            <div className="group bg-neutral-950/85 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-[520px]">
              <div className="relative h-48 w-full bg-neutral-900 border-b border-white/5 overflow-hidden">
                <Image
                  src="/images/VentureIQ.webp"
                  alt="VentureIQ AI Platform"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white/90 tracking-wide mb-3">VentureIQ</h3>
                  <p className="text-neutral-400 font-light text-sm leading-relaxed tracking-wide line-clamp-4">
                    An AI-powered business intelligence platform built during a hackathon with Aatif Khan and Kamran Bhat. The platform transforms uploaded financial data into actionable insights through forecasting and reports.
                  </p>
                </div>
                <div className="pt-6">
                  <a
                    href="https://ventureiqai.netlify.app/"
                    className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-neutral-300 hover:text-white border-b border-neutral-700 hover:border-white pb-1 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Project 5 */}
            <div className="group bg-neutral-950/85 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-[520px]">
              <div className="relative h-48 w-full bg-neutral-900 border-b border-white/5 overflow-hidden">
                <Image
                  src="/images/tram.webp"
                  alt="Tram A Legacy Kashmiri Copper Utensils"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white/90 tracking-wide mb-3">Tram A Legacy</h3>
                  <p className="text-neutral-400 font-light text-sm leading-relaxed tracking-wide line-clamp-4">
                    A modern website built to showcase authentic Kashmiri copper utensils and highlight traditional craftsmanship. Users can browse products and send purchase inquiries directly through WhatsApp.
                  </p>
                </div>
                <div className="pt-6">
                  <a
                    href="https://tramalegacy.netlify.app/"
                    className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-neutral-300 hover:text-white border-b border-neutral-700 hover:border-white pb-1 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Project 6 */}
            <div className="group bg-neutral-950/85 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-[520px]">
              <div className="relative h-48 w-full bg-neutral-900 border-b border-white/5 overflow-hidden">
                <Image
                  src="/images/result_logo.png"
                  alt="Exam Result Portal"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white/90 tracking-wide mb-3">Exam Result Portal</h3>
                  <p className="text-neutral-400 font-light text-sm leading-relaxed tracking-wide line-clamp-4">
                    A streamlined digital portal for accessing academic results anytime. Focused on delivering accuracy, simplicity, and ease of use for rapid student dashboard inquiries.
                  </p>
                </div>
                <div className="pt-6">
                  <a
                    href="https://exam-result-portal.netlify.app/"
                    className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-neutral-300 hover:text-white border-b border-neutral-700 hover:border-white pb-1 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Project 7 */}
            <div className="group bg-neutral-950/85 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-[520px]">
              <div className="relative h-48 w-full bg-neutral-900 border-b border-white/5 overflow-hidden">
                <Image
                  src="/images/unnamed.webp"
                  alt="Tic Tac Toe Game"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white/90 tracking-wide mb-3">Tic Tac Toe Game</h3>
                  <p className="text-neutral-400 font-light text-sm leading-relaxed tracking-wide line-clamp-4">
                    A classic Tic Tac Toe game built with HTML, CSS, and JavaScript, designed to present a smooth responsive game loop with high visual clarity.
                  </p>
                </div>
                <div className="pt-6">
                  <a
                    href="https://tic-tac-toegameproject.netlify.app/"
                    className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-neutral-300 hover:text-white border-b border-neutral-700 hover:border-white pb-1 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Project 8 */}
            <div className="group bg-neutral-950/85 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-[520px]">
              <div className="relative h-48 w-full bg-neutral-900 border-b border-white/5 overflow-hidden">
                <Image
                  src="/images/rock-paper-scissors-neon-icons.jpg"
                  alt="Rock Paper Scissors Game"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white/90 tracking-wide mb-3">Rock Paper Scissors</h3>
                  <p className="text-neutral-400 font-light text-sm leading-relaxed tracking-wide line-clamp-4">
                    A fun, interactive implementation of the classic Rock Paper Scissors game using clean native JavaScript, responsive styles, and interactive icon effects.
                  </p>
                </div>
                <div className="pt-6">
                  <a
                    href="https://rock-paper-scissors-adeel.netlify.app/"
                    className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-neutral-300 hover:text-white border-b border-neutral-700 hover:border-white pb-1 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Project 9 */}
            <div className="group bg-neutral-950/85 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-[520px]">
              <div className="relative h-48 w-full bg-neutral-900 border-b border-white/5 overflow-hidden">
                <Image
                  src="/images/dal-lake-kashmir-in-winter.webp"
                  alt="Houseboats of Kashmir Website"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white/90 tracking-wide mb-3">Houseboats of Kashmir</h3>
                  <p className="text-neutral-400 font-light text-sm leading-relaxed tracking-wide line-clamp-4">
                    A beautiful tourism landing page dedicated to showcasing the scenic culture, heritage, and famous luxury houseboats of Dal Lake in Kashmir.
                  </p>
                </div>
                <div className="pt-6">
                  <a
                    href="https://kashmirhouseboat.netlify.app/"
                    className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-neutral-300 hover:text-white border-b border-neutral-700 hover:border-white pb-1 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Project 10 */}
            <div className="group bg-neutral-950/85 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-[520px]">
              <div className="relative h-48 w-full bg-neutral-900 border-b border-white/5 overflow-hidden">
                <Image
                  src="/images/Fitness Hive.webp"
                  alt="Gym Website by Adeel Ariq"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white/90 tracking-wide mb-3">Gym Website</h3>
                  <p className="text-neutral-400 font-light text-sm leading-relaxed tracking-wide line-clamp-4">
                    A fitness landing page that allows users to register, calculate their Body Mass Index (BMI), and explore custom training regimens, workout schedules, and diets.
                  </p>
                </div>
                <div className="pt-6">
                  <a
                    href="https://gym-adeel.netlify.app/"
                    className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-neutral-300 hover:text-white border-b border-neutral-700 hover:border-white pb-1 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 md:py-48 w-full bg-transparent border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 uppercase text-white/90">
              Skills
            </h2>
            <p className="text-neutral-500 font-light tracking-widest text-sm uppercase">
              Technologies I work with
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Skill 1 */}
            <div className="bg-neutral-950/85 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-white/20 transition-all duration-300 h-32">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" className="w-8 h-8" />
              <span className="text-neutral-300 font-light tracking-wider text-sm uppercase">HTML5</span>
            </div>
            {/* Skill 2 */}
            <div className="bg-neutral-950/85 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-white/20 transition-all duration-300 h-32">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" className="w-8 h-8" />
              <span className="text-neutral-300 font-light tracking-wider text-sm uppercase">CSS3</span>
            </div>
            {/* Skill 3 */}
            <div className="bg-neutral-950/85 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-white/20 transition-all duration-300 h-32">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" alt="Bootstrap" className="w-8 h-8" />
              <span className="text-neutral-300 font-light tracking-wider text-sm uppercase">Bootstrap</span>
            </div>
            {/* Skill 4 */}
            <div className="bg-neutral-950/85 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-white/20 transition-all duration-300 h-32">
              <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="Tailwind" className="w-8 h-8" />
              <span className="text-neutral-300 font-light tracking-wider text-sm uppercase">Tailwind</span>
            </div>
            {/* Skill 5 */}
            <div className="bg-neutral-950/85 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-white/20 transition-all duration-300 h-32">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" className="w-8 h-8" />
              <span className="text-neutral-300 font-light tracking-wider text-sm uppercase">JavaScript</span>
            </div>
            {/* Skill 6 */}
            <div className="bg-neutral-950/85 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-white/20 transition-all duration-300 h-32">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" alt="C" className="w-8 h-8" />
              <span className="text-neutral-300 font-light tracking-wider text-sm uppercase">C Programming</span>
            </div>
            {/* Skill 7 */}
            <div className="bg-neutral-950/85 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-white/20 transition-all duration-300 h-32">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" alt="PHP" className="w-8 h-8" />
              <span className="text-neutral-300 font-light tracking-wider text-sm uppercase">PHP</span>
            </div>
            {/* Skill 8 (Python with libraries hover box) */}
            <div className="relative group bg-neutral-950/85 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-white/20 transition-all duration-300 h-32 cursor-pointer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" className="w-8 h-8" />
              <span className="text-neutral-300 font-light tracking-wider text-sm uppercase">Python</span>

              {/* Hover Box showing NumPy and Pandas */}
              <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-20">
                <div className="bg-neutral-900 border border-white/10 rounded-lg p-3 shadow-xl flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" className="w-6 h-6" alt="NumPy" />
                    <span className="text-xs font-light text-neutral-300 tracking-wider">NUMPY</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" className="w-6 h-6" alt="Pandas" />
                    <span className="text-xs font-light text-neutral-300 tracking-wider">PANDAS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What I Do Section */}
      <section id="what-i-do" className="py-32 md:py-48 w-full bg-transparent border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-20 text-center uppercase text-white/90">
            What I Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-neutral-950/85 border border-white/5 p-8 rounded-xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 border border-white/10 rounded-lg flex items-center justify-center mb-8 text-neutral-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-4 text-white/90 tracking-wide">Web Development</h3>
                <p className="text-neutral-400 font-light text-base leading-relaxed tracking-wide">
                  I build interactive and responsive websites using HTML, CSS
                  and JavaScript with a foundational understanding of PHP to add
                  basic dynamic features.
                </p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-neutral-950/85 border border-white/5 p-8 rounded-xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 border border-white/10 rounded-lg flex items-center justify-center mb-8 text-neutral-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-4 text-white/90 tracking-wide">Frontend Design</h3>
                <p className="text-neutral-400 font-light text-base leading-relaxed tracking-wide">
                  I focus on creating user-friendly interfaces and seamless
                  designs that enhance user experience. I have also fundamental
                  knowledge of modern layout systems.
                </p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-neutral-950/85 border border-white/5 p-8 rounded-xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 border border-white/10 rounded-lg flex items-center justify-center mb-8 text-neutral-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-4 text-white/90 tracking-wide">Logic Building</h3>
                <p className="text-neutral-400 font-light text-base leading-relaxed tracking-wide">
                  I have experience in C programming, working on
                  problem-solving, algorithms, and foundational concepts of
                  programming.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 md:py-48 w-full bg-transparent">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 uppercase text-white/90">
              Get in Touch
            </h2>
            <p className="text-neutral-500 font-light tracking-widest text-sm uppercase">
              Let's work together on your next project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <a
              href="mailto:Adeelariq786@gmail.com"
              className="group bg-neutral-950/85 border border-white/5 p-8 rounded-xl hover:border-white/20 transition-all duration-300 flex items-center gap-6"
            >
              <div className="w-12 h-12 border border-white/10 rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:border-white transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-light text-neutral-500 tracking-widest uppercase mb-1">Email</h3>
                <p className="text-neutral-300 text-sm font-light tracking-wide font-mono">Adeelariq786@gmail.com</p>
              </div>
            </a>

            <a
              href="tel:+916005469890"
              className="group bg-neutral-950/85 border border-white/5 p-8 rounded-xl hover:border-white/20 transition-all duration-300 flex items-center gap-6"
            >
              <div className="w-12 h-12 border border-white/10 rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:border-white transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.55 2.52c-.53.29-.79.83-.77 1.42.02.76.1 1.56.26 2.3.41.7.7 1.33 1.08 1.96a10.52 10.52 0 0 0 2.06 2.96c.52.5 1.09.99 1.73 1.42a2.15 2.15 0 0 1 2.38.29c.67-.64.73-1.7.3-2.5-.07-.1-.16-.19-.24-.29a4.44 4.44 0 0 0-1.6-.96 11.5 11.5 0 0 0-1.13-.24 2.14 2.14 0 0 1-.98-.61 3.93 3.93 0 0 1-.74-1.06c-.18-.25-.35-.51-.5-.78-.45-.78-.64-1.7-.55-2.62a2.5 2.5 0 0 1 1.56-1.72c.56-.23 1.09-.49 1.63-.79a19.79 19.79 0 0 1 8.7 3.06z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-light text-neutral-500 tracking-widest uppercase mb-1">Phone</h3>
                <p className="text-neutral-300 text-sm font-light tracking-wide font-mono">+91 6005469890</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950/90 text-neutral-600 text-center py-12 border-t border-white/5 font-light tracking-wider text-xs w-full">
        <p>&copy; {new Date().getFullYear()} Adeel Ariq Sheikh. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
