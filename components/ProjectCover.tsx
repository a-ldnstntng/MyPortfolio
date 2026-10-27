"use client";

import React from "react";
import type { ProjectItem } from "@/lib/projects";

export default function ProjectCover({
  project,
  className = "",
}: {
  project: ProjectItem;
  className?: string;
}) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden select-none ${className}`}
    >
      {project.mockupVariant === "ligtas" && <LigtasPresentation />}
      {project.mockupVariant === "resetaph" && <ResetaPresentation />}
      {project.mockupVariant === "parapo" && <ParaPoMockup />}
      {project.mockupVariant === "bayaniremit" && <BayaniRemitMockup />}
      {project.mockupVariant === "netforge" && <NetForgeMockup />}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   1. LIGTAS METRO — Dao Ho Presentation:
      Atmospheric Dark Gold/Radar Glow + Layered Dual-Device Ground Truth & 3D Radar
   ─────────────────────────────────────────────────────────────────────────── */
function LigtasPresentation() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(110% 110% at 18% 85%, #2d300b 0%, #13171c 48%, #080a0d 100%)",
      }}
    >
      {/* Ambient Radial Spotlight */}
      <div
        className="pointer-events-none absolute -left-12 bottom-0 h-72 w-72 rounded-full opacity-25 blur-3xl"
        style={{ background: "#EBF728" }}
      />

      {/* Left Brand Mark (Dao Ho style - responsive) */}
      <div className="absolute left-[5%] sm:left-[7%] top-[45%] -translate-y-1/2 z-20 flex items-center gap-2 sm:gap-3.5 max-w-[38%] sm:max-w-none">
        <div className="flex h-7 w-7 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-[#EBF728]/15 border border-[#EBF728]/45 text-[#EBF728] font-geistMono text-xs sm:text-base font-bold shadow-[0_0_24px_rgba(235,247,40,0.18)]">
          ▲
        </div>
        <div className="min-w-0">
          <div className="font-geistSans text-[13px] sm:text-[22px] md:text-[24px] font-semibold tracking-tight text-[#fff7f0] truncate sm:overflow-visible">
            LIGTAS METRO
          </div>
          <div className="hidden sm:block font-geistMono text-[10.5px] uppercase tracking-widest text-[#EBF728]/85">
            NOAH • PAGASA • MMDA RADAR
          </div>
        </div>
      </div>

      {/* Right Dual Device Mockups (matches Dao Ho layered composition) */}
      <div className="absolute left-[44%] sm:left-[44%] top-[8%] sm:top-[10%] right-[2%] sm:right-[3%] bottom-[-10%] z-10 flex items-end justify-end gap-1.5 sm:gap-3">
        {/* Secondary Phone (Behind, Left) — Roadway Ground Truth */}
        <div className="relative w-[45%] max-w-[215px] h-[86%] rounded-t-[18px] sm:rounded-t-[28px] border-[2px] sm:border-[3px] border-neutral-800 bg-[#0c0e12] shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col z-10 opacity-90 transition-transform duration-500 group-hover:-translate-y-1">
          <div className="absolute top-1 sm:top-1.5 left-1/2 -translate-x-1/2 h-2 sm:h-3 w-10 sm:w-14 rounded-full bg-neutral-900 z-40 border border-neutral-800/80" />
          <div className="relative flex-1 bg-[#0b0d11] overflow-hidden pt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/projects/ligtas-metro/01-ground-truth-mobile.png"
              alt="LIGTAS Ground Truth"
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>

        {/* Foreground Phone (Front, Right) — 3D Vector Flood Radar */}
        <div className="relative w-[53%] max-w-[245px] h-[95%] rounded-t-[22px] sm:rounded-t-[32px] border-[2.5px] sm:border-[3.5px] border-neutral-700 bg-black shadow-[0_30px_70px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col z-30 transition-transform duration-500 group-hover:scale-[1.02]">
          <div className="absolute top-1 sm:top-2 left-1/2 -translate-x-1/2 h-2.5 sm:h-3.5 w-12 sm:w-16 rounded-full bg-neutral-900 z-40 border border-neutral-800" />
          <div className="relative flex-1 bg-black overflow-hidden pt-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/projects/ligtas-metro/02-flood-radar-3d-mobile.png"
              alt="LIGTAS 3D Flood Radar"
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   2. ResetaPH — Dao Ho Presentation:
      Atmospheric Medical Emerald Glow + Layered Dual-Device Price & Care Schedule
   ─────────────────────────────────────────────────────────────────────────── */
function ResetaPresentation() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(110% 110% at 18% 75%, #064e3b 0%, #072a25 50%, #041211 100%)",
      }}
    >
      {/* Ambient Spotlight */}
      <div
        className="pointer-events-none absolute -left-12 bottom-0 h-72 w-72 rounded-full opacity-25 blur-3xl"
        style={{ background: "#34d399" }}
      />

      {/* Left Brand Mark (Dao Ho style - responsive) */}
      <div className="absolute left-[5%] sm:left-[7%] top-[45%] -translate-y-1/2 z-20 flex items-center gap-2 sm:gap-3.5 max-w-[38%] sm:max-w-none">
        <div className="flex h-7 w-7 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-emerald-400/15 border border-emerald-400/35 text-emerald-300 font-geistMono text-xs sm:text-lg font-bold shadow-[0_0_24px_rgba(52,211,153,0.18)]">
          Rx
        </div>
        <div className="min-w-0">
          <div className="font-geistSans text-[13px] sm:text-[22px] md:text-[24px] font-semibold tracking-tight text-[#fff7f0] truncate sm:overflow-visible">
            ResetaPH
          </div>
          <div className="hidden sm:block font-geistMono text-[11px] text-emerald-300/85">
            Generic Finder • Taglish Care
          </div>
        </div>
      </div>

      {/* Right Dual Device Mockups (matches SelfServe layered composition) */}
      <div className="absolute left-[44%] sm:left-[44%] top-[8%] sm:top-[10%] right-[2%] sm:right-[3%] bottom-[-10%] z-10 flex items-end justify-end gap-1.5 sm:gap-3">
        {/* Foreground Primary Phone — Price Comparator (83% Savings) */}
        <div className="relative w-[53%] max-w-[245px] h-[95%] rounded-t-[22px] sm:rounded-t-[32px] border-[2.5px] sm:border-[3.5px] border-neutral-700 bg-black shadow-[0_30px_70px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col z-30 transition-transform duration-500 group-hover:scale-[1.02]">
          <div className="absolute top-1 sm:top-2 left-1/2 -translate-x-1/2 h-2.5 sm:h-3.5 w-12 sm:w-16 rounded-full bg-neutral-900 z-40 border border-neutral-800" />
          <div className="relative flex-1 bg-[#faf9f5] overflow-hidden pt-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/projects/resetaph/03-results-prices-mobile.png"
              alt="ResetaPH Price Comparator"
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>

        {/* Secondary Phone (Behind, Right) — How to Take / Spoken Schedule */}
        <div className="relative w-[45%] max-w-[215px] h-[86%] rounded-t-[18px] sm:rounded-t-[28px] border-[2px] sm:border-[3px] border-neutral-800 bg-[#081816] shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col z-10 opacity-90 transition-transform duration-500 group-hover:-translate-y-1">
          <div className="absolute top-1 sm:top-1.5 left-1/2 -translate-x-1/2 h-2 sm:h-3 w-10 sm:w-14 rounded-full bg-neutral-900 z-40 border border-neutral-800/80" />
          <div className="relative flex-1 bg-white overflow-hidden pt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/projects/resetaph/04-results-schedule-mobile.png"
              alt="ResetaPH Care Schedule"
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   3. PARA PO! — Jeepney Warm Amber / Slate Taglish Transit Mockup
   ─────────────────────────────────────────────────────────────────────────── */
function ParaPoMockup() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(110% 100% at 18% 85%, #6b3410 0%, #241914 52%, #0e0c0a 100%)",
      }}
    >
      <div className="absolute left-[5%] sm:left-[7%] top-[10%] sm:top-[16%] z-10 max-w-[36%] sm:max-w-none">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded border border-amber-400/40 bg-amber-400/10 px-2 sm:px-2.5 py-0.5 sm:py-1 font-geistMono text-[9px] sm:text-[11px] font-bold text-amber-300">
          <span>🚌</span>
          <span>PARA PO!</span>
        </div>
        <div className="mt-1 sm:mt-2 font-geistSans text-[12px] sm:text-[18px] font-medium text-[#fff7f0] leading-tight">
          Taglish Transit Guide
        </div>
      </div>

      <div className="absolute left-[42%] sm:left-[32%] top-[14%] sm:top-[24%] right-[-4%] bottom-[-6%] rounded-tl-xl border border-white/15 bg-[#141210] p-3 sm:p-5 shadow-2xl font-geistMono flex flex-col justify-between">
        <div>
          <div className="text-[8px] sm:text-[10px] uppercase tracking-wider text-amber-400/80">
            TAGLISH QUERY INPUT
          </div>
          <div className="mt-1 rounded-lg border border-white/10 bg-black/50 p-2 sm:p-3 text-[9px] sm:text-[11px] text-white/90">
            &ldquo;Paano pumunta galing Cubao papuntang BGC High Street?&rdquo;
          </div>

          <div className="mt-2.5 sm:mt-4 space-y-1.5 sm:space-y-2">
            {[
              {
                leg: "01",
                mode: "MRT-3",
                route: "Araneta-Cubao → Ayala",
                fare: "₱20.00",
              },
              {
                leg: "02",
                mode: "BGC BUS",
                route: "EDSA Ayala → BGC Stopover",
                fare: "₱15.00",
              },
              {
                leg: "03",
                mode: "WALK",
                route: "250m lakad pa-BGC High St",
                fare: "₱0.00",
              },
            ].map((item) => (
              <div
                key={item.leg}
                className="flex items-center justify-between rounded border border-white/10 bg-white/[0.03] px-2 sm:px-3 py-1 sm:py-2 text-[9px] sm:text-[10.5px]"
              >
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  <span className="rounded bg-amber-400/20 px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[9.5px] font-semibold text-amber-300">
                    {item.mode}
                  </span>
                  <span className="text-white/85 truncate max-w-[110px] sm:max-w-none">{item.route}</span>
                </div>
                <span className="text-emerald-400 shrink-0">{item.fare}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-2 sm:pt-3 text-[8px] sm:text-[10px] text-white/45">
          <span>SQLite Archive</span>
          <span>Fare: ₱35.00</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   4. BayaniRemit — Monochromatic Indigo / Slate Fintech & 3NF Envelope Mockup
   ─────────────────────────────────────────────────────────────────────────── */
function BayaniRemitMockup() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(110% 100% at 15% 85%, #2e1d59 0%, #161324 52%, #0a0910 100%)",
      }}
    >
      <div className="absolute left-[5%] sm:left-[7%] top-[10%] sm:top-[16%] z-10 max-w-[36%] sm:max-w-none">
        <div className="font-geistSans text-[13px] sm:text-[20px] font-semibold tracking-tight text-[#fff7f0]">
          BayaniRemit
        </div>
        <div className="hidden sm:block font-geistMono text-[10.5px] text-violet-300/75">
          3NF Schema • OFW Envelope Ledger
        </div>
      </div>

      <div className="absolute left-[42%] sm:left-[30%] top-[14%] sm:top-[22%] right-[-4%] bottom-[-6%] rounded-tl-xl border border-white/15 bg-[#0e0d14] p-3 sm:p-5 shadow-2xl font-geistMono flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 sm:pb-3">
            <div>
              <div className="text-[8px] sm:text-[10px] text-white/45">BATCH #RM-2026-09</div>
              <div className="text-[11px] sm:text-[15px] font-semibold text-white">
                $1,200 → ₱67,440
              </div>
            </div>
            <span className="rounded bg-violet-500/20 border border-violet-400/30 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] text-violet-300">
              56.20 PHP/USD
            </span>
          </div>

          <div className="mt-2 sm:mt-3.5 space-y-1.5 sm:space-y-2">
            {[
              { env: "Household & Groceries", alloc: "₱25,000", pct: "78%" },
              { env: "Tuition & Books", alloc: "₱18,000", pct: "100%" },
              { env: "Medical Emergency", alloc: "₱14,440", pct: "42%" },
            ].map((e) => (
              <div
                key={e.env}
                className="rounded border border-white/10 bg-white/[0.02] px-2 sm:px-3 py-1 sm:py-2 text-[9px] sm:text-[10.5px] flex items-center justify-between"
              >
                <span className="text-white/85 truncate max-w-[110px] sm:max-w-none">{e.env}</span>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span className="text-violet-300">{e.alloc}</span>
                  <span className="text-white/40 w-6 sm:w-8 text-right">{e.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-1.5 sm:pt-2.5 text-[8px] sm:text-[10px] text-white/40">
          <span>3NF Schema</span>
          <span>RLS Verified</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   5. NetForge — Cold Cyan / Abyss Skia Network Topology & OSPF Simulator Mockup
   ─────────────────────────────────────────────────────────────────────────── */
function NetForgeMockup() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(110% 100% at 15% 85%, #103c4a 0%, #0d1c24 52%, #070c10 100%)",
      }}
    >
      <div className="absolute left-[5%] sm:left-[7%] top-[10%] sm:top-[16%] z-10 max-w-[36%] sm:max-w-none">
        <div className="font-geistSans text-[13px] sm:text-[20px] font-semibold tracking-tight text-[#fff7f0]">
          NetForge
        </div>
        <div className="hidden sm:block font-geistMono text-[10.5px] text-[#48bcce]">
          Skia Canvas • OSPF &amp; Graph Visualizer
        </div>
      </div>

      <div className="absolute left-[42%] sm:left-[30%] top-[14%] sm:top-[22%] right-[-4%] bottom-[-6%] rounded-tl-xl border border-white/15 bg-[#090e13] p-3 sm:p-5 shadow-2xl font-geistMono flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 sm:pb-2.5 text-[8px] sm:text-[10px]">
          <span className="text-[#48bcce]">OSPF AREA 0</span>
          <span className="rounded bg-emerald-500/20 px-1.5 sm:px-2 py-0.5 text-emerald-300">
            DEPLOY READY
          </span>
        </div>

        {/* Simulated Topology Graph */}
        <div className="relative my-2 sm:my-3 flex items-center justify-between px-2 sm:px-4 py-3 sm:py-5 rounded-lg border border-white/10 bg-black/40">
          <div className="rounded border border-[#48bcce] bg-[#48bcce]/15 px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-center text-[8px] sm:text-[10px]">
            <div className="font-bold text-[#48bcce]">R1-CORE</div>
            <div className="text-[7px] sm:text-[9px] text-white/50">10.0.0.1</div>
          </div>

          <div className="flex-1 border-t border-dashed border-[#48bcce] mx-1 sm:mx-2 text-center text-[7px] sm:text-[9px] text-[#48bcce]">
            cost: 10
          </div>

          <div className="rounded border border-white/25 bg-white/5 px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-center text-[8px] sm:text-[10px]">
            <div className="font-bold text-white">SW-DIST</div>
            <div className="text-[7px] sm:text-[9px] text-white/50">VLAN 10</div>
          </div>

          <div className="flex-1 border-t border-dashed border-[#48bcce] mx-1 sm:mx-2 text-center text-[7px] sm:text-[9px] text-[#48bcce]">
            trunk
          </div>

          <div className="rounded border border-emerald-400/60 bg-emerald-400/10 px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-center text-[8px] sm:text-[10px]">
            <div className="font-bold text-emerald-300">FW-EDGE</div>
            <div className="text-[7px] sm:text-[9px] text-white/50">PERMIT</div>
          </div>
        </div>

        <div className="rounded bg-black/70 border border-white/10 p-1.5 sm:p-2.5 text-[8px] sm:text-[10px] text-white/70">
          <span className="text-[#48bcce]">R1-CORE#</span> router ospf 1
        </div>
      </div>
    </div>
  );
}
