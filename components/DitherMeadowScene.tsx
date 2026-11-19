"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type CharacterMood = "asleep" | "waking" | "awake" | "groggy" | "dozing";

export interface MeadowState {
  mood: CharacterMood;
  wakes: number;
}

export interface DitherMeadowSceneProps {
  isLight?: boolean;
  className?: string;
  onStateChange?: (state: MeadowState) => void;
}

type SpriteKey = "asleep" | "awake" | "blink" | "groggy";

interface PaletteColor {
  r: number;
  g: number;
  b: number;
}

// 4x4 Bayer threshold matrix centered in [-0.5, +0.5)
const BAYER_4X4 = new Float32Array([
   0 / 16 - 0.5,  8 / 16 - 0.5,  2 / 16 - 0.5, 10 / 16 - 0.5,
  12 / 16 - 0.5,  4 / 16 - 0.5, 14 / 16 - 0.5,  6 / 16 - 0.5,
   3 / 16 - 0.5, 11 / 16 - 0.5,  1 / 16 - 0.5,  9 / 16 - 0.5,
  15 / 16 - 0.5,  7 / 16 - 0.5, 13 / 16 - 0.5,  5 / 16 - 0.5,
]);

const LIGHT_PALETTE: PaletteColor[] = [
  { r: 245, g: 244, b: 241 }, // #f5f4f1 exact paper bg
  { r: 233, g: 206, b: 178 }, // #e9ceb2 warm skin / sunlight
  { r: 154, g: 168, b: 128 }, // #9aa880 sunlit sage meadow & canopy
  { r: 92, g: 105, b: 67 },   // #5c6943 muted olive sweater & foliage
  { r: 38, g: 37, b: 35 },    // #262523 charcoal ink: hair, glasses, bark
];

const DARK_PALETTE: PaletteColor[] = [
  { r: 26, g: 25, b: 23 },    // #1a1917 exact charcoal page bg
  { r: 14, g: 14, b: 13 },    // #0e0e0d obsidian glasses, eyes, hair core
  { r: 52, g: 60, b: 46 },    // #343c2e moonlit moss / hill / night mist
  { r: 108, g: 124, b: 90 },  // #6c7c5a moonlit sage sweater & grass rim
  { r: 218, g: 186, b: 152 }, // #daba98 warm moonlit skin & firefly halo
  { r: 242, g: 235, b: 224 }, // #f2ebe0 warm cream stripes, moon, stars, socks
];

const AWAKE_LINES = [
  "oh, hi.",
  "hm? hey.",
  "just resting my eyes.",
  "nice breeze today.",
];

const GROGGY_LINES = [
  "five more mins...",
  "seriously...",
  "okay, okay...",
];

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

function hash(n: number) {
  let x = (n | 0) ^ 0x9e3779b9;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

function detectLittleEndian(): boolean {
  const buf = new ArrayBuffer(4);
  new Uint32Array(buf)[0] = 0x0a0b0c0d;
  return new Uint8ClampedArray(buf)[0] === 0x0d;
}

const IS_LITTLE_ENDIAN = typeof window !== "undefined" ? detectLittleEndian() : true;

function packRgba(r: number, g: number, b: number, a = 255): number {
  if (IS_LITTLE_ENDIAN) {
    return ((a & 255) << 24) | ((b & 255) << 16) | ((g & 255) << 8) | (r & 255);
  }
  return ((r & 255) << 24) | ((g & 255) << 16) | ((b & 255) << 8) | (a & 255);
}

/** Pre-bake day & moonlit-night variants of a loaded character sprite. */
function bakeSpriteVariants(img: HTMLImageElement): {
  day: HTMLCanvasElement;
  night: HTMLCanvasElement;
} {
  const w = img.naturalWidth || 512;
  const h = img.naturalHeight || 512;

  const day = document.createElement("canvas");
  day.width = w;
  day.height = h;
  const dCtx = day.getContext("2d")!;
  dCtx.drawImage(img, 0, 0, w, h);

  const night = document.createElement("canvas");
  night.width = w;
  night.height = h;
  const nCtx = night.getContext("2d")!;
  nCtx.drawImage(img, 0, 0, w, h);

  const imgData = nCtx.getImageData(0, 0, w, h);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 8) continue;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (lum < 62) {
      // Hair, glasses, eyes, mouth -> deep obsidian so they stay sharp over moonlit mist
      data[i] = Math.round(r * 0.45 + 6);
      data[i + 1] = Math.round(g * 0.45 + 6);
      data[i + 2] = Math.round(b * 0.45 + 5);
    } else if (r > 210 && g > 205 && b > 190) {
      // Cream sweater stripes & white socks -> softened warm moonlit cream
      data[i] = Math.round(r * 0.92);
      data[i + 1] = Math.round(g * 0.91);
      data[i + 2] = Math.round(b * 0.89);
    } else if (r > 215 && r - b > 35) {
      // Skin -> moonlit warm peach
      data[i] = Math.round(r * 0.87);
      data[i + 1] = Math.round(g * 0.88);
      data[i + 2] = Math.round(b * 0.86);
    } else if (g >= r - 8 && g > b + 12 && r < 150) {
      // Olive stripes -> moonlit sage so stripes remain distinct at night
      data[i] = Math.round(clamp(r * 1.04, 0, 255));
      data[i + 1] = Math.round(clamp(g * 1.18, 0, 255));
      data[i + 2] = Math.round(clamp(b * 1.16, 0, 255));
    } else {
      // Dark trousers -> slightly cool moonlit charcoal slate
      data[i] = Math.round(r * 0.88);
      data[i + 1] = Math.round(g * 0.92);
      data[i + 2] = Math.round(b * 0.94);
    }
  }

  nCtx.putImageData(imgData, 0, 0);
  return { day, night };
}

interface GrassBlade {
  u: number; // 0..1 across width
  h: number;
  lean: number;
  phase: number;
  thick: number;
  fg: boolean;
  flowerColor?: string;
}

interface FallingLeaf {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  size: number;
  life: number;
  maxLife: number;
}

interface AmbientMote {
  x: number;
  y: number;
  phase: number;
  speed: number;
  drift: number;
}

interface ZGlyph {
  born: number;
  xOff: number;
  life: number;
}

interface LayoutMetrics {
  w: number;
  h: number;
  bw: number;
  bh: number;
  scale: number;
  groundY: number;
  charX: number;
  charBaseY: number;
  charSize: number;
  treeX: number;
  canopyCx: number;
  canopyCy: number;
  canopyRx: number;
  canopyRy: number;
  hillBottomY: number;
  hitRect: { left: number; top: number; width: number; height: number };
  headAnchor: { x: number; y: number };
}

