import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adeel Ariq - Frontend Web Developer | Portfolio",
  description:
    "Adeel Ariq is a Frontend Web Developer specializing in HTML, CSS, JavaScript, and modern web technologies. View portfolio projects, skills, and contact information.",
  authors: [{ name: "Adeel Ariq" }],
  keywords: [
    "Adeel Ariq",
    "Adeel Ariq portfolio",
    "Adeel Ariq web developer",
    "Adeel Ariq frontend developer",
    "Adeel Ariq Sheikh",
    "web developer portfolio",
    "frontend developer",
  ],
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: {
    canonical: "https://adeel-ariq.netlify.app/",
  },
  openGraph: {
    type: "website",
    url: "https://adeel-ariq.netlify.app/",
    title: "Adeel Ariq - Frontend Web Developer | Portfolio",
    description:
      "Adeel Ariq is a Frontend Web Developer specializing in HTML, CSS, JavaScript, and modern web technologies. View portfolio projects, skills, and contact information.",
    images: [
      {
        url: "https://adeel-ariq.netlify.app/images/me_opt.webp",
        width: 400,
        height: 400,
        alt: "Adeel Ariq Sheikh Profile picture",
      },
    ],
    siteName: "Adeel Ariq Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adeel Ariq - Frontend Web Developer | Portfolio",
    description:
      "Adeel Ariq is a Frontend Web Developer specializing in HTML, CSS, JavaScript, and modern web technologies.",
    images: ["https://adeel-ariq.netlify.app/images/me_opt.webp"],
    creator: "@Adeelariq",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Original Structured Data JSON-LD
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Adeel Ariq",
    "alternateName": "Adeel Ariq Sheikh",
    "url": "https://adeel-ariq.netlify.app/",
    "jobTitle": "Frontend Web Developer",
    "description": "Adeel Ariq is a Frontend Web Developer specializing in HTML, CSS, JavaScript, and modern web technologies. Currently pursuing BCA and building innovative web experiences.",
    "email": "Adeelariq786@gmail.com",
    "telephone": "+91 6005469890",
    "image": "https://adeel-ariq.netlify.app/images/me_opt.webp",
    "sameAs": [
      "https://github.com/Adeelariq",
      "https://www.linkedin.com/in/adeel-ariq-2a30513a2/"
    ],
    "knowsAbout": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Bootstrap",
      "Tailwind CSS",
      "PHP",
      "Python",
      "C Programming",
      "Web Development",
      "Frontend Development"
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Bachelor of Computer Applications (BCA)"
    }
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Adeel Ariq Portfolio",
    "url": "https://adeel-ariq.netlify.app/",
    "author": {
      "@type": "Person",
      "name": "Adeel Ariq"
    },
    "description": "Portfolio website of Adeel Ariq - Frontend Web Developer showcasing projects, skills, and contact information."
  };

  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#050505" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Injecting Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
      </head>
      <body className="bg-spacebg text-white antialiased">
        {children}
      </body>
    </html>
  );
}
