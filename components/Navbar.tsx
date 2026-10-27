"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { SITE_CONFIG } from "@/lib/projects";

const NAV_LINKS = [
  { label: "pod", href: "/" },
  { label: "projects", href: "/projects" },
  { label: "gallery", href: "/gallery" },
];

function ThemeIcon({ isLight, size = 15 }: { isLight: boolean; size?: number | string }) {
  if (isLight) {
    // Moon icon (click to enter Dark mode)
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="currentColor"
        viewBox="0 0 256 256"
        aria-hidden="true"
      >
        <path d="M236.37,139.4a12,12,0,0,0-12-3A84.07,84.07,0,0,1,119.6,31.59a12,12,0,0,0-15-15A108.86,108.86,0,0,0,49.69,55.07,108,108,0,0,0,136,228a107.09,107.09,0,0,0,64.93-21.69,108.86,108.86,0,0,0,38.44-54.94A12,12,0,0,0,236.37,139.4Zm-49.88,47.74A84,84,0,0,1,68.86,69.51,84.93,84.93,0,0,1,92.27,48.29Q92,52.13,92,56A108.12,108.12,0,0,0,200,164q3.87,0,7.71-.27A84.79,84.79,0,0,1,186.49,187.14Z" />
      </svg>
    );
  }
  // Sun icon (click to enter Light mode)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 256 256"
      aria-hidden="true"
    >
      <path d="M116,36V20a12,12,0,0,1,24,0V36a12,12,0,0,1-24,0Zm80,92a68,68,0,1,1-68-68A68.07,68.07,0,0,1,196,128Zm-24,0a44,44,0,1,0-44,44A44.05,44.05,0,0,0,172,128ZM51.51,68.49a12,12,0,1,0,17-17l-12-12a12,12,0,0,0-17,17Zm0,119-12,12a12,12,0,0,0,17,17l12-12a12,12,0,1,0-17-17ZM196,72a12,12,0,0,0,8.49-3.51l12-12a12,12,0,0,0-17-17l-12,12A12,12,0,0,0,196,72Zm8.49,115.51a12,12,0,0,0-17,17l12,12a12,12,0,0,0,17-17ZM48,128a12,12,0,0,0-12-12H20a12,12,0,0,0,0,24H36A12,12,0,0,0,48,128Zm80,80a12,12,0,0,0-12,12v16a12,12,0,0,0,24,0V220A12,12,0,0,0,128,208Zm108-92H220a12,12,0,0,0,0,24h16a12,12,0,0,0,0-24Z" />
    </svg>
  );
}

