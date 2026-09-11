"use client";

import RecursiveErosionBackground from "@/components/ui/recursive-erosion";
import Typewriter from "@/components/Typewriter";
import { ArrowDown, ArrowRight, GithubLogo, LinkedinLogo, FacebookLogo } from "@phosphor-icons/react";
import LayoutWrapper from "@/components/LayoutWrapper";
import PortfolioContent from "@/components/PortfolioContent";
import { smoothScrollTo } from "@/lib/utils";

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/a-ldnstntng",
    icon: GithubLogo,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tanting-ali-andrei-l-126a7140b/",
    icon: LinkedinLogo,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/a.ldnstntng",
    icon: FacebookLogo,
  },
];

export default function LandingPage() {
  const scrollToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    smoothScrollTo("home");
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    smoothScrollTo("contact");
  };

  return (
    <div className="relative min-h-screen bg-[#050505]">
      {/* ═══════════ 1. HERO LANDING SECTION (Exclusive: 3D Recursive Erosion Sphere) ═══════════ */}
      <section id="hero" className="relative min-h-[100svh] w-full overflow-hidden bg-black z-20">
        {/* Particle sphere background */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <RecursiveErosionBackground mode="dark" className="h-full w-full" />
        </div>

        {/* Soft legibility vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.6)_100%)]"
          aria-hidden="true"
        />

        {/* Foreground content */}
        <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 sm:px-8">
          {/* Eyebrow badge */}
          <p
            className="mb-6 inline-flex items-center rounded-full border border-white/10
                       bg-white/[0.05] px-4 py-1.5 text-sm font-medium text-sand-300 backdrop-blur-sm"
          >
            Developer &amp; AI Engineer
          </p>

          {/* Typing headline */}
          <Typewriter
            lines={["Hi, I'm Ali Andrei.", "nice to meet you!"]}
            className="text-center text-[2.5rem] leading-[1.12] font-extrabold sm:text-6xl lg:text-7xl"
            lineClassName="text-sand-100 first-line:text-sand-100"
            caretClassName="ml-1 align-top text-[#F0EDE5]"
          />

          {/* Seamless Action Buttons */}
          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <button
              onClick={scrollToHome}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full
                         bg-sand-200 px-7 py-3.5 text-base font-semibold text-[#0A0A0A]
                         hover:bg-sand-100 transition-all duration-200 shadow-lg shadow-black/30
                         hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Explore my work
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button
              onClick={scrollToContact}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full
                         border border-white/10 bg-white/[0.05] px-7 py-3.5 text-base font-semibold
                         text-sand-200 hover:bg-white/[0.1] hover:text-sand-100
                         transition-all duration-200 backdrop-blur-sm
                         hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Get in touch
            </button>
          </div>

          {/* Socials */}
          <div className="mt-10 flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-11 w-11 items-center justify-center rounded-full
                           border border-white/10 bg-white/[0.05] text-sand-300
                           hover:bg-white/[0.12] hover:text-sand-100 transition-colors duration-200"
              >
                <social.icon size={19} aria-hidden="true" />
              </a>
            ))}
          </div>

          {/* Floating scroll down indicator */}
          <button
            onClick={scrollToHome}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5
                       text-sand-400/50 hover:text-sand-200 transition-colors duration-200 cursor-pointer group"
            aria-label="Scroll to explore portfolio"
          >
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">Scroll to explore</span>
            <ArrowDown size={16} className="animate-bounce text-sand-300 group-hover:text-sand-100" />
          </button>
        </div>
      </section>

      {/* ═══════════ 2. REST OF THE PAGE (Exclusive: Vertical Bars Background) ═══════════ */}
      <div id="portfolio-content" className="relative z-10">
        <LayoutWrapper>
          <PortfolioContent />
        </LayoutWrapper>
      </div>
    </div>
  );
}