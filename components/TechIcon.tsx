"use client";

import { useState } from "react";

export const techIcons: Record<string, { slug: string; color: string }> = {
  "Claude": { slug: "anthropic", color: "#D4A574" },
  "Antigravity": { slug: "antigravity", color: "#7C3AED" },
  "Codex": { slug: "openai", color: "#10A37F" },
  "OpenCode": { slug: "opencode", color: "#2563EB" },
  "ChatGPT": { slug: "openai", color: "#10A37F" },
  "Gemini": { slug: "googlegemini", color: "#4285F4" },
  "Cursor": { slug: "cursor", color: "#6366F1" },
  "GitHub Copilot": { slug: "github", color: "#F0F0F0" },
  "V0": { slug: "vercel", color: "#FFFFFF" },
  "Bolt": { slug: "stackblitz", color: "#1786FF" },
  "Lovable": { slug: "lovable", color: "#EC4899" },
  "Replit": { slug: "replit", color: "#F26207" },
  "React Native": { slug: "react", color: "#61DAFB" },
  "React 19": { slug: "react", color: "#61DAFB" },
  "TypeScript": { slug: "typescript", color: "#3178C6" },
  "Python": { slug: "python", color: "#3776AB" },
  "PostgreSQL": { slug: "postgresql", color: "#4169E1" },
  "MySQL": { slug: "mysql", color: "#4479A1" },
  "Linux": { slug: "linux", color: "#FCC624" },
  "Packet Tracer": { slug: "cisco", color: "#1BA0D8" },
  "Vite": { slug: "vite", color: "#646CFF" },
  "Tailwind CSS": { slug: "tailwindcss", color: "#06B6D4" },
  "Node.js": { slug: "nodedotjs", color: "#339933" },
  "Express": { slug: "express", color: "#FFFFFF" },
  "Gemini API": { slug: "googlegemini", color: "#4285F4" },
  "SQLite": { slug: "sqlite", color: "#003B57" },
  "Capacitor": { slug: "capacitor", color: "#119EFF" },
  "MapLibre GL": { slug: "maplibre", color: "#336791" },
  "Git": { slug: "git", color: "#F05032" },
  "JavaScript": { slug: "javascript", color: "#F7DF1E" },
  "Chrome Extension": { slug: "googlechrome", color: "#4285F4" },
  "AI APIs": { slug: "openai", color: "#10A37F" },
  "Mapillary JS": { slug: "mapillary", color: "#05034D" },
  "Lucide React": { slug: "lucide", color: "#FFFFFF" },
  "OSM Nominatim": { slug: "openstreetmap", color: "#7EB95F" },
};

interface TechIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function TechIcon({
  name,
  size = 14,
  className = "",
}: TechIconProps) {
  const [useMask, setUseMask] = useState(false);
  const icon = techIcons[name];

  if (!icon) return null;

  // Fallback: render the raw simple-icons SVG as a CSS mask filled with brand color.
  // If the SVG is also unavailable (e.g. icon doesn't exist), this degrades to a
  // brand-colored dot.
  if (useMask) {
    return (
      <span
        className={`inline-block rounded-full flex-shrink-0 ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: icon.color,
          WebkitMaskImage: `url("https://cdn.jsdelivr.net/npm/simple-icons/icons/${icon.slug}.svg")`,
          WebkitMaskSize: "contain",
          WebkitMaskPosition: "center",
          WebkitMaskRepeat: "no-repeat",
          maskImage: `url("https://cdn.jsdelivr.net/npm/simple-icons/icons/${icon.slug}.svg")`,
          maskSize: "contain",
          maskPosition: "center",
          maskRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={`https://cdn.simpleicons.org/${icon.slug}/${icon.color.replace("#", "")}`}
      alt=""
      width={size}
      height={size}
      className={`flex-shrink-0 ${className}`}
      loading="lazy"
      draggable={false}
      onError={() => setUseMask(true)}
    />
  );
}