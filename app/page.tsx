"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AsciiOrcaGrid from "@/components/AsciiOrcaGrid";
import { useTheme } from "@/components/ThemeProvider";
import { SITE_CONFIG, CITATIONS } from "@/lib/projects";

function Citation({
  source,
  children,
  isLight,
}: {
  source: string;
  children: React.ReactNode;
  isLight: boolean;
}) {
  const item = CITATIONS[source];
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => setOpen(true), 55);
  }, []);

  const handleLeave = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 30);
  }, []);

  useEffect(() => {
    return () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!item) return <>{children}</>;

  const handleNavigate = () => {
    setOpen(false);
    if (!item.href) return;
    if (item.href.startsWith("/")) {
      router.push(item.href);
    } else {
      window.open(item.href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <span
      className="relative inline-block"
      data-cited-open={open ? "true" : undefined}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        onClick={handleNavigate}
        onFocus={handleEnter}
        onBlur={handleLeave}
        aria-label={`${item.name}, ${item.role}`}
        className={`cursor-pointer inline align-baseline underline decoration-1 underline-offset-[5px] transition-[text-decoration-color,color] duration-150 outline-none focus-visible:decoration-2 ${
          open
            ? "decoration-foreground text-foreground"
            : "decoration-[color-mix(in_srgb,var(--foreground-color)_35%,transparent)] hover:decoration-[#48bcce] hover:text-foreground focus-visible:decoration-foreground focus-visible:text-foreground"
        }`}
      >
        {children}
      </button>

      <AnimatePresence>
        {open && (
          <motion.span
            data-koi-ignore={true}
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: 2,
              scale: 0.99,
              transition: { duration: 0.08, ease: "easeIn" },
            }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            onClick={handleNavigate}
            className="absolute bottom-full left-0 z-50 mb-[10px] flex origin-bottom-left flex-col overflow-hidden rounded-[8px] cursor-pointer font-geistMono text-foreground"
            style={{
              width: 340,
              background: isLight
                ? "color-mix(in srgb, var(--background-color) 45%, #ffffff)"
                : "color-mix(in srgb, var(--background-color) 93%, var(--foreground-color))",
              border: `1px solid color-mix(in srgb, var(--foreground-color) ${
                isLight ? 11 : 9
              }%, transparent)`,
              boxShadow: isLight
                ? "inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 1px 2px rgba(38, 37, 35, 0.06), 0 12px 32px -12px rgba(38, 37, 35, 0.18)"
                : "inset 0 1px 0 color-mix(in srgb, var(--foreground-color) 6%, transparent), 0 1px 2px rgba(0, 0, 0, 0.3), 0 16px 40px -12px rgba(0, 0, 0, 0.6)",
            }}
          >
            <span className="flex flex-col gap-[6px] px-[14px] pb-[12px] pt-[12px]">
              <span className="flex items-center gap-[8px] text-[12px] leading-none">
                <span
                  className="flex shrink-0 items-center justify-center rounded-[4px] font-semibold"
                  style={{
                    width: 16,
                    height: 16,
                    fontSize: 10,
                    background:
                      "color-mix(in srgb, var(--foreground-color) 12%, transparent)",
                  }}
                >
                  {item.badgeText}
                </span>
                <span className="truncate opacity-60">{item.name}</span>
                <span className="ml-auto shrink-0 pl-2 tabular-nums opacity-40">
                  {item.dates}
                </span>
              </span>

              <span className="mt-[4px] text-[13px] leading-[18px]">
                {item.role}
              </span>

              <span
                className="text-[12px] leading-[18px] overflow-hidden opacity-60"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.summary}
              </span>
            </span>

            <span
              className="flex items-center justify-between px-[14px] py-[8px] text-[11px] leading-none opacity-40"
              style={{
                borderTop: `1px solid color-mix(in srgb, var(--foreground-color) ${
                  isLight ? 8 : 7
                }%, transparent)`,
              }}
            >
              <span>
                {item.href?.startsWith("/") ? "open project" : "open site"}
              </span>
              <span aria-hidden="true">
                {item.href?.startsWith("/") ? "→" : "↗"}
              </span>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export default function HomePage() {
  const { theme, isLight } = useTheme();
  const [stats, setStats] = useState({ pod: 5, ripples: 0 });

  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevOverscroll = html.style.overscrollBehavior;
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    return () => {
      html.style.overflow = prevOverflow;
      html.style.overscrollBehavior = prevOverscroll;
    };
  }, []);

  return (
    <div
      id="mainPage"
      className={`relative h-[100dvh] w-full overflow-hidden bg-background transition-colors duration-300 ${theme}`}
    >
      <AsciiOrcaGrid
        theme={theme}
        isLight={isLight}
        onStats={setStats}
        className="absolute inset-0 h-full w-full"
      />

      <Navbar />

      <main className="relative z-20 flex h-full flex-col">
        <header className="mx-auto w-full px-6 lg:px-[20vw] relative flex h-full flex-col justify-end gap-10 bg-transparent pb-28 pt-28 text-foreground [@media(max-height:720px)]:gap-6 [@media(max-height:720px)]:pb-12 [@media(max-height:720px)]:pt-20">
          {/* Top-right dim counter (Orcas / Active Ripples & Blips) */}
          {stats.pod > 0 && (
            <div
              data-koi-avoid={true}
              aria-hidden="true"
              className="hidden lg:block absolute right-6 top-8 font-geistMono text-[11px] leading-relaxed tabular-nums lg:right-[20vw]"
            >
              <div className="opacity-[0.32]">{stats.pod}</div>
              <motion.div
                key={stats.ripples}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0.32 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {stats.ripples}
              </motion.div>
            </div>
          )}

          {/* Tagline (exact lowercase: "i am cooked" + blinking cursor) */}
          <blockquote
            data-koi-avoid={true}
            className="font-geistMono text-[14px] lowercase leading-relaxed tracking-[0.02em] opacity-60"
          >
            {SITE_CONFIG.tagline}
            <span
              aria-hidden="true"
              className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] animate-blink bg-foreground motion-reduce:animate-none"
            />
          </blockquote>

          {/* Intro & Socials Block */}
          <motion.div
            data-koi-avoid={true}
            className="cited-prose max-w-[54rem] font-geistMono text-[14px] sm:text-[15px] leading-[max(23px,3vh)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <p>Hello, I&apos;m {SITE_CONFIG.name}.</p>
            <p>
              Computer Science student @{" "}
              <Citation source="pup" isLight={isLight}>
                PUP
              </Citation>
              , research-focused, practicing{" "}
              <Citation source="aiNative" isLight={isLight}>
                AI-native development
              </Citation>
              .
            </p>
            <p>
              Building real projects — like{" "}
              <Citation source="ligtas" isLight={isLight}>
                LIGTAS METRO
              </Citation>{" "}
              and{" "}
              <Citation source="resetaph" isLight={isLight}>
                ResetaPH
              </Citation>{" "}
              — with AI coding agents in the loop, learning to direct, review,
              and ship with them.
            </p>

            {/* Socials Row: github / linkedin / x / email */}
            <p className="mt-[2.2vh]">
              {SITE_CONFIG.socials.map(({ label, href }, idx) => (
                <span key={label}>
                  {idx > 0 && <span className="opacity-40"> / </span>}
                  <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={
                      href.startsWith("mailto:")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    className="underline decoration-[color-mix(in_srgb,var(--foreground-color)_35%,transparent)] decoration-1 underline-offset-[5px] outline-none transition-[opacity,text-decoration-color] duration-150 opacity-60 hover:opacity-100 hover:decoration-[#48bcce] focus-visible:opacity-100 focus-visible:decoration-foreground"
                  >
                    {label}
                  </a>
                </span>
              ))}
            </p>
          </motion.div>
        </header>
      </main>
    </div>
  );
}
