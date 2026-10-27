"use client";

import React, { useEffect, useRef } from "react";
import type { ThemeMode } from "@/components/ThemeProvider";

export interface AsciiOrcaGridProps {
  theme?: ThemeMode;
  isLight?: boolean;
  className?: string;
  onStats?: (stats: { pod: number; ripples: number }) => void;
}

const TWO_PI = 2 * Math.PI;
const STEP_DT = 1 / 60;

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

function smoothstep(e0: number, e1: number, x: number) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

function angleDiff(a: number, b: number) {
  let d = (b - a) % TWO_PI;
  if (d > Math.PI) d -= TWO_PI;
  if (d < -Math.PI) d += TWO_PI;
  return d;
}

function hash(x: number, y: number, seed: number) {
  let r =
    Math.imul(0 | x, 374761393) ^
    Math.imul(0 | y, 668265263) ^
    Math.imul(0 | seed, 1442695041);
  r = Math.imul(r ^ (r >>> 13), 1274126177);
  return ((r ^= r >>> 16) >>> 0) / 4294967296;
}

const packRgb = (c: number[]) => (c[0] << 16) | (c[1] << 8) | c[2];

const GLYPH_RAMP = "t%SX8@#";
const SUBSAMPLES = [0.25, 0.25, 0.75, 0.25, 0.25, 0.75, 0.75, 0.75];

function contourGlyph(nx: number, ny: number) {
  const len = Math.hypot(nx, ny) || 1;
  if (Math.abs(ny) < 0.38 * len) return "-";
  if (Math.abs(nx) < 0.38 * len) return "|";
  return nx * ny > 0 ? "\\" : "/";
}

// ─────────────────────────────────────────────────────────────────────────────
// 3D ORCA SILHOUETTE GEOMETRY (Supports Top, Side, 3/4 Bank, and Bottom Views)
// ─────────────────────────────────────────────────────────────────────────────
function bodyHalfWidth(s: number) {
  if (s < 0.14) {
    // Rounded conical rostrum / head
    return 0.125 * Math.pow(Math.sin(((s / 0.14) * Math.PI) / 2), 0.58);
  }
  if (s < 0.36) {
    // Broad arched torso
    return 0.125 + 0.025 * smoothstep(0.14, 0.32, s);
  }
  if (s < 0.78) {
    // Smooth taper down to narrow caudal peduncle (tail stock)
    return 0.026 + 0.124 * (1 - smoothstep(0.36, 0.78, s));
  }
  return 0.026;
}

// Protruding Triangular Dorsal Fin on the dorsal back (s in [0.34, 0.54])
function dorsalFinProtrusion(s: number, isBull: boolean) {
  if (s < 0.34 || s > 0.54) return 0;
  const peakS = 0.455;
  const maxHeight = isBull ? 0.128 : 0.1;
  if (s <= peakS) {
    const t = (s - 0.34) / (peakS - 0.34);
    return maxHeight * Math.pow(t, 1.15);
  } else {
    const t = 1 - (s - peakS) / (0.54 - peakS);
    return maxHeight * Math.pow(Math.max(0, t), 0.75);
  }
}