function buildSeeds() {
  const stars = Array.from({ length: 34 }, (_, i) => ({
    u: hash(i * 17 + 1),
    v: 0.06 + hash(i * 31 + 2) * 0.44,
    phase: hash(i * 43 + 3) * Math.PI * 2,
    big: hash(i * 59 + 4) > 0.8,
  }));

  const grass: GrassBlade[] = Array.from({ length: 145 }, (_, i) => {
    const isFlower = i % 11 === 0;
    const isFg = i % 5 === 0;
    return {
      u: hash(i * 73 + 5),
      h: 4 + hash(i * 89 + 6) * 8,
      lean: (hash(i * 97 + 7) - 0.5) * 3.5,
      phase: hash(i * 101 + 8) * Math.PI * 2,
      thick: hash(i * 113 + 9) > 0.72 ? 1.5 : 1,
      fg: isFg,
      flowerColor: isFlower
        ? hash(i * 127 + 10) > 0.45
          ? "#f3e8d2"
          : "#e9ceb2"
        : undefined,
    };
  });

  const motes: AmbientMote[] = Array.from({ length: 16 }, (_, i) => ({
    x: hash(i * 137 + 11),
    y: hash(i * 149 + 12),
    phase: hash(i * 163 + 13) * Math.PI * 2,
    speed: 0.45 + hash(i * 179 + 14) * 0.7,
    drift: (hash(i * 191 + 15) - 0.5) * 0.015,
  }));

  return { stars, grass, motes };
}

/** Tiny 5x5 pixel 'z' drawn directly onto logical canvas. */
function drawPixelZ(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, color: string) {
  ctx.fillStyle = color;
  const s = scale;
  // Top bar
  ctx.fillRect(Math.round(x), Math.round(y), 4 * s, s);
  // Diagonal steps
  ctx.fillRect(Math.round(x + 2 * s), Math.round(y + s), s, s);
  ctx.fillRect(Math.round(x + s), Math.round(y + 2 * s), s, s);
  // Bottom bar
  ctx.fillRect(Math.round(x), Math.round(y + 3 * s), 4 * s, s);
}

