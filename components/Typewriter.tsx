"use client";

import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  caretClassName?: string;
  typeSpeed?: number;
  startDelay?: number;
  lineDelay?: number;
}

export default function Typewriter({
  lines,
  className = "",
  lineClassName = "",
  caretClassName = "",
  typeSpeed = 65,
  startDelay = 450,
  lineDelay = 320,
}: TypewriterProps) {
  const [started, setStarted] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [done, setDone] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      doneRef.current = true;
      setStarted(true);
      setDone(true);
      setLineIndex(lines.length - 1);
      setCharCount(lines[lines.length - 1].length);
      return;
    }
    const timeout = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timeout);
  }, [startDelay, lines]);

  useEffect(() => {
    if (!started || done || doneRef.current) return;
    const current = lines[lineIndex];

    if (charCount < current.length) {
      const timeout = setTimeout(
        () => setCharCount((count) => count + 1),
        typeSpeed,
      );
      return () => clearTimeout(timeout);
    }

    if (lineIndex < lines.length - 1) {
      const timeout = setTimeout(() => {
        setLineIndex((index) => index + 1);
        setCharCount(0);
      }, lineDelay);
      return () => clearTimeout(timeout);
    }

    doneRef.current = true;
    const timeout = setTimeout(() => setDone(true), 500);
    return () => clearTimeout(timeout);
  }, [started, done, lineIndex, charCount, lines, typeSpeed, lineDelay]);

  return (
    <h1 className={className} aria-label={lines.join(" ")}>
      {lines.map((line, index) => {
        const isCurrent = index === lineIndex;
        const isComplete = index < lineIndex || done;
        const visibleLength = isCurrent ? charCount : line.length;

        return (
          <span key={`${index}-${line}`} className={`block ${lineClassName}`}>
            {isComplete || isCurrent ? line.slice(0, visibleLength) : "\u200B"}
            {isCurrent && !done && (
              <span className={`caret ${caretClassName}`} aria-hidden="true">
                ▍
              </span>
            )}
          </span>
        );
      })}
    </h1>
  );
}