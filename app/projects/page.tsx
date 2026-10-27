"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProjectCover from "@/components/ProjectCover";
import { useTheme } from "@/components/ThemeProvider";
import { PROJECTS, type ProjectItem } from "@/lib/projects";

function ProjectCard({
  project,
  isDimmed,
  onHoverStart,
  onHoverEnd,
}: {
  project: ProjectItem;
  isDimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onClick={() => {
        try {
          sessionStorage.setItem("projects-last-viewed", project.slug);
        } catch {
          // ignore storage errors
        }
      }}
      draggable={false}
      className={`group block w-min shrink-0 snap-start outline-none transition-opacity duration-300 ${
        isDimmed ? "opacity-55" : "opacity-100"
      }`}
    >
      {/* Preview Image Container */}
      <div
        data-slug={project.slug}
        className={`relative overflow-hidden rounded-[6px] bg-[color-mix(in_srgb,var(--foreground-color)_6%,transparent)] h-[52vw] sm:h-[min(60vh,40rem)] ${
          project.featuredWide
            ? "aspect-[16/9.4] w-[86vw] sm:w-auto"
            : "aspect-[3/2] w-[82vw] sm:w-auto"
        }`}
      >
        <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          <ProjectCover project={project} />
        </div>

        {/* Hover Pill: "view project" at bottom-left */}
        <span className="pointer-events-none absolute bottom-4 left-4 z-30 translate-y-1 rounded-full bg-[rgb(0_0_0/0.58)] px-3 py-1.5 font-geistMono text-[12px] text-dark-foreground opacity-0 backdrop-blur-md transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          view project
        </span>
      </div>

      {/* Row 1: Project Name + Dim Monospace Season Label */}
      <div className="mt-3 flex items-baseline gap-3">
        <span className="whitespace-nowrap font-geistSans text-[15px] font-normal text-foreground group-hover:text-[#48bcce] transition-colors duration-200">
          {project.name}
        </span>
        <span className="whitespace-nowrap font-geistMono text-[12px] text-[var(--muted-color)]">
          {project.season}
        </span>
      </div>

      {/* Row 2: One-Line Description in Dim, Lighter Text */}
      <p className="mt-1 truncate font-geistSans text-[14px] leading-[1.5] text-[var(--muted-color)]">
        {project.tagline}
      </p>
    </Link>
  );
}

export default function ProjectsPage() {
  const { theme } = useTheme();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const targetScrollRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragScrollLeftRef = useRef<number>(0);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Restore last viewed card position if returning from detail page
    try {
      const lastSlug = sessionStorage.getItem("projects-last-viewed");
      if (lastSlug) {
        const cardEl = el.querySelector<HTMLElement>(`[data-slug="${lastSlug}"]`);
        if (cardEl) {
          const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;
          el.scrollLeft = Math.max(0, cardEl.offsetLeft - padLeft);
          targetScrollRef.current = el.scrollLeft;
        }
      }
    } catch {
      // ignore
    }

    const animateScroll = () => {
      if (!el) return;
      const diff = targetScrollRef.current - el.scrollLeft;
      if (Math.abs(diff) < 0.5) {
        el.scrollLeft = targetScrollRef.current;
        isAnimatingRef.current = false;
        return;
      }
      el.scrollLeft += diff * 0.18;
      rafRef.current = requestAnimationFrame(animateScroll);
    };

    const startSmoothScroll = (nextTarget: number) => {
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      targetScrollRef.current = Math.max(0, Math.min(maxScroll, nextTarget));
      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        rafRef.current = requestAnimationFrame(animateScroll);
      }
    };

    // Translate vertical mouse wheel into smooth sideways movement
    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth < 640) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        targetScrollRef.current = el.scrollLeft;
        return;
      }
      e.preventDefault();
      const mult = e.deltaMode === 1 ? 16 : 1;
      const delta = (e.deltaY || e.deltaX) * mult;
      const base = isAnimatingRef.current ? targetScrollRef.current : el.scrollLeft;
      startSmoothScroll(base + delta);
    };

    // Keyboard Left / Right arrow navigation
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const base = isAnimatingRef.current ? targetScrollRef.current : el.scrollLeft;
        startSmoothScroll(base + 420);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const base = isAnimatingRef.current ? targetScrollRef.current : el.scrollLeft;
        startSmoothScroll(base - 420);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Click-and-drag support on desktop
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.pageX - el.offsetLeft;
    dragScrollLeftRef.current = el.scrollLeft;
    targetScrollRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragStartXRef.current) * 1.25;
    scrollRef.current.scrollLeft = dragScrollLeftRef.current - walk;
    targetScrollRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      className={`h-[100dvh] w-full overflow-hidden bg-background text-foreground transition-colors duration-300 ${theme}`}
    >
      <Navbar />

      <main className="flex h-full flex-col justify-center pt-12">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          aria-label="Projects carousel"
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory sm:snap-none px-[max(1.5rem,calc((100vw-56rem)/2))] py-4 no-scrollbar cursor-grab active:cursor-grabbing"
        >
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              isDimmed={hoveredSlug !== null && hoveredSlug !== project.slug}
              onHoverStart={() => setHoveredSlug(project.slug)}
              onHoverEnd={() => setHoveredSlug(null)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
