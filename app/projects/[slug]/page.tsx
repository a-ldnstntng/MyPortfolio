"use client";

import React from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ProjectCover from "@/components/ProjectCover";
import { useTheme } from "@/components/ThemeProvider";
import { PROJECTS } from "@/lib/projects";

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const { theme } = useTheme();

  const index = PROJECTS.findIndex((p) => p.slug === params?.slug);
  if (index === -1) {
    notFound();
  }

  const project = PROJECTS[index];
  const prevProject = index > 0 ? PROJECTS[index - 1] : null;
  const nextProject = index < PROJECTS.length - 1 ? PROJECTS[index + 1] : null;

  return (
    <div
      className={`min-h-screen w-full bg-background text-foreground transition-colors duration-300 ${theme}`}
    >
      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="mx-auto w-full max-w-[56rem] px-6 pb-36 pt-28 lg:pt-36 font-geistMono"
      >
        {/* Header */}
        <header>
          <Link
            href="/projects"
            className="inline-block font-geistMono text-[13px] text-[var(--muted-color)] outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
          >
            &larr; back to projects
          </Link>

          <div className="mt-8 flex flex-wrap items-baseline gap-4">
            <h1 className="font-geistSans text-[26px] sm:text-[30px] font-medium leading-[1.2] tracking-[-0.015em] text-foreground">
              {project.name}
            </h1>
            <span className="font-geistMono text-[13px] text-[var(--muted-color)]">
              {project.season}
            </span>
          </div>

          <p className="mt-2 font-geistMono text-[14px] leading-[1.6] text-[var(--muted-color)]">
            {project.tagline}
          </p>

          {/* Links Row (GitHub, Live Demo) */}
          <div className="mt-5 flex flex-wrap items-center gap-5 text-[13px]">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="ink-link hover:text-[#48bcce]"
              >
                github repository &#8599;
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ink-link hover:text-[#48bcce]"
              >
                live demo &#8599;
              </a>
            )}
          </div>

          {/* Tech Tag Row */}
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-[4px] border px-2.5 py-1 font-geistMono text-[11.5px] transition-colors"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--foreground-color) 12%, transparent)",
                  backgroundColor:
                    "color-mix(in srgb, var(--foreground-color) 4%, transparent)",
                  color: "var(--muted-color)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Large Cover Showcase */}
        <div className="mt-12 overflow-hidden rounded-[6px] aspect-[16/10] w-full shadow-[0_0_0_1px_color-mix(in_srgb,var(--foreground-color)_10%,transparent)]">
          <ProjectCover project={project} />
        </div>

        {/* Overview Paragraphs */}
        <section className="mt-14 space-y-5">
          <h2 className="font-geistMono text-[13px] uppercase tracking-wider text-[var(--muted-color)]">
            overview
          </h2>
          {project.overview.map((paragraph, i) => (
            <p
              key={i}
              className="font-geistMono text-[14px] leading-[1.8] text-[color-mix(in_srgb,var(--foreground-color)_80%,transparent)]"
            >
              {paragraph}
            </p>
          ))}
        </section>

        {/* Key Features */}
        <section className="mt-14">
          <h2 className="mb-6 font-geistMono text-[13px] uppercase tracking-wider text-[var(--muted-color)]">
            architecture &amp; capabilities
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {project.features.map((feat) => (
              <div
                key={feat.title}
                className="rounded-[6px] border p-5"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--foreground-color) 10%, transparent)",
                  backgroundColor:
                    "color-mix(in srgb, var(--foreground-color) 2.5%, transparent)",
                }}
              >
                <h3 className="font-geistMono text-[13.5px] font-medium text-foreground">
                  {feat.title}
                </h3>
                <p className="mt-2 font-geistMono text-[12.5px] leading-[1.7] text-[var(--muted-color)]">
                  {feat.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Previous / Next Navigation */}
        <nav
          aria-label="More projects"
          className="mt-20 flex items-start justify-between gap-6 border-t pt-6"
          style={{
            borderColor:
              "color-mix(in srgb, var(--foreground-color) 10%, transparent)",
          }}
        >
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group flex flex-col gap-1 outline-none"
            >
              <span className="font-geistMono text-[11px] text-[var(--muted-color)]">
                previous
              </span>
              <span className="font-geistMono text-[14px] group-hover:text-[#48bcce] group-hover:underline underline-offset-4">
                &larr; {prevProject.name}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group flex flex-col items-end gap-1 text-right outline-none"
            >
              <span className="font-geistMono text-[11px] text-[var(--muted-color)]">
                next
              </span>
              <span className="font-geistMono text-[14px] group-hover:text-[#48bcce] group-hover:underline underline-offset-4">
                {nextProject.name} &rarr;
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </motion.main>
    </div>
  );
}
