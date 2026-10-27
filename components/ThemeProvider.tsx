"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ThemeMode = "dark" | "ocean" | "light";

interface ThemeContextValue {
  theme: ThemeMode;
  isLight: boolean;
  isOcean: boolean;
  isMobile: boolean;
  toggleTheme: () => void;
  toggleOceanBg: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const THEME_COLORS: Record<ThemeMode, { bg: string; fg: string }> = {
  ocean: { bg: "#0d1d33", fg: "#f0f6fc" },
  dark: { bg: "#1a1917", fg: "#fff7f0" },
  light: { bg: "#f5f4f1", fg: "#262523" },
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "ocean",
  isLight: false,
  isOcean: true,
  isMobile: false,
  toggleTheme: () => {},
  toggleOceanBg: () => {},
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
  const [theme, setTheme] = useState<ThemeMode>("ocean");
  const [lastDarkTheme, setLastDarkTheme] = useState<"dark" | "ocean">("ocean");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("theme") as ThemeMode | null;
    const initial: ThemeMode =
      stored === "light" || stored === "dark" || stored === "ocean"
        ? stored
        : "ocean";
    setTheme(initial);
    if (initial === "dark" || initial === "ocean") {
      setLastDarkTheme(initial);
    }
    applyHtmlTheme(initial);

    const mq = window.matchMedia("(max-width: 1023px)");
    const updateMobile = () => setIsMobile(mq.matches);
    updateMobile();
    mq.addEventListener("change", updateMobile);
    return () => mq.removeEventListener("change", updateMobile);
  }, []);

  const setThemeMode = useCallback((next: ThemeMode) => {
    setTheme(next);
    if (next === "dark" || next === "ocean") {
      setLastDarkTheme(next);
    }
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // ignore storage errors
    }
    applyHtmlTheme(next);
  }, []);

  // Sun/Moon button: toggles between Light (#f5f4f1) and active Dark mode (#0d1d33 or #1a1917)
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: ThemeMode = prev === "light" ? lastDarkTheme : "light";
      try {
        window.localStorage.setItem("theme", next);
      } catch {
        // ignore
      }
      applyHtmlTheme(next);
      return next;
    });
  }, [lastDarkTheme]);

  // Dark palette button: switches between Deep Ocean Blue (#0d1d33) and Dao Ho Charcoal Black (#1a1917)
  const toggleOceanBg = useCallback(() => {
    setTheme((prev) => {
      const next: "dark" | "ocean" = prev === "ocean" ? "dark" : "ocean";
      setLastDarkTheme(next);
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
        isOcean: theme === "ocean",
        isMobile,
        toggleTheme,
        toggleOceanBg,
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