// Paddle-shaped pectoral flippers (project in 3D for Top, Side, and Bottom views)
function samplePectoralFin(
  s: number,
  uNorm: number,
  side: number,
  sinPhi: number,
  cosPhi: number,
  flare: number,
  hit: { flag: number; across: number; du: number; da: number }
) {
  // In Top view (cosPhi ~ +1) or Bottom view (cosPhi ~ -1), both left and right
  // paddle flippers extend symmetrically! In Side view (|sinPhi| ~ 1), the
  // ventral side (side * sinPhi > 0) shows the full paddle flipper.
  const isVentralScreenSide = side * sinPhi >= 0;
  const topOrBottomSymmetry = Math.abs(cosPhi);
  const finProminence = isVentralScreenSide
    ? 1.0
    : 0.38 + 0.62 * topOrBottomSymmetry;

  const sCenter = isVentralScreenSide ? 0.255 : 0.245;
  const baseW = (0.84 - 0.08 * finProminence) * bodyHalfWidth(sCenter);
  const angle = 0.74 + 0.35 * (flare - 1);
  const major = (0.046 + 0.036 * finProminence) * flare;
  const minor = 0.026 + 0.014 * finProminence;

  const c = Math.cos(angle);
  const sn = Math.sin(angle);
  const ds = s - sCenter;
  const du = uNorm - baseW;
  const rx = (ds * c + du * sn - major) / major;
  const ry = (-ds * sn + du * c) / minor;
  if (rx * rx + ry * ry > 1) return false;
  hit.flag = 2; // Jet-black pectoral paddle fin
  hit.du = ds;
  hit.da = du;
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// THEME PALETTES (Ocean Blue, Dao Ho Charcoal Black, Warm Paper Light)
// ─────────────────────────────────────────────────────────────────────────────
interface OrcaPalette {
  bg: number[];
  blackTile: number[];       // Jet-black orca dorsal coat
  blackGlyph: number[];      // Subtle slate glyph inside black cells
  whiteTile: number[];       // Stark white belly, chin, flank lobe & eye patch
  whiteGlyph: number[];      // Crisp dark glyph inside white cells
  saddleTile: number[];      // Cool grey saddle patch behind dorsal fin
  dorsalRidgeTile: number[]; // Highlighted spine ridge in top-down view
  rimGlyph: number[];        // Edge contour highlight so black pops on dark bg
  eye: number[];
  water: number[];
  waterDotAlpha: number;
  tealAccent: number[];
  shadow: number[];
  shadowAlpha: number;
  alpha: number;
  depthFloor: number;
}

const OCEAN_PALETTE: OrcaPalette = {
  bg: [13, 29, 51],              // Deep Ocean Blue (#0d1d33)
  blackTile: [10, 13, 19],       // True Jet Black dorsal silhouette
  blackGlyph: [58, 70, 88],      // Subtle slate ASCII texture
  whiteTile: [238, 243, 249],    // Stark crisp Orca White (#eef3f9)
  whiteGlyph: [78, 92, 110],     // Soft ink glyph inside white markings
  saddleTile: [120, 136, 156],   // Grey saddle patch
  dorsalRidgeTile: [34, 44, 58], // Top-down dorsal fin spine ridge
  rimGlyph: [95, 135, 175],      // Crisp edge outline
  eye: [8, 10, 14],
  water: [195, 222, 248],
  waterDotAlpha: 0.22,
  tealAccent: [92, 225, 230],
  shadow: [4, 10, 20],
  shadowAlpha: 0.55,
  alpha: 0.96,
  depthFloor: 0.65,
};

const DARK_PALETTE: OrcaPalette = {
  bg: [26, 25, 23],              // Dao Ho Charcoal Black (#1a1917)
  blackTile: [9, 10, 13],        // Deep obsidian black
  blackGlyph: [68, 74, 84],      // Visible silver-slate ASCII texture on black body
  whiteTile: [238, 235, 228],    // Stark warm white belly & eye patch
  whiteGlyph: [72, 70, 66],      // Dark glyph inside white belly
  saddleTile: [126, 130, 138],   // Grey saddle patch
  dorsalRidgeTile: [42, 46, 54], // Top-down dorsal fin spine ridge
  rimGlyph: [135, 145, 158],     // Crisp rim outline so black back pops on #1a1917
  eye: [10, 10, 12],
  water: [255, 247, 240],
  waterDotAlpha: 0.14,
  tealAccent: [72, 188, 206],
  shadow: [0, 0, 0],
  shadowAlpha: 0.6,
  alpha: 0.96,
  depthFloor: 0.65,
};

const LIGHT_PALETTE: OrcaPalette = {
  bg: [245, 244, 241],           // Warm Paper (#f5f4f1)
  blackTile: [20, 22, 27],       // Rich sumi-ink black body
  blackGlyph: [88, 96, 108],
  whiteTile: [255, 255, 255],    // Pure white belly & eye patch
  whiteGlyph: [110, 115, 122],
  saddleTile: [152, 160, 170],
  dorsalRidgeTile: [52, 58, 68],
  rimGlyph: [55, 62, 72],
  eye: [16, 18, 22],
  water: [38, 37, 35],
  waterDotAlpha: 0.14,
  tealAccent: [36, 138, 156],
  shadow: [60, 58, 56],
  shadowAlpha: 0.22,
  alpha: 0.94,
  depthFloor: 0.7,
};

type RollPosture = "side" | "top" | "bottom";

interface OrcaAgent {
  id: number;
  role: "bull" | "adult" | "calf";
  length: number;
  nodes: Float32Array;
  heading: number;
  speed: number;
  phase: number;
  turn: number;
  wander: number;
  curiosity: number;
  depth: number;
  depthTarget: number;
  depthMax: number;
  nextDive: number;
  nextSurface: number;
  beat: number;
  rush: number;
  finPhase: number;
  startle: number;
  fleeX: number;
  fleeY: number;
  gulp: number;
  // 3D Roll orientation around spine:
  //   0      = TOP / DORSAL view (back, dorsal ridge, symmetric saddle & dual eye patches)
  //   +PI/2  = LEFT-FACING SIDE profile (tall dorsal fin up, white belly down)
  //   -PI/2  = RIGHT-FACING SIDE profile (tall dorsal fin up, white belly down)
  //   +-PI   = BOTTOM / VENTRAL view (stark white underside, chin, chest & trident lobes)
  rollAngle: number;
  rollTarget: number;
  posture: RollPosture;
  nextPostureAt: number;
  barrelOffset: number;
}

interface RippleWave {
  x: number;
  y: number;
  born: number;
  strength: number;
  isTeal?: boolean;
}

interface PelletBlip {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  landAt: number;
  landed: boolean;
}

interface BiteSpark {
  x: number;
  y: number;
  born: number;
}

function rippleDuration(r: RippleWave) {
  return 2.2 + 1.6 * r.strength;
}

class OrcaPodWorld {
  width = 0;
  height = 0;
  time = 0;
  lastFeed = -10;
  orcas: OrcaAgent[] = [];
  ripples: RippleWave[] = [];
  pellets: PelletBlip[] = [];
  bites: BiteSpark[] = [];
  pointer = { x: 0, y: 0, speed: 0, active: false };
  avoid: { left: number; top: number; right: number; bottom: number }[] = [];

  resize(w: number, h: number) {
    const first = this.width === 0;
    this.width = w;
    this.height = h;
    if (first && w > 0 && h > 0) {
      this.seed();
    }
  }

  seed() {
    const { width: w, height: h } = this;
    const baseSize = clamp(0.54 * Math.min(w, h), 190, 430);
    const count = w >= 900 ? 4 : 3;
    this.orcas = [];

    // Give the pod varied initial 3D orientations so you immediately see
    // Side-Profile, Top-Down Dorsal, and Bottom-Up Ventral views!
    const initialPostures: RollPosture[] = ["side", "top", "bottom", "side"];

    for (let idx = 0; idx < count; idx++) {
      const isBull = idx === 0;
      const isCalf = idx === count - 1;
      const role: "bull" | "adult" | "calf" = isBull
        ? "bull"
        : isCalf
        ? "calf"
        : "adult";

      const length =
        baseSize *
        (isBull
          ? rand(0.98, 1.06)
          : isCalf
          ? rand(0.45, 0.52)
          : rand(0.74, 0.86));
      const depthMax = isCalf ? 0.85 : 1;
      const heading = rand(0, TWO_PI);
      const startX = rand(0.22 * w, 0.86 * w);
      const startY = rand(0.16 * h, 0.8 * h);
      const nodes = new Float32Array(40);
      const seg = length / 19;

      for (let i = 0; i < 20; i++) {
        nodes[2 * i] = startX - Math.cos(heading) * seg * i;
        nodes[2 * i + 1] = startY - Math.sin(heading) * seg * i;
      }

      const posture = initialPostures[idx % initialPostures.length];
      const uprightSideAngle =
        Math.cos(heading) >= 0 ? -Math.PI * 0.46 : Math.PI * 0.46;
      const startRoll =
        posture === "top"
          ? rand(-0.22, 0.22)
          : posture === "bottom"
          ? Math.PI * (Math.random() < 0.5 ? 0.92 : -0.92)
          : uprightSideAngle;

      this.orcas.push({
        id: idx + 1,
        role,
        length,
        nodes,
        heading,
        speed: 22,
        phase: rand(0, TWO_PI),
        turn: 0,
        wander: 0,
        curiosity: rand(0.4, 1),
        depth: rand(0.7, depthMax),
        depthTarget: rand(0.7, depthMax),
        depthMax,
        nextDive: rand(6, 18),
        nextSurface: rand(3, 11),
        beat: 0,
        rush: 0,
        finPhase: rand(0, TWO_PI),
        startle: 0,
        fleeX: 0,
        fleeY: 0,
        gulp: 0,
        rollAngle: startRoll,
        rollTarget: startRoll,
        posture,
        nextPostureAt: rand(3.5, 8.5),
        barrelOffset: 0,
      });
    }
  }

  feed(x: number, y: number) {
    this.lastFeed = this.time;
    this.ripples.push({
      x,
      y,
      born: this.time,
      strength: 0.45,
      isTeal: true,
    });
    const count = Math.min(
      4 + Math.floor(3 * Math.random()),
      22 - this.pellets.length
    );
    for (let i = 0; i < count; i++) {
      const ang = rand(0, TWO_PI);
      const rad = 32 * Math.sqrt(Math.random());
      const spd = rand(2, 6);
      this.pellets.push({
        x: x + Math.cos(ang) * rad * 1.25,
        y: y + Math.sin(ang) * rad,
        born: this.time,
        landAt: rand(0.14, 0.42),
        landed: false,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
      });
    }
    for (const o of this.orcas) {
      if (Math.hypot(o.nodes[0] - x, o.nodes[1] - y) < 760) {
        o.rush = 1;
        // Trigger a playful 360 roll or belly-up roll when excited by a click!
        if (Math.abs(o.barrelOffset) < 0.2 && Math.random() < 0.65) {
          o.barrelOffset = (Math.random() < 0.5 ? 1 : -1) * TWO_PI;
        }
      }
    }
  }

  pickFood(hx: number, hy: number, maxRange: number) {
    let best: PelletBlip | null = null;
    let bestDist = maxRange;
    for (const p of this.pellets) {
      if (!p.landed) continue;
      const d = Math.hypot(p.x - hx, p.y - hy);
      if (d < bestDist) {
        bestDist = d;
        best = p;
      }
    }
    return best;
  }

  step(dt: number) {
    this.time += dt;
    this.pointer.speed *= Math.exp(-8 * dt);

    for (const o of this.orcas) {
      this.stepOrca(o, dt);
    }

    const now = this.time;
    this.pellets = this.pellets.filter((p) => now - p.born < 14);
    for (const p of this.pellets) {
      if (!p.landed) {
        if (now - p.born < p.landAt) continue;
        p.landed = true;
        this.ripples.push({
          x: p.x,
          y: p.y,
          born: now,
          strength: 0.12,
          isTeal: true,
        });
        continue;
      }
      const drag = Math.exp(-0.2 * dt);
      p.vx *= drag;
      p.vy *= drag;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }

    this.ripples = this.ripples.filter((r) => now - r.born < rippleDuration(r));
    this.bites = this.bites.filter((b) => now - b.born < 0.45);
  }

  stepOrca(o: OrcaAgent, dt: number) {
    const { width: w, height: h, pointer: ptr, time: now } = this;
    const len = o.length;
    const nodes = o.nodes;
    let hx = nodes[0];
    let hy = nodes[1];
    let dirX = Math.cos(o.heading);
    let dirY = Math.sin(o.heading);

    // 1. Gentle curving swim
    o.wander = clamp(o.wander + (Math.random() - 0.5) * dt * 2.0, -0.85, 0.85);
    dirX += 0.55 * Math.cos(o.heading + o.wander);
    dirY += 0.55 * Math.sin(o.heading + o.wander);

    // 2. Pod Flocking Behavior (Separation, Alignment, Escort Cohesion)
    let sepX = 0;
    let sepY = 0;
    let alignX = 0;
    let alignY = 0;
    let cohX = 0;
    let cohY = 0;
    let neighbors = 0;

    for (const other of this.orcas) {
      if (other.id === o.id) continue;
      const ox = other.nodes[0];
      const oy = other.nodes[1];
      const dx = hx - ox;
      const dy = hy - oy;
      const dist = Math.hypot(dx, dy) || 1;
      const minSep = 0.52 * (len + other.length);

      if (dist < minSep) {
        const push = (minSep - dist) / minSep;
        sepX += (dx / dist) * push * 2.8;
        sepY += (dy / dist) * push * 2.8;
      }

      if (dist < 520) {
        alignX += Math.cos(other.heading);
        alignY += Math.sin(other.heading);
        cohX += ox;
        cohY += oy;
        neighbors++;
      }
    }

    dirX += sepX;
    dirY += sepY;

    if (neighbors > 0) {
      dirX += (alignX / neighbors) * 0.38;
      dirY += (alignY / neighbors) * 0.38;
      const cx = cohX / neighbors - hx;
      const cy = cohY / neighbors - hy;
      const cd = Math.hypot(cx, cy) || 1;
      const cohWeight = o.role === "calf" ? 0.9 : 0.24;
      dirX += (cx / cd) * cohWeight;
      dirY += (cy / cd) * cohWeight;
    }

    // 3. Food / Sonar attraction & cursor reaction
    const food = this.pickFood(
      hx,
      hy,
      Math.max(1.6 * len + 220, o.rush > 0 ? 700 : 0)
    );
    const ptrDist = Math.hypot(ptr.x - hx, ptr.y - hy);
    const recentlyFed = now - this.lastFeed < 2;

    if (!food && !recentlyFed && ptr.active && ptr.speed > 1100 && ptrDist < 0.9 * len) {
      o.startle = 1;
      o.fleeX = ptr.x;
      o.fleeY = ptr.y;
    }
    o.startle = Math.max(0, o.startle - 0.6 * dt);

    if (o.startle > 0.3 && !food) {
      const fx = hx - o.fleeX;
      const fy = hy - o.fleeY;
      const fd = Math.hypot(fx, fy) || 1;
      dirX += (fx / fd) * 4 * o.startle;
      dirY += (fy / fd) * 4 * o.startle;
    } else if (food) {
      const fx = food.x - hx;
      const fy = food.y - hy;
      const fd = Math.hypot(fx, fy) || 1;
      dirX += (fx / fd) * 3.2;
      dirY += (fy / fd) * 3.2;

      if (fd < Math.max(16, 0.06 * len)) {
        this.bites.push({ x: food.x, y: food.y, born: now });
        this.pellets = this.pellets.filter((p) => p !== food);
        o.gulp = 1;
        o.rush = Math.max(0, o.rush - 0.4);
      }
    } else if (ptr.active && ptrDist < 340 && ptrDist > 45) {
      const px = ptr.x - hx;
      const py = ptr.y - hy;
      const pd = Math.hypot(px, py) || 1;
      const sign = o.curiosity > 0.55 ? 0.55 : -0.45;
      dirX += (px / pd) * sign;
      dirY += (py / pd) * sign;
    }

    // 4. Avoid text containers ([data-koi-avoid])
    for (const box of this.avoid) {
      const pad = 45;
      const futureX = hx + Math.cos(o.heading) * 0.35 * len;
      const futureY = hy + Math.sin(o.heading) * 0.35 * len;
      if (
        futureX > box.left - pad &&
        futureX < box.right + pad &&
        futureY > box.top - pad &&
        futureY < box.bottom + pad
      ) {
        const bcx = (box.left + box.right) * 0.5;
        const bcy = (box.top + box.bottom) * 0.5;
        const ax = hx - bcx;
        const ay = hy - bcy;
        const ad = Math.hypot(ax, ay) || 1;
        dirX += (ax / ad) * 3.8;
        dirY += (ay / ad) * 3.8;
      }
    }

    // 5. Soft viewport edge margin
    const edgePad = Math.max(85, 0.32 * len);
    if (hx < edgePad) dirX += ((edgePad - hx) / edgePad) * 2.4;
    if (hx > w - edgePad) dirX -= ((hx - (w - edgePad)) / edgePad) * 2.4;
    if (hy < edgePad) dirY += ((edgePad - hy) / edgePad) * 2.4;
    if (hy > h - edgePad) dirY -= ((hy - (h - edgePad)) / edgePad) * 2.4;

    // 6. Smooth heading & speed
    const desiredHeading = Math.atan2(dirY, dirX);
    const diff = angleDiff(o.heading, desiredHeading);
    const maxTurnRate = 2.2;
    const turnStep = clamp(diff, -maxTurnRate * dt, maxTurnRate * dt);
    o.heading = (o.heading + turnStep + TWO_PI) % TWO_PI;
    o.turn += (diff - o.turn) * Math.min(1, 6 * dt);

    const turnEffort = Math.min(1, Math.abs(diff) / 1.4);
    const targetBeat = clamp(
      0.22 + 0.45 * turnEffort + (food ? 0.55 : 0) + o.startle * 0.8,
      0.18,
      1.3
    );
    o.beat += (targetBeat - o.beat) * Math.min(1, 4 * dt);

    const cruiseSpeed = (0.18 + 0.3 * o.beat) * len;
    o.speed += (cruiseSpeed - o.speed) * Math.min(1, 3.5 * dt);

    o.phase = (o.phase + dt * (2.4 + 3.8 * o.beat)) % TWO_PI;
    o.finPhase = (o.finPhase + dt * (1.8 + 2.2 * o.beat)) % TWO_PI;
    o.gulp = Math.max(0, o.gulp - 2.2 * dt);
    o.rush = Math.max(0, o.rush - 0.35 * dt);

    // 7. Natural 3D Roll Orientation (Top, Side, 3/4 Bank, and Bottom Belly-Up)
    if (now >= o.nextPostureAt) {
      const rPick = Math.random();
      if (rPick < 0.40) {
        o.posture = "side";
      } else if (rPick < 0.72) {
        o.posture = "top";
      } else {
        o.posture = "bottom";
      }
      // Occasionally add a full 360 barrel roll transition when changing posture
      if (Math.random() < 0.25 && Math.abs(o.barrelOffset) < 0.1) {
        o.barrelOffset = (Math.random() < 0.5 ? 1 : -1) * TWO_PI;
      }
      o.nextPostureAt = now + rand(4.0, 9.0);
    }

    const cosH = Math.cos(o.heading);
    // In Side posture, keep the dorsal fin pointing upward on screen:
    //   swimming left (cosH < 0) -> rollAngle ~ +PI/2
    //   swimming right (cosH > 0) -> rollAngle ~ -PI/2
    const sideSignAngle =
      cosH > 0.12
        ? -Math.PI * 0.46
        : cosH < -0.12
        ? Math.PI * 0.46
        : o.rollTarget >= 0
        ? Math.PI * 0.46
        : -Math.PI * 0.46;

    const bankSway = clamp(o.turn * 0.65, -0.75, 0.75) + 0.18 * Math.sin(now * 0.9 + o.id * 1.7);

    if (o.posture === "side") {
      o.rollTarget = sideSignAngle + 0.18 * bankSway;
    } else if (o.posture === "top") {
      // Top-down dorsal view (0 rad), naturally banking into turns to show 3/4 side
      o.rollTarget = clamp(bankSway * 0.85, -0.85, 0.85);
    } else {
      // Bottom / Belly-Up ventral view (+-PI rad), rocking gently to show white belly & flank lobes
      const signPi = o.rollAngle >= 0 ? 1 : -1;
      o.rollTarget = signPi * Math.PI - 0.32 * bankSway;
    }

    // Decay barrel roll spin smoothly
    if (Math.abs(o.barrelOffset) > 0.01) {
      const stepSpin = o.barrelOffset * Math.min(1, 2.4 * dt);
      o.rollAngle += stepSpin;
      o.barrelOffset -= stepSpin;
    }

    const rDiff = angleDiff(o.rollAngle, o.rollTarget);
    o.rollAngle = angleDiff(0, o.rollAngle + rDiff * Math.min(1, 2.2 * dt));

    // 8. Depth & Occasional Surfacing with Ripple Trail
    if (now >= o.nextDive) {
      o.depthTarget = rand(0.68, o.depthMax);
      o.nextDive = now + rand(7, 16);
    }
    o.depth += (o.depthTarget - o.depth) * Math.min(1, 1.5 * dt);

    if (now >= o.nextSurface) {
      this.ripples.push({
        x: hx,
        y: hy,
        born: now,
        strength: rand(0.18, 0.32),
        isTeal: false,
      });
      o.nextSurface = now + rand(5, 13);
    }

    // Advance head
    hx += Math.cos(o.heading) * o.speed * dt;
    hy += Math.sin(o.heading) * o.speed * dt;
    nodes[0] = hx;
    nodes[1] = hy;

    // 9. Inverse Kinematics along the 20-node spine
    const segLen = len / 19;
    for (let i = 1; i < 20; i++) {
      const px = nodes[2 * (i - 1)];
      const py = nodes[2 * (i - 1) + 1];
      const dx = nodes[2 * i] - px;
      const dy = nodes[2 * i + 1] - py;
      const d = Math.hypot(dx, dy) || 1;
      nodes[2 * i] = px + (dx / d) * segLen;
      nodes[2 * i + 1] = py + (dy / d) * segLen;
    }
  }
}

class OrcaGridRenderer {
  ctx: CanvasRenderingContext2D;
  dpr = 1;
  cw = 9;
  ch = 11;
  cols = 0;
  rows = 0;
  palette: OrcaPalette = OCEAN_PALETTE;
  styles = new Map<number, string>();
  fontFamily = "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

  energy = new Float32Array(0);
  energyTmp = new Float32Array(0);
  cellGlyph = new Uint16Array(0);
  cellColor = new Uint32Array(0);
  cellAlpha = new Float32Array(0);
  cellTile = new Uint32Array(0);
  cellTileAlpha = new Float32Array(0);
  cellDim = new Float32Array(0);
  cellShadow = new Uint8Array(0);

  spine = new Float32Array(40);
  arc = new Float32Array(20);
  arcTotal = 1;
  flareLeft = 1;
  flareRight = 1;
  currentIsBull = false;
  currentSinPhi = 1;
  currentCosPhi = 0;
  hit = { flag: 0, across: 1, du: 1, da: 0 };
  hitDist = 0;
  hitS = 0;
  hitV = 0;
  hitTx = 0;
  hitTy = 0;
  hitSeg = 0;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    this.ctx = ctx;
  }

  setTheme(mode: ThemeMode) {
    this.palette =
      mode === "light"
        ? LIGHT_PALETTE
        : mode === "ocean"
        ? OCEAN_PALETTE
        : DARK_PALETTE;
  }

  resize(w: number, h: number, dpr: number) {
    this.dpr = dpr;
    this.cw = clamp(Math.round(w / 125), 8, 12);
    this.ch = this.cw + 2;
    this.cols = Math.ceil(w / this.cw);
    this.rows = Math.ceil(h / this.ch);
    this.ctx.canvas.width = Math.round(w * dpr);
    this.ctx.canvas.height = Math.round(h * dpr);

    const total = this.cols * this.rows;
    this.energy = new Float32Array(total);
    this.energyTmp = new Float32Array(total);
    this.cellGlyph = new Uint16Array(total);
    this.cellColor = new Uint32Array(total);
    this.cellAlpha = new Float32Array(total);
    this.cellTile = new Uint32Array(total);
    this.cellTileAlpha = new Float32Array(total);
    this.cellDim = new Float32Array(total).fill(1);
    this.cellShadow = new Uint8Array(total);
  }

  setDimBoxes(boxes: { left: number; top: number; right: number; bottom: number }[]) {
    const { cols, rows, cw, ch, cellDim } = this;
    cellDim.fill(1);
    const pad = 4 * cw;
    for (const box of boxes) {
      const c0 = Math.max(0, Math.floor((box.left - pad) / cw));
      const c1 = Math.min(cols - 1, Math.floor((box.right + pad) / cw));
      const r0 = Math.max(0, Math.floor((box.top - pad) / ch));
      const r1 = Math.min(rows - 1, Math.floor((box.bottom + pad) / ch));

      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const cx = c * cw + cw / 2;
          const cy = r * ch + ch / 2;
          const dist = Math.hypot(
            Math.max(box.left - cx, 0, cx - box.right),
            Math.max(box.top - cy, 0, cy - box.bottom)
          );
          const idx = r * cols + c;
          cellDim[idx] = Math.min(cellDim[idx], 0.12 + 0.88 * smoothstep(0, pad, dist));
        }
      }
    }
  }

  style(packed: number) {
    let s = this.styles.get(packed);
    if (!s) {
      s = `rgb(${packed >>> 16},${(packed >>> 8) & 255},${packed & 255})`;
      this.styles.set(packed, s);
    }
    return s;
  }

  glyphAt(idx: number, ch: string, rgb: number[], alpha: number) {
    const { ctx, cw, ch: cellH, cols } = this;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.style(packRgb(rgb));
    ctx.fillText(ch, (idx % cols) * cw + cw / 2, ((idx / cols) | 0) * cellH + cellH / 2);
  }

  cellIndex(x: number, y: number) {
    const c = Math.floor(x / this.cw);
    const r = Math.floor(y / this.ch);
    if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) return -1;
    return r * this.cols + c;
  }

  sample(
    x: number,
    y: number,
    len: number,
    segStart = 0,
    segEnd = 18
  ): boolean {
    const { spine, arc, currentSinPhi: sinPhi, currentCosPhi: cosPhi } = this;
    let bestDistSq = Infinity;
    let bestS = 0;
    let bestSide = 1;
    let tailOverhang = 0;

    for (let i = segStart; i <= segEnd; i++) {
      const x0 = spine[2 * i];
      const y0 = spine[2 * i + 1];
      const dx = spine[(i + 1) * 2] - x0;
      const dy = spine[(i + 1) * 2 + 1] - y0;
      const segSq = dx * dx + dy * dy || 1;
      const m = ((x - x0) * dx + (y - y0) * dy) / segSq;
      const proj = clamp(m, 0, 1);
      const dSq = (x - x0 - dx * proj) ** 2 + (y - y0 - dy * proj) ** 2;

      if (dSq < bestDistSq) {
        const segLen = Math.sqrt(segSq);
        bestDistSq = dSq;
        bestS = (arc[i] + proj * segLen) / this.arcTotal;
        bestSide = dx * (y - y0) - dy * (x - x0) >= 0 ? 1 : -1;
        tailOverhang = i === 18 ? Math.max(0, m - 1) * segLen : 0;
        this.hitTx = dx / segLen;
        this.hitTy = dy / segLen;
        this.hitSeg = i;
      }
    }

    const dist = Math.sqrt(bestDistSq);
    this.hitDist = dist;
    this.hitS = bestS;
    this.hitV = dist * bestSide;

    const uNorm = dist / len;
    const tailNorm = tailOverhang / len;
    const flare = bestSide > 0 ? this.flareLeft : this.flareRight;
    const hit = this.hit;
    hit.flag = 0;
    hit.across = 1;
    hit.du = 1;
    hit.da = 0;

    // 1. Protruding Triangular Dorsal Fin (projects sideways by -bestSide * sinPhi when not belly-up)
    const baseHalfW = bodyHalfWidth(bestS);
    const dorsalSideProj = Math.max(0, -bestSide * sinPhi);
    const notUpsideDown = smoothstep(-0.55, -0.05, cosPhi);
    const dorsalExtra =
      dorsalFinProtrusion(bestS, this.currentIsBull) *
      dorsalSideProj *
      notUpsideDown;
    const effectiveHalfW = baseHalfW + dorsalExtra;

    // 2. Pectoral flipper check first so black paddle fins sit cleanly over the body/belly
    if (samplePectoralFin(bestS, uNorm, bestSide, sinPhi, cosPhi, flare, hit)) {
      return true;
    }

    // 3. Main Body + Protruding Dorsal Fin
    if (bestS <= 0.8 && uNorm <= effectiveHalfW) {
      const acrossCore = uNorm / Math.max(0.01, baseHalfW);
      hit.across = acrossCore;

      // Compute 3D cylindrical point (yDorsal, xLateral) on the body surface
      const w = bestSide * Math.min(1, acrossCore);
      const z = Math.sqrt(Math.max(0, 1 - w * w));
      const yDorsal = z * cosPhi - w * sinPhi;
      const xLateral = w * cosPhi + z * sinPhi;

      if (
        bestS > 0.055 &&
        bestS < 0.088 &&
        yDorsal > 0.14 &&
        yDorsal < 0.68 &&
        Math.abs(xLateral) > 0.52
      ) {
        hit.flag = 3; // Eye cell ("o") — visible on upper-lateral head in Side & Top views
      } else if (acrossCore > 1.0) {
        hit.flag = 4; // Protruding triangular dorsal fin cell
      } else if (
        cosPhi > 0.32 &&
        bestS > 0.35 &&
        bestS < 0.54 &&
        Math.abs(xLateral) < 0.18 &&
        yDorsal > 0.82
      ) {
        hit.flag = 5; // Top-down dorsal fin spine ridge
      } else {
        hit.flag = 1; // Main body
      }
      return true;
    }

    // 4. Notched Butterfly Tail Flukes (s in [0.75, 1.0])
    if (bestS > 0.75 && tailNorm <= 0) {
      const tFluke = smoothstep(0.75, 0.96, bestS);
      const flukePerspective = 0.8 + 0.2 * Math.abs(cosPhi);
      const flukeW =
        (0.026 + 0.15 * Math.sin(tFluke * Math.PI * 0.72)) *
        (0.88 + 0.12 * flare) *
        flukePerspective;
      const notchMinU = bestS > 0.91 ? (bestS - 0.91) * 0.95 : 0;
      if (
        uNorm <= flukeW &&
        uNorm >= notchMinU &&
        bestS <= 0.92 + (uNorm / Math.max(0.01, flukeW)) * 0.08
      ) {
        hit.flag = 2; // Tail fluke
        hit.across = uNorm / Math.max(0.01, flukeW);
        hit.da = hit.across * 0.8;
        return true;
      }
    }

    return false;
  }

  // True 3D Cylindrical Orca Pigment Map (Top Dorsal, Side Profile, and Bottom Ventral Views)
  orcaColorZone(
    s: number,
    sideSign: number,
    acrossCore: number,
    flag: number
  ): "black" | "white" | "saddle" | "ridge" {
    const sinPhi = this.currentSinPhi;
    const cosPhi = this.currentCosPhi;

    // Protruding dorsal fin is Jet Black; Top-down dorsal ridge is highlighted dark slate
    if (flag === 4) return "black";
    if (flag === 5) return "ridge";

    // Pectoral fins & Tail flukes:
    // Real orca tail flukes have a stark white underside bordered in black when viewed from below!
    if (flag === 2) {
      if (
        s > 0.77 &&
        s < 0.91 &&
        cosPhi < -0.35 &&
        acrossCore > 0.18 &&
        acrossCore < 0.74
      ) {
        return "white";
      }
      return "black";
    }

    // Map screen transverse coordinate w in [-1, 1] onto the 3D cylinder (yDorsal, xLateral)
    const w = sideSign * Math.min(1, acrossCore);
    const z = Math.sqrt(Math.max(0, 1 - w * w));
    const yDorsal = z * cosPhi - w * sinPhi;
    const xLateral = w * cosPhi + z * sinPhi;
    const absX = Math.abs(xLateral);

    // 1. ELONGATED WHITE OVAL EYE PATCHES (on both upper-lateral head flanks, s in [0.08, 0.185])
    if (s >= 0.08 && s <= 0.185 && yDorsal > 0.08 && absX > 0.36) {
      const eyeS = (s - 0.132) / 0.052;
      const eyeY = (yDorsal - 0.44) / 0.32;
      if (eyeS * eyeS + eyeY * eyeY <= 1.0) {
        return "white";
      }
    }

    // 2. GREY SADDLE PATCH (on upper dorsal back behind the dorsal fin, s in [0.48, 0.61])
    if (s > 0.48 && s < 0.61 && yDorsal > 0.34) {
      const sadS = (s - 0.545) / 0.056;
      const sadY = (yDorsal - 0.68) / 0.34;
      if (sadS * sadS + sadY * sadY <= 1.0 && absX < 0.82) {
        return "saddle";
      }
    }

    // 3. STARK WHITE VENTRAL UNDERSIDE (Chin, Chest, Belly & Dual Rear Flank Trident Lobes)
    if (s >= 0.015 && s <= 0.68) {
      let yBellyMax = -0.14 - 0.32 * xLateral * xLateral;

      if (s < 0.2) {
        // Broad white lower jaw / chin / throat
        yBellyMax = -0.04 + (0.14 - s) * 0.65 - 0.14 * xLateral * xLateral;
      } else if (s > 0.47 && s < 0.65) {
        // Iconic upward rear flank lobes (creates side swoop in profile & trident in bottom view)
        const lobe = Math.sin(((s - 0.47) / 0.18) * Math.PI);
        yBellyMax =
          -0.14 +
          0.34 * lobe * (0.4 + 0.6 * absX) -
          0.2 * (1 - lobe) * xLateral * xLateral;
      } else if (s >= 0.65) {
        yBellyMax = -0.25 - (s - 0.65) * 18;
      }

      if (yDorsal <= yBellyMax) {
        return "white";
      }
    }

    return "black";
  }

  rasterizeOrca(orca: OrcaAgent) {
    const {
      spine,
      arc,
      cw,
      ch,
      cols,
      rows,
      cellGlyph,
      cellColor,
      cellAlpha,
      cellTile,
      cellTileAlpha,
      palette: pal,
    } = this;

    this.currentIsBull = orca.role === "bull";
    this.currentSinPhi = Math.sin(orca.rollAngle);
    this.currentCosPhi = Math.cos(orca.rollAngle);

    const len = orca.length;
    const nodes = orca.nodes;
    const swimAmp = 0.2 + 1.05 * orca.beat;

    for (let i = 0; i < 20; i++) {
      const r = i / 19;
      const prev = Math.max(0, i - 1);
      const next = Math.min(19, i + 1);
      let tx = nodes[2 * prev] - nodes[2 * next];
      let ty = nodes[2 * prev + 1] - nodes[2 * next + 1];
      const mag = Math.hypot(tx, ty) || 1;
      tx /= mag;
      ty /= mag;
      const wave =
        0.038 *
        len *
        (0.05 + 0.95 * Math.pow(r, 2.2)) *
        swimAmp *
        Math.sin(orca.phase - 4.6 * r);
      spine[2 * i] = nodes[2 * i] - ty * wave;
      spine[2 * i + 1] = nodes[2 * i + 1] + tx * wave;
    }

    arc[0] = 0;
    for (let i = 1; i < 20; i++) {
      arc[i] =
        arc[i - 1] +
        Math.hypot(
          spine[2 * i] - spine[(i - 1) * 2],
          spine[2 * i + 1] - spine[(i - 1) * 2 + 1]
        );
    }
    this.arcTotal = arc[19] || 1;

    const baseFlare = 1 - 0.22 * orca.beat;
    const finOsc = 0.16 * (1 - orca.beat) * Math.sin(orca.finPhase);
    const turnBias = clamp(0.6 * orca.turn, -0.35, 0.35);
    this.flareLeft = baseFlare + finOsc - turnBias;
    this.flareRight = baseFlare - finOsc + turnBias;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < 20; i++) {
      minX = Math.min(minX, spine[2 * i]);
      maxX = Math.max(maxX, spine[2 * i]);
      minY = Math.min(minY, spine[2 * i + 1]);
      maxY = Math.max(maxY, spine[2 * i + 1]);
    }

    const pad = 0.3 * len;
    const c0 = Math.max(0, Math.floor((minX - pad) / cw));
    const c1 = Math.min(cols - 1, Math.floor((maxX + pad) / cw));
    const r0 = Math.max(0, Math.floor((minY - pad) / ch));
    const r1 = Math.min(rows - 1, Math.floor((maxY + pad) / ch));
    if (c0 > c1 || r0 > r1) return;

    const cellDiag = Math.hypot(cw, ch);
    const shadowOffC = Math.round((0.06 * len * orca.depth) / cw) + 1;
    const shadowOffR = Math.round((0.045 * len * orca.depth) / ch) + 1;
    const baseAlpha =
      pal.alpha * (pal.depthFloor + (1 - pal.depthFloor) * orca.depth);
    const hit = this.hit;

    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const px = c * cw;
        const py = r * ch;
        const centerHit = this.sample(px + cw / 2, py + ch / 2, len);
        if (!centerHit && this.hitDist > 0.28 * len + cellDiag) {
          c += Math.max(
            0,
            Math.floor((this.hitDist - 0.28 * len - cellDiag) / cw)
          );
          continue;
        }

        const segLo = Math.max(0, this.hitSeg - 2);
        const segHi = Math.min(18, this.hitSeg + 2);
        let { flag, across } = hit;
        let s = this.hitS;
        let v = this.hitV;
        let subCount = centerHit ? 1 : 0;
        let gradX = 0;
        let gradY = 0;

        for (let k = 0; k < SUBSAMPLES.length; k += 2) {
          if (
            this.sample(
              px + SUBSAMPLES[k] * cw,
              py + SUBSAMPLES[k + 1] * ch,
              len,
              segLo,
              segHi
            )
          ) {
            gradX += (SUBSAMPLES[k] - 0.5) * cw;
            gradY += (SUBSAMPLES[k + 1] - 0.5) * ch;
            if (subCount === 0) {
              flag = hit.flag;
              across = hit.across;
              s = this.hitS;
              v = this.hitV;
            }
            subCount++;
          }
        }

        if (subCount === 0) continue;

        const cov = subCount / 5;
        const sideSign = v >= 0 ? 1 : -1;
        const cellIdx = r * cols + c;
        const cellRand =
          (4294967295 *
            hash(Math.round(90 * s), Math.round(v / (0.8 * cw)), orca.id)) >>>
          0;
        const isSolid = centerHit && cov >= 0.6;

        let glyphChar = " ";
        let glyphRgb = pal.blackGlyph;
        let glyphAlpha = baseAlpha;
        let tileRgb: number[] = pal.blackTile;
        let tileAlpha = baseAlpha;

        if (flag === 3 && isSolid) {
          // Eye cell ("o")
          tileRgb = pal.blackTile;
          tileAlpha = baseAlpha;
          glyphChar = "o";
          glyphRgb = pal.whiteTile;
        } else {
          const zone = this.orcaColorZone(s, sideSign, across, flag);

          if (zone === "white") {
            tileRgb = pal.whiteTile;
            glyphRgb = pal.whiteGlyph;
          } else if (zone === "saddle") {
            tileRgb = pal.saddleTile;
            glyphRgb = pal.blackTile;
          } else if (zone === "ridge") {
            tileRgb = pal.dorsalRidgeTile;
            glyphRgb = pal.rimGlyph;
          } else {
            tileRgb = pal.blackTile;
            glyphRgb = pal.blackGlyph;
          }

          if (subCount >= 4) {
            const sc = c + shadowOffC;
            const sr = r + shadowOffR;
            if (sc < cols && sr < rows) {
              this.cellShadow[sr * cols + sc] = 1;
            }
            tileAlpha = baseAlpha;

            if (s < 0.035 && across < 0.6 && orca.gulp > 0.5) {
              glyphChar = "o";
              glyphRgb = pal.tealAccent;
            } else {
              const gIdx =
                ((cellRand >>> 3) + (zone === "black" ? 2 : 0)) %
                GLYPH_RAMP.length;
              glyphChar = GLYPH_RAMP[gIdx];
              glyphAlpha =
                zone === "white" ? baseAlpha * 0.55 : baseAlpha * 0.85;
            }
          } else {
            // Crisp perimeter edge cell
            tileAlpha = baseAlpha * cov * 0.82;
            glyphChar = contourGlyph(-gradX, -gradY);
            glyphRgb = zone === "white" ? pal.whiteTile : pal.rimGlyph;
            glyphAlpha = baseAlpha * 0.9;
          }
        }

        cellTile[cellIdx] = packRgb(tileRgb);
        cellTileAlpha[cellIdx] = tileAlpha;
        cellGlyph[cellIdx] = glyphChar.charCodeAt(0);
        cellColor[cellIdx] = packRgb(glyphRgb);
        cellAlpha[cellIdx] = glyphAlpha;
      }
    }
  }

  depositWake(world: OrcaPodWorld) {
    const { energy } = this;
    for (const o of world.orcas) {
      for (let i = 16; i < 20; i++) {
        const idx = this.cellIndex(o.nodes[2 * i], o.nodes[2 * i + 1]);
        if (idx >= 0) {
          energy[idx] = Math.min(1.5, energy[idx] + 0.035 + 0.0012 * o.speed);
        }
      }
    }
    if (world.pointer.active) {
      const idx = this.cellIndex(world.pointer.x, world.pointer.y);
      if (idx >= 0) {
        energy[idx] = Math.min(1.5, energy[idx] + 0.12);
      }
    }
  }

  diffuse(dt: number) {
    const { cols, rows, energy, energyTmp } = this;
    const decay = Math.exp(-1.1 * dt);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const left = c > 0 ? energy[idx - 1] : energy[idx];
        const right = c < cols - 1 ? energy[idx + 1] : energy[idx];
        const up = r > 0 ? energy[idx - cols] : energy[idx];
        const down = r < rows - 1 ? energy[idx + cols] : energy[idx];
        energyTmp[idx] =
          (4 * energy[idx] + left + right + up + down) * 0.125 * decay;
      }
    }
    this.energy = energyTmp;
    this.energyTmp = energy;
  }

  drawWaterDots(time: number) {
    const { cols, rows, cellGlyph, cellShadow, cellDim, palette } = this;
    const total = cols * rows;
    const slowPhase = Math.floor(time * 0.8);
    for (let i = 0; i < total; i++) {
      if (cellGlyph[i] || cellShadow[i]) continue;
      const c = i % cols;
      const r = (i / cols) | 0;
      const h = hash(c, r, 101);
      if (h < 0.14) {
        const twinkle =
          0.65 +
          0.35 *
            Math.sin(
              time * 1.4 + h * 40 + (c ^ r) * 0.2 + slowPhase * 0.05
            );
        this.glyphAt(
          i,
          ".",
          palette.water,
          palette.waterDotAlpha * twinkle * cellDim[i]
        );
      }
    }
  }

  drawShadows() {
    const { cellShadow, cellGlyph, cellDim, palette } = this;
    for (let i = 0; i < cellShadow.length; i++) {
      if (cellShadow[i] && !cellGlyph[i]) {
        this.glyphAt(i, ":", palette.shadow, palette.shadowAlpha * cellDim[i]);
      }
    }
  }

  drawWake() {
    const { energy, cellGlyph, cellShadow, palette } = this;
    for (let i = 0; i < energy.length; i++) {
      const e = energy[i];
      if (e < 0.22 || cellGlyph[i] || cellShadow[i]) continue;
      this.glyphAt(
        i,
        e > 0.5 ? "-" : ".",
        palette.water,
        0.4 * Math.min(1, (e - 0.22) * 1.4)
      );
    }
  }

  drawRipples(world: OrcaPodWorld) {
    const { cw, ch, cols, rows, cellGlyph, palette } = this;
    for (const rip of world.ripples) {
      const age = world.time - rip.born;
      const fade =
        Math.pow(Math.max(0, 1 - age / rippleDuration(rip)), 1.5) * rip.strength;
      const color = rip.isTeal ? palette.tealAccent : palette.water;

      for (let ring = 0; ring < 2; ring++) {
        const rad =
          52 * Math.max(0, age - 0.45 * ring) * (0.7 + 0.5 * rip.strength);
        if (rad < 2) continue;
        const band = 0.6 * cw;
        const c0 = Math.max(0, Math.floor((rip.x - rad - cw) / cw));
        const c1 = Math.min(cols - 1, Math.floor((rip.x + rad + cw) / cw));
        const r0 = Math.max(0, Math.floor((rip.y - rad - ch) / ch));
        const r1 = Math.min(rows - 1, Math.floor((rip.y + rad + ch) / ch));
        const ringAlpha = fade * (ring === 0 ? 0.65 : 0.35);

        for (let r = r0; r <= r1; r++) {
          for (let c = c0; c <= c1; c++) {
            const idx = r * cols + c;
            if (cellGlyph[idx]) continue;
            const dx = c * cw + cw / 2 - rip.x;
            const dy = r * ch + ch / 2 - rip.y;
            if (Math.abs(Math.hypot(dx, dy) - rad) > band) continue;
            const chGlyph = ring === 1 ? "." : contourGlyph(-dy, dx);
            this.glyphAt(idx, chGlyph, color, ringAlpha);
          }
        }
      }
    }
  }

  drawPellets(world: OrcaPodWorld) {
    const { cellGlyph, palette, ch } = this;
    for (const p of world.pellets) {
      const age = world.time - p.born;
      if (!p.landed) {
        const prog = age / p.landAt;
        const idx = this.cellIndex(p.x, p.y - (1 - prog) * ch * 1.5);
        if (idx < 0 || cellGlyph[idx]) continue;
        this.glyphAt(
          idx,
          prog < 0.5 ? "'" : ".",
          palette.tealAccent,
          palette.alpha * (0.5 + 0.4 * prog)
        );
        continue;
      }
      const idx = this.cellIndex(p.x, p.y);
      if (idx < 0 || cellGlyph[idx]) continue;
      const sink = smoothstep(9, 14, age);
      const pulse = 0.8 + 0.2 * Math.sin(3 * age + p.x);
      this.glyphAt(
        idx,
        sink > 0.55 ? "." : "o",
        palette.tealAccent,
        palette.alpha * pulse * (1 - 0.85 * sink)
      );
    }
  }

  drawBites(world: OrcaPodWorld) {
    const { palette } = this;
    for (const b of world.bites) {
      const idx = this.cellIndex(b.x, b.y);
      if (idx < 0) continue;
      const t = (world.time - b.born) / 0.45;
      const ch = t < 0.35 ? "*" : t < 0.7 ? "+" : ".";
      this.glyphAt(
        idx,
        ch,
        palette.tealAccent,
        Math.min(1, 1.6 * palette.alpha) * (1 - t * t)
      );
    }
  }

  drawCells() {
    const {
      ctx,
      cw,
      ch,
      cols,
      cellGlyph,
      cellColor,
      cellAlpha,
      cellTile,
      cellTileAlpha,
      cellDim,
    } = this;

    for (let i = 0; i < cellGlyph.length; i++) {
      const g = cellGlyph[i];
      if (!g) continue;
      const px = (i % cols) * cw;
      const py = ((i / cols) | 0) * ch;

      if (cellTileAlpha[i] > 0) {
        ctx.globalAlpha = cellTileAlpha[i] * cellDim[i];
        ctx.fillStyle = this.style(cellTile[i]);
        ctx.fillRect(px + 1, py + 1, cw - 1, ch - 1);
      }
      if (g !== 32) {
        ctx.globalAlpha = cellAlpha[i] * cellDim[i];
        ctx.fillStyle = this.style(cellColor[i]);
        ctx.fillText(String.fromCharCode(g), px + cw / 2, py + ch / 2 + 1);
      }
    }
  }

  render(world: OrcaPodWorld, dt: number) {
    const { ctx, dpr, cols, palette } = this;
    if (cols === 0) return;

    this.cellGlyph.fill(0);
    this.cellTileAlpha.fill(0);
    this.cellShadow.fill(0);

    const sorted = [...world.orcas].sort((a, b) => a.depth - b.depth);
    for (const o of sorted) {
      this.rasterizeOrca(o);
    }

    this.depositWake(world);
    this.diffuse(dt);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.style(packRgb(palette.bg));
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `600 ${Math.round(0.72 * this.ch)}px ${this.fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    this.drawWaterDots(world.time);
    this.drawShadows();
    this.drawWake();
    this.drawRipples(world);
    this.drawPellets(world);
    this.drawCells();
    this.drawBites(world);
    ctx.globalAlpha = 1;
  }
}

export default function AsciiOrcaGrid({
  theme = "ocean",
  isLight = false,
  className = "",
  onStats,
}: AsciiOrcaGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<OrcaGridRenderer | null>(null);
  const onStatsRef = useRef(onStats);
  onStatsRef.current = onStats;

  const resolvedTheme: ThemeMode = isLight ? "light" : theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const world = new OrcaPodWorld();
    const renderer = new OrcaGridRenderer(canvas);
    renderer.setTheme(resolvedTheme);
    rendererRef.current = renderer;

    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let frames = 0;
    let lastPointerTime = 0;
    let visible = true;
    let disposed = false;
    let reported = { pod: -1, ripples: -1 };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const report = () => {
      const podCount = world.orcas.length;
      const activeCount = world.pellets.length;
      if (podCount !== reported.pod || activeCount !== reported.ripples) {
        reported = { pod: podCount, ripples: activeCount };
        onStatsRef.current?.(reported);
      }
    };

    const measureContent = () => {
      const rect = canvas.getBoundingClientRect();
      const raw = Array.from(
        document.querySelectorAll("[data-koi-avoid], [data-orca-avoid]"),
        (el) => {
          const r = el.getBoundingClientRect();
          return {
            left: r.left - rect.left,
            top: r.top - rect.top,
            right: r.right - rect.left,
            bottom: r.bottom - rect.top,
          };
        }
      );
      renderer.setDimBoxes(raw);
      world.avoid = raw;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      world.resize(rect.width, rect.height);
      renderer.resize(rect.width, rect.height, dpr);
      measureContent();
      if (reducedMotion.matches) {
        drawStill();
      }
    };

    const drawStill = () => {
      if (world.time < 4) {
        for (let i = 0; i < 240; i++) world.step(STEP_DT);
      }
      measureContent();
      renderer.render(world, STEP_DT);
      report();
    };

    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      acc += dt;
      let steps = 0;
      while (acc >= STEP_DT && steps < 4) {
        world.step(STEP_DT);
        acc -= STEP_DT;
        steps++;
      }
      if (steps === 4) acc = 0;
      if (++frames % 30 === 0) measureContent();
      renderer.render(world, dt);
      report();
      raf = requestAnimationFrame(frame);
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      if (disposed || !visible || document.hidden) return;
      if (reducedMotion.matches) {
        drawStill();
        return;
      }
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const toLocal = (e: PointerEvent | MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      return {
        x,
        y,
        inside: x >= 0 && y >= 0 && x <= r.width && y <= r.height,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      const { x, y, inside } = toLocal(e);
      const p = world.pointer;
      const dt = Math.max(1, e.timeStamp - lastPointerTime) / 1000;
      const spd = Math.hypot(x - p.x, y - p.y) / dt;
      p.speed += (Math.min(spd, 5000) - p.speed) * 0.5;
      lastPointerTime = e.timeStamp;
      p.x = x;
      p.y = y;
      p.active = inside && e.pointerType !== "touch";
    };

    const onClick = (e: MouseEvent) => {
      if (reducedMotion.matches) return;
      const path = e.composedPath();
      if (
        path.some(
          (el) =>
            el instanceof Element &&
            el.matches(
              "a, button, input, textarea, select, label, [role='button'], [data-koi-ignore]"
            )
        )
      ) {
        return;
      }
      if (window.getSelection()?.toString()) return;
      const { x, y, inside } = toLocal(e);
      if (inside) {
        world.feed(x, y);
        report();
      }
    };

    const onPointerLeave = () => {
      world.pointer.active = false;
      world.pointer.speed = 0;
    };

    const onVisibilityChange = () => {
      schedule();
    };

    const resizeObserver = new ResizeObserver(() => resize());
    const intersectionObserver = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      schedule();
    });

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    reducedMotion.addEventListener("change", schedule);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("click", onClick);
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    resize();
    schedule();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotion.removeEventListener("change", schedule);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("click", onClick);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    rendererRef.current?.setTheme(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
    />
  );
}