export default function Navbar({ overCover = false }: { overCover?: boolean }) {
  const pathname = usePathname();
  const { theme, isLight, isOcean, toggleTheme, toggleOceanBg } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  const baseLinkClass =
    "transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100 outline-none";

  return (
    <>
      {/* ─── DESKTOP / TABLET NAVBAR ─── */}
      <nav
        data-koi-avoid={true}
        data-koi-ignore={true}
        aria-label="Main"
        className={`hidden sm:flex fixed inset-x-0 top-0 z-40 items-center justify-center gap-7 pt-8 font-geistMono text-[13px] lowercase transition-colors duration-200 ${
          overCover ? "text-dark-foreground" : "text-foreground"
        }`}
      >
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={`${baseLinkClass} ${
              isActive(href) ? "opacity-100" : "opacity-50"
            }`}
          >
            {label}
          </Link>
        ))}

        {/* Dark BG Swatch Toggle: switches between Deep Ocean Blue (#0d1d33) and Dao Ho Charcoal (#1a1917) */}
        <button
          type="button"
          onClick={toggleOceanBg}
          title={
            theme === "ocean"
              ? "Switch dark background to Dao Ho Charcoal (#1a1917)"
              : "Switch dark background to Deep Ocean Blue (#0d1d33)"
          }
          aria-label={
            theme === "ocean"
              ? "Switch dark background to Dao Ho Charcoal"
              : "Switch dark background to Deep Ocean Blue"
          }
          className={`${baseLinkClass} flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] opacity-75 hover:opacity-100 cursor-pointer`}
          style={{
            borderColor:
              "color-mix(in srgb, var(--foreground-color) 18%, transparent)",
            backgroundColor:
              "color-mix(in srgb, var(--foreground-color) 5%, transparent)",
          }}
        >
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full"
            style={{
              backgroundColor: theme === "ocean" ? "#5ce1e6" : "#1a1917",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.35)",
            }}
          />
          <span>{theme === "ocean" ? "ocean" : "charcoal"}</span>
        </button>

        {/* Light / Dark Mode Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${isLight ? "dark" : "light"} mode`}
          aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
          className={`${baseLinkClass} -m-2 p-2 opacity-60 hover:opacity-100 cursor-pointer`}
        >
          <ThemeIcon isLight={isLight} size={15} />
        </button>
      </nav>

      {/* ─── MOBILE NAVBAR (< 640px) ─── */}
      <div className="sm:hidden" data-koi-avoid={true} data-koi-ignore={true}>
        <div className="fixed top-[3vw] left-[3vw] right-[3vw] z-50 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            className="flex-1 flex items-center justify-between px-[5vw] py-[3.5vw] rounded-full cursor-pointer"
            style={{
              background: isLight
                ? "rgba(38, 37, 35, 0.06)"
                : "rgba(255, 247, 240, 0.06)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <span
              className="font-geistSans font-normal text-[17px] tracking-normal"
              style={{ color: isLight ? "#262523" : "#fff7f0" }}
            >
              {SITE_CONFIG.shortName}
            </span>

            <span className="flex h-[5vw] w-[5vw] items-center justify-center">
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.svg
                    key="close"
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="h-[4vw] w-[4vw]"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke={
                      isLight
                        ? "rgba(38, 37, 35, 0.65)"
                        : "rgba(255, 247, 240, 0.65)"
                    }
                    strokeWidth="1.5"
                  >
                    <path d="M3 3L13 13M13 3L3 13" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="grid"
                    initial={{ rotate: 45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -45, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="h-[4vw] w-[4vw]"
                    viewBox="0 0 16 16"
                    fill={
                      isLight
                        ? "rgba(38, 37, 35, 0.65)"
                        : "rgba(255, 247, 240, 0.65)"
                    }
                  >
                    <circle cx="4" cy="4" r="1.5" />
                    <circle cx="12" cy="4" r="1.5" />
                    <circle cx="4" cy="12" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </span>
          </button>

          {/* Quick Mobile Dark BG & Light/Dark Toggles */}
          <button
            type="button"
            onClick={toggleOceanBg}
            aria-label="Switch between Ocean Blue and Charcoal Black"
            className="flex h-[11vw] w-[11vw] items-center justify-center rounded-full cursor-pointer"
            style={{
              background: isLight
                ? "rgba(38, 37, 35, 0.06)"
                : "rgba(255, 247, 240, 0.06)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: isLight ? "#262523" : "#fff7f0",
            }}
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor: isOcean ? "#5ce1e6" : "#1a1917",
                boxShadow: "0 0 0 1.5px currentColor",
              }}
            />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
            className="flex h-[11vw] w-[11vw] items-center justify-center rounded-full cursor-pointer"
            style={{
              background: isLight
                ? "rgba(38, 37, 35, 0.06)"
                : "rgba(255, 247, 240, 0.06)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: isLight ? "#262523" : "#fff7f0",
            }}
          >
            <ThemeIcon isLight={isLight} size={16} />
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 flex flex-col"
              style={{
                backgroundColor: isLight
                  ? "#f5f4f1"
                  : isOcean
                  ? "#0d1d33"
                  : "#1a1917",
                color: isLight ? "#262523" : "#fff7f0",
              }}
            >
              <div className="flex-1 flex flex-col items-center justify-center gap-[1vh]">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`font-playfairDisplay font-bold text-[12vw] leading-[15vw] block text-center capitalize transition-opacity ${
                      isActive(href) ? "opacity-100" : "opacity-45"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <div className="flex-shrink-0 flex justify-center items-center gap-[7vw] pb-[10vh]">
                {SITE_CONFIG.socials.slice(0, 3).map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-geistMono text-[13px] lowercase opacity-50 hover:opacity-100"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
