"use client";

import { useEffect, useState } from "react";
import { Eye } from "@phosphor-icons/react";

export default function VisitorCounter() {
  const [visits, setVisits] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage first to display immediately without layout shift
    try {
      const saved = localStorage.getItem("ali_portfolio_visits");
      if (saved) {
        setVisits(saved);
        setLoading(false);
      }
    } catch {
      // Ignore storage errors in private browsing
    }

    let isMounted = true;
    fetch("/api/visits")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data?.formatted) {
          setVisits(data.formatted);
          try {
            localStorage.setItem("ali_portfolio_visits", data.formatted);
          } catch {}
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch visits:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/10
                 bg-black/50 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs text-sand-300 backdrop-blur-md
                 shadow-lg shadow-black/40 transition-all duration-300 hover:border-white/20
                 hover:bg-black/70 select-none group"
      title="Total Portfolio Visits"
      aria-label={`Total portfolio visits: ${visits ?? "loading"}`}
    >
      {/* Live active dot indicator */}
      <span className="relative flex h-2 w-2 flex-shrink-0" aria-hidden="true">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>

      <Eye
        size={14}
        weight="duotone"
        className="text-sand-400 group-hover:text-sand-200 transition-colors flex-shrink-0"
        aria-hidden="true"
      />

      <span className="hidden sm:inline text-[11px] font-medium text-sand-400/80 tracking-wide">
        Visits:
      </span>

      <span className="font-semibold text-sand-100 tabular-nums text-[11px] sm:text-xs min-w-[12px] text-center">
        {visits ? visits : loading ? "..." : "1"}
      </span>
    </div>
  );
}
