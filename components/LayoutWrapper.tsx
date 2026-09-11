"use client";

import { useState, useEffect } from "react";
import { List, X, Sparkle, ArrowUp } from "@phosphor-icons/react";
import Sidebar from "./Sidebar";
import VerticalBarsNoise from "@/components/ui/vertical-bars";
import { smoothScrollTo } from "@/lib/utils";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("hero");
      if (hero) {
        const rect = hero.getBoundingClientRect();
        setIsPastHero(rect.bottom <= 250);
      } else {
        setIsPastHero(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-sand-200">
      {/* Animated Vertical Bars Background - fixed full-viewport behind cards */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <VerticalBarsNoise
          backgroundColor="#050505"
          lineColor="#1c1c1c"
          barColor="#F0EDE5"
          animationSpeed={0.0004}
        />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile hamburger header - smoothly reveals when scrolling into portfolio */}
        <header
          className={`fixed top-0 left-0 right-0 h-14 bg-black/95 backdrop-blur-md
                     border-b border-white/[0.06] z-50 flex items-center justify-between px-4 lg:hidden
                     transition-all duration-300 ${
                       isPastHero
                         ? "translate-y-0 opacity-100"
                         : "-translate-y-full opacity-0 pointer-events-none"
                     }`}
        >
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg
                         text-sand-300 hover:text-sand-100 hover:bg-white/[0.08]
                         transition-colors duration-200"
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
            </button>
            <span className="text-base font-bold text-sand-100 ml-2">Ali Andrei L. Tanting</span>
          </div>
          <button
            onClick={() => {
              const hero = document.getElementById("hero");
              if (hero) smoothScrollTo("hero");
              else window.location.href = "/";
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       text-xs font-semibold text-sand-300 bg-white/[0.06] border border-white/10
                       hover:bg-sand-200 hover:text-[#0A0A0A] transition-colors cursor-pointer"
            title="Return to 3D Hero Landing Page"
          >
            <Sparkle size={14} weight="duotone" />
            <span>Landing</span>
          </button>
        </header>

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          showOnDesktop={isPastHero}
        />

        <main
          id="main-content"
          className="flex-1 lg:ml-[280px] p-5 sm:p-8 lg:p-10 pt-16 lg:pt-10"
          role="main"
        >
          {children}
        </main>

        {/* Floating Side Button - Return to Landing Page */}
        <button
          onClick={() => {
            const hero = document.getElementById("hero");
            if (hero) smoothScrollTo("hero");
            else window.location.href = "/";
          }}
          className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full
                     bg-[#0A0A0A]/90 border border-white/15 text-sand-200 text-xs sm:text-sm font-semibold
                     shadow-2xl shadow-black/80 backdrop-blur-md hover:bg-sand-200 hover:text-[#0A0A0A]
                     transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group
                     ${isPastHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
          title="Return to 3D Hero Landing Page"
          aria-label="Back to landing page"
        >
          <Sparkle size={16} weight="duotone" className="group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Back to Landing</span>
          <ArrowUp size={14} weight="bold" className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
