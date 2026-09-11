"use client";

import TechIcon from "./TechIcon";

const tools = [
  { name: "Claude", color: "#D4A574" },
  { name: "ChatGPT", color: "#10A37F" },
  { name: "Gemini", color: "#4285F4" },
  { name: "Cursor", color: "#6366F1" },
  { name: "GitHub Copilot", color: "#F0F0F0" },
  { name: "Codex", color: "#10A37F" },
  { name: "V0", color: "#FFFFFF" },
  { name: "Bolt", color: "#1786FF" },
  { name: "Lovable", color: "#EC4899" },
  { name: "Replit", color: "#F26207" },
  { name: "OpenCode", color: "#2563EB" },
  { name: "Antigravity", color: "#7C3AED" },
];

export default function Marquee() {
  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-white/[0.05] backdrop-blur-sm
                 border border-white/[0.08] shadow-sm w-full max-w-full min-w-0"
      aria-label="Tools I work with"
    >
      <div className="flex items-center w-full min-w-0">
        {/* Label – hidden on mobile */}
        <div className="hidden sm:flex flex-shrink-0 px-6 py-4 border-r border-white/[0.08] z-10 bg-white/[0.03]">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-sand-500/50 font-semibold">
              Daily Drivers
            </p>
            <p className="text-base font-bold text-sand-100 whitespace-nowrap">
              Tools I work with
            </p>
          </div>
        </div>

        {/* Scrolling track */}
        <div className="flex-1 min-w-0 overflow-hidden relative w-full">
          {/* Gradient edge masks */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-black/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-black/90 to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee" aria-hidden="true">
            {[...tools, ...tools].map((tool, i) => (
              <div
                key={`${tool.name}-${i}`}
                className="flex items-center gap-2.5 px-4 sm:px-5 py-3.5 sm:py-4 whitespace-nowrap flex-shrink-0"
              >
                <TechIcon name={tool.name} size={20} />
                <span className="text-sm sm:text-base font-medium text-sand-200">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Screen-reader accessible list */}
      <div className="sr-only">
        <p>Tools I work with:</p>
        <ul>
          {tools.map((tool) => (
            <li key={tool.name}>{tool.name}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
