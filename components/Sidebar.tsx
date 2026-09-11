"use client";

import { useState, useEffect } from "react";
import {
  House,
  FolderOpen,
  UserCircle,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  FacebookLogo,
  SealCheck,
  ArrowUp,
  Sparkle,
} from "@phosphor-icons/react";
import { smoothScrollTo } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "#home", icon: House },
  { label: "Projects", href: "#projects", icon: FolderOpen },
  { label: "About", href: "#about", icon: UserCircle },
  { label: "Contact", href: "#contact", icon: EnvelopeSimple },
];

const socialLinks = [
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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  showOnDesktop?: boolean;
}

export default function Sidebar({ isOpen, onClose, showOnDesktop = true }: SidebarProps) {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      // If reached bottom of document, highlight contact
      const isAtBottom =
        window.innerHeight + window.pageYOffset >=
        document.documentElement.scrollHeight - 80;
      if (isAtBottom) {
        setActiveSection("contact");
        return;
      }

      const sections = navItems.map((item) => item.href.replace("#", ""));
      const reversed = [...sections].reverse();
      for (const section of reversed) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    smoothScrollTo(href);
    onClose();
  };

  const handleProfileClick = () => {
    smoothScrollTo("hero");
    onClose();
  };

  const handleBackToLanding = () => {
    const hero = document.getElementById("hero");
    if (hero) {
      smoothScrollTo("hero");
    } else {
      window.location.href = "/";
    }
    onClose();
  };

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 w-[280px] bg-[#0A0A0A] border-r border-white/[0.06]
                 flex flex-col z-40 transition-all duration-500 ease-in-out
                 ${showOnDesktop ? "lg:translate-x-0 lg:opacity-100" : "lg:-translate-x-full lg:opacity-0 lg:pointer-events-none"}
                 ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 lg:opacity-100"}`}
      role="complementary"
      aria-label="Profile and navigation"
    >
      {/* Profile */}
      <div className="p-6 pb-4">
        <div
          onClick={handleProfileClick}
          className="flex flex-col items-center text-center mb-6 cursor-pointer group"
          title="Back to top"
        >
          <div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-sand-300 to-sand-500
                        flex items-center justify-center mb-4 shadow-lg shadow-black/30
                        ring-4 ring-white/[0.08] group-hover:ring-sand-400/40 transition-all duration-300 relative"
            aria-hidden="true"
          >
            <span className="text-3xl font-bold text-[#0A0A0A] select-none">
              AT
            </span>
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0A0A0A] border border-white/10
                             flex items-center justify-center text-sand-300 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUp size={12} weight="bold" />
            </span>
          </div>

          {/* Name + Verification Badge */}
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold text-sand-100 group-hover:text-sand-200 transition-colors">
              Ali Andrei L. Tanting
            </h1>
            <SealCheck
              size={22}
              weight="fill"
              className="text-[#1877F2] flex-shrink-0"
              aria-label="Verified account"
            />
          </div>
          <p className="text-sm text-sand-500/60 mt-1">@aldnstntng</p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-3 mb-2">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center
                         text-sand-400 hover:bg-white/[0.12] hover:text-sand-100
                         transition-all duration-200"
              aria-label={link.label}
            >
              <link.icon size={22} weight="bold" />
            </a>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 border-t border-white/[0.06]" />

      {/* Navigation */}
      <nav className="flex-1 px-4 pt-4" aria-label="Main navigation">
        <ul className="space-y-1" role="list">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`nav-link ${isActive ? "active" : ""}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  <item.icon
                    size={24}
                    weight={isActive ? "fill" : "regular"}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Back to Landing Page button */}
        <div className="mt-5 pt-4 border-t border-white/[0.06]">
          <button
            onClick={handleBackToLanding}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl
                       text-sm font-semibold text-sand-300 bg-white/[0.04] border border-white/[0.08]
                       hover:bg-sand-200 hover:text-[#0A0A0A] hover:border-sand-200
                       transition-all duration-200 shadow-sm group cursor-pointer"
            title="Return to interactive 3D hero landing"
          >
            <span className="flex items-center gap-2.5">
              <Sparkle
                size={18}
                weight="duotone"
                className="text-sand-400 group-hover:text-[#0A0A0A] group-hover:rotate-12 transition-transform duration-300"
                aria-hidden="true"
              />
              <span>Back to Landing</span>
            </span>
            <ArrowUp
              size={14}
              weight="bold"
              className="text-sand-500/60 group-hover:text-[#0A0A0A] group-hover:-translate-y-0.5 transition-all"
              aria-hidden="true"
            />
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 pt-4 border-t border-white/[0.06]">
        <p className="text-xs text-sand-500/30 text-center leading-relaxed">
          &copy; 2026 Ali Andrei L. Tanting.
          <br />
          All rights reserved.
        </p>
      </div>
    </aside>
  );
}
