"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { useTheme } from "@/components/ThemeProvider";
import { GALLERY_ARCHIVES } from "@/lib/projects";

export default function GalleryPage() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-[100dvh] w-full bg-background text-foreground transition-colors duration-300 ${theme}`}
    >
      <Navbar />

      {GALLERY_ARCHIVES.length === 0 ? (
        /* Matches Reference Screenshot 3: Centered "coming soon." */
        <main className="flex h-[100dvh] w-full items-center justify-center px-6">
          <p className="font-geistMono text-[13px] lowercase tracking-wide text-[var(--muted-color)]">
            coming soon.
          </p>
        </main>
      ) : (
        /* Ready-to-use Hackathon Photo Archive Grid when GALLERY_ARCHIVES is populated */
        <main className="mx-auto w-full max-w-[56rem] px-6 pb-32 pt-28 lg:pt-36 font-geistMono">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {GALLERY_ARCHIVES.map((item) => (
              <figure key={item.id} className="group flex flex-col gap-2">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[6px] bg-[color-mix(in_srgb,var(--foreground-color)_6%,transparent)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <figcaption className="flex items-baseline justify-between text-[12px]">
                  <span className="text-foreground">{item.title}</span>
                  <span className="text-[var(--muted-color)]">
                    {item.event} &middot; {item.date}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
