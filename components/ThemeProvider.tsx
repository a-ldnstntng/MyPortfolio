"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ThemeMode = "dark" | "light";

interface ThemeContextValue {
  theme: ThemeMode;
  isLight: boolean;
  isMobile: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const THEME_COLORS: Record<ThemeMode, { bg: string; fg: string }> = {
  dark: { bg: "#1a1917", fg: "#fff7f0" },
  light: { bg: "#f5f4f1", fg: "#262523" },
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  isLight: false,
  isMobile: false,
  toggleTheme: () => {},
  setThemeMode: () => {},
});

function applyHtmlTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const doc = document.documentElement;
  doc.classList.remove("light", "dark", "ocean");
  doc.classList.add(mode);
  const { bg, fg } = THEME_COLORS[mode];
  doc.style.setProperty("--background-color", bg);
  doc.style.setProperty("--foreground-color", fg);
  doc.style.backgroundColor = bg;
  doc.style.color = fg;
  if (document.body) {
    document.body.style.backgroundColor = bg;
    document.body.style.color = fg;
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const initial: ThemeMode = stored === "light" ? "light" : "dark";
    setTheme(initial);
    applyHtmlTheme(initial);

    const mq = window.matchMedia("(max-width: 1023px)");
    const updateMobile = () => setIsMobile(mq.matches);
    updateMobile();
    mq.addEventListener("change", updateMobile);
    return () => mq.removeEventListener("change", updateMobile);
  }, []);

  const setThemeMode = useCallback((next: ThemeMode) => {
    setTheme(next);
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // ignore storage errors
    }
    applyHtmlTheme(next);
  }, []);

  // Sun/Moon button: toggles between Light (#f5f4f1) and Charcoal Dark (#1a1917)
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: ThemeMode = prev === "light" ? "dark" : "light";
      try {
        window.localStorage.setItem("theme", next);
      } catch {
        // ignore
      }
      applyHtmlTheme(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isLight: theme === "light",
        isMobile,
        toggleTheme,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