export default function DitherMeadowScene({
  isLight = false,
  className = "",
  onStateChange,
}: DitherMeadowSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bufCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const isLightRef = useRef(isLight);
  isLightRef.current = isLight;

  const onStateChangeRef = useRef(onStateChange);
  onStateChangeRef.current = onStateChange;

  const spritesRef = useRef<
    Partial<Record<SpriteKey, { day: HTMLCanvasElement; night: HTMLCanvasElement }>>
  >({});
  const spritesLoadedRef = useRef(false);

  const seedsRef = useRef(buildSeeds());
  const leavesRef = useRef<FallingLeaf[]>([]);
  const zGlyphsRef = useRef<ZGlyph[]>([]);

  // Interaction & animation state refs
  const moodRef = useRef<CharacterMood>("asleep");
  const wakeCountRef = useRef(0);
  const stateStartMsRef = useRef(0);
  const stateDurationRef = useRef(4450);
  const activeModeRef = useRef<"normal" | "groggy">("normal");
  const recentWakesRef = useRef<number[]>([]);
  const awakeLineIdxRef = useRef(0);
  const groggyLineIdxRef = useRef(0);

  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false });
  const rustleRef = useRef(0);
  const gustRef = useRef({ x: 0.5, strength: 0 });
  const hoverCharRef = useRef(false);
  const nextLeafSpawnRef = useRef(0);
  const nextZSpawnRef = useRef(0);
  const layoutRef = useRef<LayoutMetrics | null>(null);
  const needsStaticDrawRef = useRef(true);

  // Minimal React UI overlay state
  const [mood, setMood] = useState<CharacterMood>("asleep");
  const [wakes, setWakes] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [overlayPos, setOverlayPos] = useState<{
    hitRect: { left: number; top: number; width: number; height: number };
    headX: number;
    headY: number;
  } | null>(null);

  const commitState = useCallback(
    (nextMood: CharacterMood, nextWakes: number, nextBubble: string | null) => {
      moodRef.current = nextMood;
      wakeCountRef.current = nextWakes;
      setMood(nextMood);
      setWakes(nextWakes);
      setBubbleText(nextBubble);
      onStateChangeRef.current?.({ mood: nextMood, wakes: nextWakes });
      needsStaticDrawRef.current = true;
    },
    []
  );

  const spawnLeaves = useCallback((count: number, spread = 1) => {
    const m = layoutRef.current;
    if (!m) return;
    for (let i = 0; i < count; i++) {
      leavesRef.current.push({
        x: m.canopyCx + (Math.random() - 0.55) * m.canopyRx * 1.4,
        y: m.canopyCy + (Math.random() - 0.2) * m.canopyRy * 0.9,
        vx: -8 - Math.random() * 14 * spread,
        vy: 10 + Math.random() * 14,
        phase: Math.random() * Math.PI * 2,
        size: Math.random() > 0.5 ? 2 : 1.5,
        life: 0,
        maxLife: 3.4 + Math.random() * 2.2,
      });
    }
    if (leavesRef.current.length > 26) {
      leavesRef.current.splice(0, leavesRef.current.length - 26);
    }
  }, []);

  const triggerWake = useCallback(() => {
    const now = performance.now();
    const curMood = moodRef.current;
    const prevWakes = wakeCountRef.current;
    const nextWakes = prevWakes + 1;

    // Prune wake history older than 18s
    recentWakesRef.current = recentWakesRef.current.filter((t) => now - t < 18000);
    recentWakesRef.current.push(now);

    const isRepeatPoke = curMood !== "asleep" || recentWakesRef.current.length >= 3;

    stateStartMsRef.current = now;
    rustleRef.current = 1.0;
    zGlyphsRef.current = [];
    spawnLeaves(4, 1.3);

    if (isRepeatPoke) {
      activeModeRef.current = "groggy";
      stateDurationRef.current = 3850;
      const line = GROGGY_LINES[groggyLineIdxRef.current % GROGGY_LINES.length];
      groggyLineIdxRef.current += 1;
      commitState("groggy", nextWakes, line);
    } else {
      activeModeRef.current = "normal";
      stateDurationRef.current = 4450;
      commitState("waking", nextWakes, null);
    }
  }, [commitState, spawnLeaves]);

  // Measure [data-meadow-clear] & compute responsive logical + screen layout
  const computeLayout = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    const baseScale = w < 640 ? 2 : 3;
    const pixelScale = Math.max(baseScale, Math.ceil(Math.max(w, h) / 520));
    const bw = Math.max(1, Math.floor(w / pixelScale));
    const bh = Math.max(1, Math.floor(h / pixelScale));

    if (!bufCanvasRef.current) {
      bufCanvasRef.current = document.createElement("canvas");
    }
    if (bufCanvasRef.current.width !== bw || bufCanvasRef.current.height !== bh) {
      bufCanvasRef.current.width = bw;
      bufCanvasRef.current.height = bh;
    }

    // Measure bio block top so meadow never overlaps bio text
    let bioTop = h * 0.66;
    const clearEls = document.querySelectorAll("[data-meadow-clear]");
    clearEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.height > 0 && rect.top < bioTop) {
        bioTop = rect.top;
      }
    });

    const isMobile = w < 768;
    const groundYScreen = isMobile
      ? clamp(Math.min(h * 0.45, bioTop - 44), h * 0.32, h * 0.48)
      : clamp(Math.min(h * 0.53, bioTop - 54), h * 0.38, h * 0.56);

    const maxCharH = Math.max(isMobile ? 112 : 135, groundYScreen - 68);
    const rawCharSize = isMobile
      ? clamp(Math.min(w * 0.45, h * 0.30), 125, 198)
      : clamp(Math.min(w * 0.25, h * 0.36), 165, 270);
    const charSizeScreen = Math.min(rawCharSize, maxCharH / 0.88);

    const charXScreen = isMobile ? w * 0.48 : w * 0.63;
    const treeXScreen = charXScreen + charSizeScreen * (isMobile ? 0.38 : 0.43);

    const scale = pixelScale;
    const groundY = groundYScreen / scale;
    const charSize = charSizeScreen / scale;
    const charX = charXScreen / scale;
    const charBaseY = groundY + charSize * 0.04;
    const treeX = treeXScreen / scale;

    const canopyCx = treeX - charSize * (isMobile ? 0.10 : 0.20);
    const canopyCy = Math.max((isMobile ? 92 : 76) / scale, groundY - charSize * 1.12);
    const canopyRx = charSize * (isMobile ? 0.72 : 0.86);
    const canopyRy = charSize * (isMobile ? 0.38 : 0.43);
    const hillBottomY = Math.min(
      groundY + Math.max(10, bh * 0.048),
      Math.max(groundY + 8, (bioTop - 16) / scale)
    );

    // Screen-space interactive hitbox around the character (tight to seated silhouette)
    const hitW = charSizeScreen * 0.68;
    const hitH = charSizeScreen * 0.88;
    const hitRect = {
      left: Math.round(charXScreen - hitW * 0.5),
      top: Math.round(groundYScreen + charSizeScreen * 0.04 - hitH),
      width: Math.round(hitW),
      height: Math.round(hitH),
    };

    const headAnchor = {
      x: Math.round(charXScreen),
      y: Math.round(groundYScreen - charSizeScreen * 0.84),
    };

    layoutRef.current = {
      w,
      h,
      bw,
      bh,
      scale,
      groundY,
      charX,
      charBaseY,
      charSize,
      treeX,
      canopyCx,
      canopyCy,
      canopyRx,
      canopyRy,
      hillBottomY,
      hitRect,
      headAnchor,
    };

    setOverlayPos({
      hitRect,
      headX: headAnchor.x,
      headY: headAnchor.y,
    });
    needsStaticDrawRef.current = true;
  }, []);

  // Load & pre-bake all 4 aligned character sprites
  useEffect(() => {
    let cancelled = false;
    const keys: SpriteKey[] = ["asleep", "awake", "blink", "groggy"];
    let loaded = 0;

    keys.forEach((key) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        spritesRef.current[key] = bakeSpriteVariants(img);
        loaded += 1;
        if (loaded === keys.length) {
          spritesLoadedRef.current = true;
          needsStaticDrawRef.current = true;
        }
      };
      img.src = `/meadow/character-${key}.png`;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Report initial state on mount
  useEffect(() => {
    onStateChangeRef.current?.({ mood: "asleep", wakes: 0 });
  }, []);

  // Trigger redraw whenever theme switches
  useEffect(() => {
    needsStaticDrawRef.current = true;
  }, [isLight]);

  // Main layout observer, pointer tracking, & 24 FPS Bayer dithered render loop
  useEffect(() => {
    computeLayout();

    const ro = new ResizeObserver(() => computeLayout());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", computeLayout);
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => computeLayout());
    }

    const handlePointerMove = (e: PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      pointerRef.current = {
        x: clamp((e.clientX - rect.left) / rect.width, 0, 1),
        y: clamp((e.clientY - rect.top) / rect.height, 0, 1),
        active: true,
      };
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;
    const onMotionChange = () => {
      reduceMotion = motionQuery.matches;
      needsStaticDrawRef.current = true;
    };
    motionQuery.addEventListener("change", onMotionChange);

    const drawFrame = (nowMs: number, tSec: number, dtSec: number) => {
      const m = layoutRef.current;
      const canvas = canvasRef.current;
      const bufCanvas = bufCanvasRef.current;
      if (!m || !canvas || !bufCanvas) return;

      const bufCtx = bufCanvas.getContext("2d", { willReadFrequently: true });
      const dispCtx = canvas.getContext("2d");
      if (!bufCtx || !dispCtx) return;

      const light = isLightRef.current;
      const palette = light ? LIGHT_PALETTE : DARK_PALETTE;
      const { bw, bh, groundY, charX, charBaseY, charSize, treeX, canopyCx, canopyCy, canopyRx, canopyRy, hillBottomY } = m;

      // ─── Advance interactive character state machine ───
      let activeSprite: SpriteKey = "asleep";
      let startleOffset = 0;
      let startleScaleY = 1;
      const elapsedMs = nowMs - stateStartMsRef.current;
      const currentMood = moodRef.current;

      if (currentMood !== "asleep") {
        if (activeModeRef.current === "groggy") {
          if (elapsedMs < 120) {
            const p = elapsedMs / 120;
            startleOffset = -Math.sin(p * Math.PI) * 1.6;
            startleScaleY = 1 + Math.sin(p * Math.PI) * 0.03;
            activeSprite = "groggy";
          } else if (elapsedMs < 3200) {
            activeSprite = "groggy";
          } else if (elapsedMs < 3850) {
            if (currentMood !== "dozing") {
              commitState("dozing", wakeCountRef.current, null);
            }
            activeSprite = elapsedMs < 3450 ? "groggy" : "blink";
          } else {
            commitState("asleep", wakeCountRef.current, null);
            activeSprite = "asleep";
          }
        } else {
          // Normal wake timeline
          if (elapsedMs < 140) {
            const p = elapsedMs / 140;
            startleOffset = -Math.sin(p * Math.PI) * 2.1;
            startleScaleY = 1 + Math.sin(p * Math.PI) * 0.04;
            activeSprite = "asleep";
          } else if (elapsedMs < 300) {
            activeSprite = "blink";
          } else if (elapsedMs < 3600) {
            if (currentMood !== "awake") {
              const line = AWAKE_LINES[awakeLineIdxRef.current % AWAKE_LINES.length];
              awakeLineIdxRef.current += 1;
              commitState("awake", wakeCountRef.current, line);
            }
            // Two natural quick blinks while awake
            const inBlink1 = elapsedMs >= 1300 && elapsedMs <= 1430;
            const inBlink2 = elapsedMs >= 2600 && elapsedMs <= 2730;
            activeSprite = inBlink1 || inBlink2 ? "blink" : "awake";
          } else if (elapsedMs < 4450) {
            if (currentMood !== "dozing") {
              commitState("dozing", wakeCountRef.current, null);
            }
            // Slow drowsy double blink before nodding off
            if (elapsedMs < 3800) activeSprite = "blink";
            else if (elapsedMs < 4050) activeSprite = "awake";
            else activeSprite = "blink";
          } else {
            commitState("asleep", wakeCountRef.current, null);
            activeSprite = "asleep";
          }
        }
      }

      // ─── Decay impulses & update ambient particles ───
      rustleRef.current = Math.max(0, rustleRef.current - dtSec * 1.4);
      gustRef.current.strength = Math.max(0, gustRef.current.strength - dtSec * 1.1);

      if (!reduceMotion) {
        if (nowMs >= nextLeafSpawnRef.current) {
          spawnLeaves(1, 0.8);
          nextLeafSpawnRef.current = nowMs + 2200 + Math.random() * 2600;
        }
        for (const leaf of leavesRef.current) {
          leaf.life += dtSec;
          leaf.x += (leaf.vx + Math.sin(tSec * 2.4 + leaf.phase) * 9) * dtSec;
          leaf.y += (leaf.vy + Math.cos(tSec * 1.9 + leaf.phase) * 3) * dtSec;
        }
        leavesRef.current = leavesRef.current.filter(
          (l) => l.life < l.maxLife && l.y < hillBottomY
        );

        if (moodRef.current === "asleep" && nowMs >= nextZSpawnRef.current) {
          zGlyphsRef.current.push({
            born: nowMs,
            xOff: (Math.random() - 0.5) * 3,
            life: 2.5,
          });
          nextZSpawnRef.current = nowMs + 1350;
        }
        zGlyphsRef.current = zGlyphsRef.current.filter(
          (z) => (nowMs - z.born) / 1000 < z.life
        );
      }

      const ptr = pointerRef.current;
      const parallaxX = ptr.active ? (ptr.x - 0.5) * 4 : 0;
      const ptrBufX = ptr.x * bw;
      const ptrBufY = ptr.y * bh;

      // ─── 1. Clear to exact page background color ───
      bufCtx.globalAlpha = 1;
      bufCtx.fillStyle = light ? "#f5f4f1" : "#1a1917";
      bufCtx.fillRect(0, 0, bw, bh);

      // ─── 2. Sky Layer (Sun/Clouds in Day; Moon/Stars/Night Mist in Dark) ───
      if (light) {
        // Keep top navbar zone clean paper; softly warm lower sky horizon
        const skyGrad = bufCtx.createLinearGradient(0, groundY * 0.28, 0, groundY);
        skyGrad.addColorStop(0, "rgba(245, 244, 241, 0)");
        skyGrad.addColorStop(0.5, "rgba(233, 206, 178, 0.16)");
        skyGrad.addColorStop(1, "rgba(154, 168, 128, 0.14)");
        bufCtx.fillStyle = skyGrad;
        bufCtx.fillRect(0, groundY * 0.28, bw, groundY * 0.72);

        // Soft drifting afternoon clouds (positioned below navbar strip)
        const cloudDefs = [
          { base: 0.16, y: 0.19, w: 30, speed: 1.4 },
          { base: 0.44, y: 0.15, w: 22, speed: 1.0 },
          { base: 0.82, y: 0.23, w: 25, speed: 1.3 },
        ];
        bufCtx.fillStyle = "#e9ceb2";
        bufCtx.globalAlpha = 0.55;
        for (const c of cloudDefs) {
          const cx = ((c.base * bw + tSec * c.speed + parallaxX * 0.2) % (bw + 60)) - 30;
          const cy = Math.max(82 / m.scale, c.y * bh);
          if (cy > groundY - 26) continue;
          bufCtx.beginPath();
          bufCtx.ellipse(cx, cy, c.w * 0.52, c.w * 0.19, 0, 0, Math.PI * 2);
          bufCtx.ellipse(cx - c.w * 0.24, cy + 1.2, c.w * 0.30, c.w * 0.14, 0, 0, Math.PI * 2);
          bufCtx.ellipse(cx + c.w * 0.26, cy + 1.2, c.w * 0.28, c.w * 0.13, 0, 0, Math.PI * 2);
          bufCtx.fill();
        }
        bufCtx.globalAlpha = 1;

        // Subtle diagonal sunbeam shafts filtering leftward from canopy
        bufCtx.save();
        const beamGrad = bufCtx.createLinearGradient(treeX, canopyCy, charX - charSize * 0.9, groundY);
        beamGrad.addColorStop(0, "rgba(245, 244, 241, 0.34)");
        beamGrad.addColorStop(1, "rgba(245, 244, 241, 0)");
        bufCtx.fillStyle = beamGrad;
        bufCtx.beginPath();
        bufCtx.moveTo(treeX - charSize * 0.15, canopyCy);
        bufCtx.lineTo(treeX + charSize * 0.08, canopyCy + 6);
        bufCtx.lineTo(charX - charSize * 0.65, groundY + 4);
        bufCtx.lineTo(charX - charSize * 1.1, groundY + 4);
        bufCtx.closePath();
        bufCtx.fill();
        bufCtx.restore();
      } else {
        // Twinkling seeded night stars (staying above hill horizon)
        for (const st of seedsRef.current.stars) {
          const sx = Math.round(st.u * bw + parallaxX * 0.12);
          const sy = Math.round(Math.min(groundY - 12, st.v * bh));
          if (sy < 6) continue;
          const twinkle = 0.45 + 0.55 * Math.sin(tSec * 1.8 + st.phase);
          if (twinkle > 0.35) {
            bufCtx.fillStyle = twinkle > 0.78 ? "#f2ebe0" : "#6c7c5a";
            bufCtx.fillRect(sx, sy, 1, 1);
            if (st.big && twinkle > 0.82) {
              bufCtx.fillRect(sx - 1, sy, 3, 1);
              bufCtx.fillRect(sx, sy - 1, 1, 3);
            }
          }
        }

        // Crisp crescent moon in upper-left open sky (clear of navbar & mobile canopy)
        const isNarrow = m.w < 768;
        const moonX = Math.round(bw * (isNarrow ? 0.13 : 0.18) + parallaxX * 0.18);
        const moonY = Math.round(
          isNarrow
            ? Math.max(84 / m.scale, canopyCy - canopyRy * 0.55)
            : bh * 0.19
        );
        const moonR = Math.max(5, Math.round(Math.min(bw, bh) * 0.036));

        const moonHalo = bufCtx.createRadialGradient(moonX, moonY, moonR * 0.8, moonX, moonY, moonR * 3.8);
        moonHalo.addColorStop(0, "rgba(108, 124, 90, 0.24)");
        moonHalo.addColorStop(0.38, "rgba(52, 60, 46, 0.16)");
        moonHalo.addColorStop(0.72, "rgba(52, 60, 46, 0.05)");
        moonHalo.addColorStop(1, "rgba(26, 25, 23, 0)");
        bufCtx.fillStyle = moonHalo;
        bufCtx.beginPath();
        bufCtx.arc(moonX, moonY, moonR * 3.8, 0, Math.PI * 2);
        bufCtx.fill();

        bufCtx.fillStyle = "#f2ebe0";
        bufCtx.beginPath();
        bufCtx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
        bufCtx.fill();

        bufCtx.fillStyle = "#1a1917";
        bufCtx.beginPath();
        bufCtx.arc(moonX + moonR * 0.42, moonY - moonR * 0.18, moonR * 0.86, 0, Math.PI * 2);
        bufCtx.fill();

        // Soft moonlit sage mist behind tree & character (clipped cleanly above hillBottomY)
        bufCtx.save();
        bufCtx.beginPath();
        bufCtx.rect(0, 0, bw, hillBottomY);
        bufCtx.clip();

        const mistR = charSize * 1.18;
        const mistGrad = bufCtx.createRadialGradient(
          charX + charSize * 0.04,
          groundY - charSize * 0.45,
          charSize * 0.12,
          charX + charSize * 0.04,
          groundY - charSize * 0.45,
          mistR
        );
        mistGrad.addColorStop(0, "rgba(108, 124, 90, 0.36)");
        mistGrad.addColorStop(0.32, "rgba(52, 60, 46, 0.34)");
        mistGrad.addColorStop(0.65, "rgba(52, 60, 46, 0.14)");
        mistGrad.addColorStop(0.86, "rgba(52, 60, 46, 0.03)");
        mistGrad.addColorStop(1, "rgba(26, 25, 23, 0)");
        bufCtx.fillStyle = mistGrad;
        bufCtx.beginPath();
        bufCtx.arc(charX + charSize * 0.04, groundY - charSize * 0.45, mistR, 0, Math.PI * 2);
        bufCtx.fill();
        bufCtx.restore();
      }

      // ─── 3. Distant Rolling Hill ───
      bufCtx.fillStyle = light ? "#bcc6a6" : "#272e23";
      bufCtx.beginPath();
      bufCtx.moveTo(0, hillBottomY);
      for (let x = 0; x <= bw; x += 6) {
        const u = x / bw;
        const hillY =
          groundY -
          8 -
          Math.sin(u * Math.PI * 1.15 + 0.4) * (bh * 0.042) -
          Math.cos(u * Math.PI * 2.2) * (bh * 0.014) +
          parallaxX * 0.15;
        bufCtx.lineTo(x, hillY);
      }
      bufCtx.lineTo(bw, hillBottomY);
      bufCtx.closePath();
      bufCtx.fill();

      // ─── 4. Foreground Meadow Knoll ───
      const meadowBase = light ? "#9aa880" : "#343c2e";
      const meadowLit = light ? "#b6c29d" : "#4b5941";
      const hillGrad = bufCtx.createLinearGradient(0, groundY - 10, 0, hillBottomY);
      hillGrad.addColorStop(0, meadowLit);
      hillGrad.addColorStop(0.45, meadowBase);
      hillGrad.addColorStop(1, light ? "#9aa880" : "#242a20");
      bufCtx.fillStyle = hillGrad;

      const knollProfile = (x: number) => {
        const dx = (x - (charX + charSize * 0.12)) / (bw * 0.36);
        const mound = Math.exp(-dx * dx * 1.4) * (bh * 0.024);
        const slope = Math.sin((x / bw) * Math.PI * 1.6) * (bh * 0.012);
        return groundY - mound + slope;
      };

      bufCtx.beginPath();
      bufCtx.moveTo(0, hillBottomY);
      for (let x = 0; x <= bw; x += 4) {
        bufCtx.lineTo(x, knollProfile(x));
      }
      bufCtx.lineTo(bw, hillBottomY);
      bufCtx.closePath();
      bufCtx.fill();

      // Dappled shade beneath tree canopy & character
      bufCtx.fillStyle = light ? "rgba(92, 105, 67, 0.36)" : "rgba(14, 14, 13, 0.55)";
      bufCtx.beginPath();
      bufCtx.ellipse(
        charX + charSize * 0.12,
        groundY + 3,
        charSize * 0.85,
        Math.max(4, charSize * 0.075),
        0,
        0,
        Math.PI * 2
      );
      bufCtx.fill();

      // Soft contact shadow directly under seated character
      bufCtx.fillStyle = light ? "rgba(38, 37, 35, 0.30)" : "rgba(14, 14, 13, 0.72)";
      bufCtx.beginPath();
      bufCtx.ellipse(charX, charBaseY - 1, charSize * 0.25, Math.max(2.5, charSize * 0.036), 0, 0, Math.PI * 2);
      bufCtx.fill();

      // ─── 5. Tree Trunk, Gnarled Roots & Boughs ───
      const trunkBaseY = groundY + 4;
      const trunkTopY = canopyCy + canopyRy * 0.15;
      const trunkW = Math.max(10, charSize * 0.22);

      // Trunk main body & flare into meadow roots
      bufCtx.fillStyle = light ? "#4e473c" : "#1c1b18";
      bufCtx.beginPath();
      bufCtx.moveTo(treeX - trunkW * 0.95, trunkBaseY + 2);
      bufCtx.quadraticCurveTo(treeX - trunkW * 0.52, trunkBaseY - charSize * 0.25, treeX - trunkW * 0.42, trunkTopY);
      bufCtx.lineTo(treeX + trunkW * 0.38, trunkTopY);
      bufCtx.quadraticCurveTo(treeX + trunkW * 0.48, trunkBaseY - charSize * 0.25, treeX + trunkW * 1.05, trunkBaseY + 3);
      bufCtx.closePath();
      bufCtx.fill();

      // Leftward sweeping main bough + secondary right branch
      bufCtx.strokeStyle = light ? "#4e473c" : "#1c1b18";
      bufCtx.lineCap = "round";
      bufCtx.lineWidth = Math.max(4, trunkW * 0.46);
      bufCtx.beginPath();
      bufCtx.moveTo(treeX - trunkW * 0.15, trunkTopY + charSize * 0.16);
      bufCtx.quadraticCurveTo(
        treeX - charSize * 0.34,
        canopyCy + canopyRy * 0.35,
        canopyCx - canopyRx * 0.48,
        canopyCy + canopyRy * 0.1
      );
      bufCtx.stroke();

      bufCtx.lineWidth = Math.max(3, trunkW * 0.32);
      bufCtx.beginPath();
      bufCtx.moveTo(treeX + trunkW * 0.08, trunkTopY + charSize * 0.12);
      bufCtx.quadraticCurveTo(
        treeX + charSize * 0.25,
        canopyCy + canopyRy * 0.28,
        canopyCx + canopyRx * 0.52,
        canopyCy + canopyRy * 0.12
      );
      bufCtx.stroke();

      // Subtle sunlit / moonlit bark edge rim on left contour (keeps trunk crisp against night mist & dark hair)
      bufCtx.strokeStyle = light ? "#9aa880" : "#6c7c5a";
      bufCtx.lineWidth = 1.4;
      bufCtx.beginPath();
      bufCtx.moveTo(treeX - trunkW * 0.88, trunkBaseY + 1);
      bufCtx.quadraticCurveTo(treeX - trunkW * 0.48, trunkBaseY - charSize * 0.25, treeX - trunkW * 0.38, trunkTopY);
      bufCtx.stroke();

      // Dark bark grain grooves
      bufCtx.strokeStyle = light ? "#262523" : "#0e0e0d";
      bufCtx.lineWidth = 1;
      for (let g = -1; g <= 1; g++) {
        const gx = treeX + g * trunkW * 0.22;
        bufCtx.beginPath();
        bufCtx.moveTo(gx, trunkBaseY - charSize * 0.08);
        bufCtx.quadraticCurveTo(gx + 1.5, trunkBaseY - charSize * 0.42, gx - 1, trunkTopY + charSize * 0.14);
        bufCtx.stroke();
      }

      // ─── 6. Back Grass Blades & Wildflowers ───
      const windWave = (gx: number) => {
        const wave =
          Math.sin(gx * 0.065 - tSec * 2.1) * 1.4 +
          Math.sin(gx * 0.14 - tSec * 3.4) * 0.5;
        let gust = 0;
        if (gustRef.current.strength > 0.01) {
          const distG = Math.abs(gx - gustRef.current.x * bw);
          gust = Math.exp(-(distG * distG) / 1400) * gustRef.current.strength * 4.2;
        }
        let ptrBend = 0;
        if (ptr.active) {
          const dx = gx - ptrBufX;
          const dy = knollProfile(gx) - ptrBufY;
          const d2 = dx * dx + dy * dy;
          if (d2 < 900) {
            ptrBend = Math.sign(dx || 1) * (1 - d2 / 900) * 3.2;
          }
        }
        return wave + gust + ptrBend;
      };

      const drawGrassList = (fgOnly: boolean) => {
        for (const blade of seedsRef.current.grass) {
          if (blade.fg !== fgOnly) continue;
          const gx = blade.u * bw;
          // Concentrate foreground blades near character feet
          if (fgOnly && Math.abs(gx - charX) > charSize * 0.46) continue;

          const gy = knollProfile(gx) + (fgOnly ? 1.5 : 0);
          const sway = windWave(gx) + blade.lean;
          const tipX = gx + sway * (blade.h / 7);
          const tipY = gy - blade.h;

          bufCtx.strokeStyle = light
            ? blade.h > 8.5
              ? "#5c6943"
              : "#9aa880"
            : blade.h > 8.5
            ? "#6c7c5a"
            : "#343c2e";
          bufCtx.lineWidth = blade.thick;
          bufCtx.beginPath();
          bufCtx.moveTo(gx, gy + 1);
          bufCtx.quadraticCurveTo(gx + sway * 0.35, gy - blade.h * 0.5, tipX, tipY);
          bufCtx.stroke();

          if (!fgOnly && blade.flowerColor) {
            bufCtx.fillStyle = light ? "#f5f4f1" : "#daba98";
            bufCtx.fillRect(Math.round(tipX) - 1, Math.round(tipY) - 1, 2, 2);
          }
        }
      };

      drawGrassList(false);

      // ─── 7. Seated Character Sprite ───
      const spriteVariant = spritesRef.current[activeSprite] || spritesRef.current.asleep;
      if (spriteVariant) {
        const spriteCanvas = light ? spriteVariant.day : spriteVariant.night;
        const breathe = Math.sin(tSec * 1.55);
        const swayAngle =
          currentMood === "awake" && ptr.active
            ? clamp((ptr.x * bw - charX) / (bw * 0.45), -1, 1) * 0.02
            : 0.01 * Math.sin(tSec * 0.78);

        const breathScaleY =
          (currentMood === "asleep" ? 1 + 0.012 * breathe : 1 + 0.007 * breathe) *
          startleScaleY;
        const breathScaleX = 1 - 0.004 * breathe;

        bufCtx.save();
        bufCtx.translate(charX, charBaseY + startleOffset);
        bufCtx.rotate(swayAngle);
        bufCtx.scale(breathScaleX, breathScaleY);
        // Seat bottom inside 512x512 sits at y=496/512=0.96875
        bufCtx.drawImage(
          spriteCanvas,
          -charSize * 0.5,
          -charSize * (496 / 512),
          charSize,
          charSize
        );
        bufCtx.restore();
      }

      // ─── 8. Foreground Grass Overlapping Seated Legs ───
      drawGrassList(true);

      // ─── 9. Tree Canopy Foliage Clusters (varied organic oak silhouette) ───
      const rustle = rustleRef.current;
      const canopySwayX = Math.sin(tSec * 1.15) * 1.6 + Math.sin(tSec * 11.5) * rustle * 2.2;
      const canopySwayY = Math.cos(tSec * 1.65) * 0.7 + Math.cos(tSec * 9.0) * rustle * 1.1;

      const puffs = [
        // Back / under-canopy shade tier
        { ox: -0.64, oy: 0.18, rx: 0.28, ry: 0.26, tier: 0 },
        { ox: -0.22, oy: 0.20, rx: 0.32, ry: 0.28, tier: 0 },
        { ox: 0.22, oy: 0.22, rx: 0.30, ry: 0.26, tier: 0 },
        { ox: 0.60, oy: 0.14, rx: 0.26, ry: 0.24, tier: 0 },
        // Mid foliage clusters
        { ox: -0.82, oy: 0.02, rx: 0.26, ry: 0.24, tier: 1 },
        { ox: -0.46, oy: -0.08, rx: 0.31, ry: 0.30, tier: 1 },
        { ox: -0.05, oy: -0.10, rx: 0.34, ry: 0.32, tier: 1 },
        { ox: 0.38, oy: -0.06, rx: 0.31, ry: 0.28, tier: 1 },
        { ox: 0.72, oy: 0.00, rx: 0.24, ry: 0.22, tier: 1 },
        // Top sunlit / moonlit crown highlights
        { ox: -0.54, oy: -0.24, rx: 0.24, ry: 0.22, tier: 2 },
        { ox: -0.18, oy: -0.34, rx: 0.28, ry: 0.25, tier: 2 },
        { ox: 0.20, oy: -0.30, rx: 0.26, ry: 0.24, tier: 2 },
        { ox: 0.50, oy: -0.20, rx: 0.22, ry: 0.20, tier: 2 },
      ];

      for (let i = 0; i < puffs.length; i++) {
        const pf = puffs[i];
        const px = canopyCx + pf.ox * canopyRx + canopySwayX * (0.7 + (i % 3) * 0.18);
        const py = canopyCy + pf.oy * canopyRy + canopySwayY;
        const prx = pf.rx * canopyRx;
        const pry = pf.ry * canopyRy;

        if (pf.tier === 0) {
          bufCtx.fillStyle = light ? "#485434" : "#22291e";
        } else if (pf.tier === 1) {
          bufCtx.fillStyle = light ? "#5c6943" : "#343c2e";
        } else {
          bufCtx.fillStyle = light ? "#9aa880" : "#6c7c5a";
        }

        bufCtx.beginPath();
        bufCtx.ellipse(px, py, prx, pry, 0, 0, Math.PI * 2);
        bufCtx.fill();
      }

      // ─── 10. Soft Dithered Bottom Horizon Dissolve (keeps bio text crystal clear) ───
      const dissolveTop = Math.max(groundY + 2, hillBottomY - Math.max(12, (hillBottomY - groundY) * 0.65));
      const dissolveGrad = bufCtx.createLinearGradient(0, dissolveTop, 0, hillBottomY + 1);
      if (light) {
        dissolveGrad.addColorStop(0, "rgba(245, 244, 241, 0)");
        dissolveGrad.addColorStop(1, "rgba(245, 244, 241, 1)");
      } else {
        dissolveGrad.addColorStop(0, "rgba(26, 25, 23, 0)");
        dissolveGrad.addColorStop(1, "rgba(26, 25, 23, 1)");
      }
      bufCtx.fillStyle = dissolveGrad;
      bufCtx.fillRect(0, dissolveTop, bw, bh - dissolveTop);

      // ─── 11. Ambient Particles (Zzz, Falling Leaves, Pollen / Fireflies) ───
      for (const zg of zGlyphsRef.current) {
        const age = (nowMs - zg.born) / 1000;
        const p = clamp(age / zg.life, 0, 1);
        const zx = charX + charSize * 0.14 + zg.xOff + Math.sin(p * Math.PI * 2) * 3.5 + p * 8;
        const zy = charBaseY - charSize * 0.78 - p * (charSize * 0.34);
        const alpha = p < 0.2 ? p / 0.2 : 1 - (p - 0.2) / 0.8;
        if (alpha > 0.15) {
          drawPixelZ(
            bufCtx,
            zx,
            zy,
            1,
            light
              ? `rgba(38, 37, 35, ${alpha * 0.78})`
              : `rgba(242, 235, 224, ${alpha * 0.85})`
          );
        }
      }

      // Falling leaves
      bufCtx.fillStyle = light ? "#5c6943" : "#6c7c5a";
      for (const leaf of leavesRef.current) {
        const fade = clamp(1 - leaf.life / leaf.maxLife, 0, 1);
        if (fade > 0.15) {
          bufCtx.fillRect(
            Math.round(leaf.x),
            Math.round(leaf.y),
            Math.round(leaf.size),
            1
          );
        }
      }

      // Light: drifting sunlit pollen; Dark: pulsing fireflies
      for (const mote of seedsRef.current.motes) {
        const mx = (((mote.x + tSec * mote.drift) % 1) + 1) % 1 * bw;
        const baseY = light
          ? ((mote.y * 0.75 + 0.08 + Math.sin(tSec * mote.speed + mote.phase) * 0.03) * bh)
          : groundY - 4 - mote.y * (charSize * 0.55) + Math.sin(tSec * mote.speed + mote.phase) * 4;

        if (light) {
          bufCtx.fillStyle = "rgba(233, 206, 178, 0.85)";
          bufCtx.fillRect(Math.round(mx), Math.round(baseY), 1, 1);
        } else {
          const pulse = 0.25 + 0.75 * Math.pow(0.5 + 0.5 * Math.sin(tSec * 2.2 + mote.phase), 2);
          if (pulse > 0.3) {
            const halo = bufCtx.createRadialGradient(mx, baseY, 0.5, mx, baseY, 4.5);
            halo.addColorStop(0, `rgba(242, 235, 224, ${pulse})`);
            halo.addColorStop(0.5, `rgba(218, 186, 152, ${pulse * 0.45})`);
            halo.addColorStop(1, "rgba(26, 25, 23, 0)");
            bufCtx.fillStyle = halo;
            bufCtx.beginPath();
            bufCtx.arc(mx, baseY, 4.5, 0, Math.PI * 2);
            bufCtx.fill();
          }
        }
      }

      // ─── 12. Unified 4x4 Bayer Multi-Tone Dither Pass ───
      const imgData = bufCtx.getImageData(0, 0, bw, bh);
      const src = imgData.data;
      const out32 = new Uint32Array(imgData.data.buffer);

      const bgPal = palette[0];
      const bgPacked = packRgba(bgPal.r, bgPal.g, bgPal.b);
      const palLen = palette.length;
      const palR = new Int32Array(palLen);
      const palG = new Int32Array(palLen);
      const palB = new Int32Array(palLen);
      const palPacked = new Uint32Array(palLen);

      for (let p = 0; p < palLen; p++) {
        palR[p] = palette[p].r;
        palG[p] = palette[p].g;
        palB[p] = palette[p].b;
        palPacked[p] = packRgba(palette[p].r, palette[p].g, palette[p].b);
      }

      const spread = 46;
      for (let y = 0; y < bh; y++) {
        const rowOff = y * bw;
        const bayerRow = (y & 3) << 2;
        for (let x = 0; x < bw; x++) {
          const idx = rowOff + x;
          const p4 = idx << 2;
          const r0 = src[p4];
          const g0 = src[p4 + 1];
          const b0 = src[p4 + 2];

          // Preserve untouched page background pixels without noise speckling
          if (
            Math.abs(r0 - bgPal.r) <= 1 &&
            Math.abs(g0 - bgPal.g) <= 1 &&
            Math.abs(b0 - bgPal.b) <= 1
          ) {
            out32[idx] = bgPacked;
            continue;
          }

          const d = BAYER_4X4[bayerRow | (x & 3)] * spread;
          const r = r0 + d;
          const g = g0 + d;
          const b = b0 + d;

          // Keep dark-mode brighter-than-bg sky mist/halos from snapping down to #0e0e0d
          const skipObsidian =
            !light && r0 >= bgPal.r - 1 && g0 >= bgPal.g - 1 && b0 >= bgPal.b - 1;

          let bestIdx = 0;
          let bestDist = 1e12;
          for (let k = 0; k < palLen; k++) {
            if (skipObsidian && k === 1) continue;
            const dr = r - palR[k];
            const dg = g - palG[k];
            const db = b - palB[k];
            const dist = 2 * dr * dr + 4 * dg * dg + 3 * db * db;
            if (dist < bestDist) {
              bestDist = dist;
              bestIdx = k;
            }
          }
          out32[idx] = palPacked[bestIdx];
        }
      }

      bufCtx.putImageData(imgData, 0, 0);

      // Crisp nearest-neighbor scale onto full-viewport canvas
      dispCtx.imageSmoothingEnabled = false;
      dispCtx.clearRect(0, 0, canvas.width, canvas.height);
      dispCtx.drawImage(bufCanvas, 0, 0, canvas.width, canvas.height);
    };

    let rafId = 0;
    let lastFrameMs = performance.now();
    let lastRenderMs = 0;
    const startMs = performance.now();
    const FRAME_INTERVAL = 1000 / 24;

    const tick = (nowMs: number) => {
      if (reduceMotion) {
        if (needsStaticDrawRef.current || moodRef.current !== "asleep") {
          needsStaticDrawRef.current = false;
          const dt = Math.min(0.1, (nowMs - lastFrameMs) / 1000);
          lastFrameMs = nowMs;
          drawFrame(nowMs, 0, dt);
        }
      } else {
        const sinceRender = nowMs - lastRenderMs;
        if (sinceRender >= FRAME_INTERVAL || needsStaticDrawRef.current) {
          needsStaticDrawRef.current = false;
          const dt = Math.min(0.1, (nowMs - lastFrameMs) / 1000);
          lastFrameMs = nowMs;
          lastRenderMs = nowMs;
          drawFrame(nowMs, (nowMs - startMs) / 1000, dt);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", computeLayout);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [commitState, computeLayout, spawnLeaves]);

  // Ambient tree rustle / meadow breeze when clicking scenery outside bio or character
  const handleSceneClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const m = layoutRef.current;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!m || !rect) return;

      const x = (e.clientX - rect.left) / m.scale;
      const y = (e.clientY - rect.top) / m.scale;

      // Check canopy ellipse
      const dx = (x - m.canopyCx) / m.canopyRx;
      const dy = (y - m.canopyCy) / m.canopyRy;
      if (dx * dx + dy * dy <= 1.25) {
        rustleRef.current = 1.0;
        spawnLeaves(3, 1.1);
      } else {
        gustRef.current = { x: clamp(x / m.bw, 0, 1), strength: 1.0 };
      }
    },
    [spawnLeaves]
  );

  return (
    <div
      ref={containerRef}
      onClick={handleSceneClick}
      className={`select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="block h-full w-full pointer-events-none"
        style={{ imageRendering: "pixelated" }}
      />

      {overlayPos && (
        <>
          {/* Accessible transparent interactive button anchored over the sitting character */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerWake();
            }}
            onMouseEnter={() => {
              hoverCharRef.current = true;
              setIsHovered(true);
              rustleRef.current = Math.max(rustleRef.current, 0.55);
            }}
            onMouseLeave={() => {
              hoverCharRef.current = false;
              setIsHovered(false);
            }}
            aria-label={
              mood === "asleep"
                ? "Character asleep under the meadow tree — click to wake him up"
                : mood === "groggy"
                ? "Character groggy — click again"
                : "Character awake — click again"
            }
            className="absolute z-30 cursor-pointer rounded-2xl bg-transparent outline-none focus-visible:ring-1 focus-visible:ring-foreground/50"
            style={{
              left: overlayPos.hitRect.left,
              top: overlayPos.hitRect.top,
              width: overlayPos.hitRect.width,
              height: overlayPos.hitRect.height,
            }}
          />

          {/* Subtle hover hint before first discovery */}
          <AnimatePresence>
            {isHovered && mood === "asleep" && wakes === 0 && !bubbleText && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 0.58, y: 0 }}
                exit={{ opacity: 0, y: 2 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full whitespace-nowrap font-geistMono text-[11px] lowercase tracking-[0.02em] text-foreground"
                style={{
                  left: overlayPos.headX,
                  top: Math.max(70, overlayPos.headY - 8),
                }}
              >
                click to wake
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lowercase affirmation / groggy speech bubble */}
          <AnimatePresence mode="wait">
            {bubbleText && (
              <motion.div
                key={bubbleText}
                initial={{ opacity: 0, y: 5, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 3, scale: 0.97 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-[8px] px-3 py-1.5 font-geistMono text-[12px] lowercase leading-none text-foreground"
                style={{
                  left: overlayPos.headX,
                  top: Math.max(76, overlayPos.headY - 12),
                  background: isLight
                    ? "color-mix(in srgb, var(--background-color) 45%, #ffffff)"
                    : "color-mix(in srgb, var(--background-color) 93%, var(--foreground-color))",
                  border: `1px solid color-mix(in srgb, var(--foreground-color) ${
                    isLight ? 12 : 10
                  }%, transparent)`,
                  boxShadow: isLight
                    ? "0 1px 2px rgba(38, 37, 35, 0.06), 0 8px 24px -10px rgba(38, 37, 35, 0.16)"
                    : "0 2px 4px rgba(0, 0, 0, 0.3), 0 12px 28px -10px rgba(0, 0, 0, 0.55)",
                }}
              >
                {bubbleText}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
