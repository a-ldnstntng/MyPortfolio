import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function smoothScrollTo(targetId: string, options?: { offset?: number }) {
  if (typeof window === "undefined") return;

  const cleanId = targetId.replace("#", "");

  // Special case: "hero" scrolls to the top of the window
  if (cleanId === "hero") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.location.hash) {
      window.history.pushState(null, "", window.location.pathname);
    }
    return;
  }

  // If scrolling to "home" on a standalone page without hero, scroll to top
  if (cleanId === "home" && !document.getElementById("hero")) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState(null, "", "#home");
    return;
  }

  const el = document.getElementById(cleanId);
  if (!el) return;

  const isMobile = window.innerWidth < 1024;
  // Mobile header is 56px; 88px offset leaves 32px breathing room below the header
  // Desktop has no top header; 60px offset ensures section headings are never at edge of viewport
  const defaultOffset = isMobile ? 88 : 60;
  const topOffset = options?.offset !== undefined ? options.offset : defaultOffset;

  const elementRect = el.getBoundingClientRect();
  const absoluteY = elementRect.top + window.pageYOffset;
  const targetY = Math.max(0, absoluteY - topOffset);

  window.scrollTo({
    top: targetY,
    behavior: "smooth",
  });

  window.history.pushState(null, "", `#${cleanId}`);
}