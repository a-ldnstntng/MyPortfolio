"use client";

import React, { useState } from "react";
import type { ProjectItem } from "@/lib/projects";

export default function ProjectCover({
  project,
  className = "",
}: {
  project: ProjectItem;
  className?: string;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`relative h-full w-full overflow-hidden select-none ${className}`}
    >
      {/* 1. Custom cover.png override (automatically renders if placed in /public/projects/[slug]/cover.png) */}
      {!imgError && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.cover}
          alt={project.name}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className={`absolute inset-0 z-20 h-full w-full object-cover transition-opacity duration-300 ${
            imgLoaded ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />
      )}

      {/* 2. Bespoke Branded Backdrop + Device UI Mockup (matches daoho.dev/projects card style) */}
      {project.mockupVariant === "ligtas" && <LigtasMockup />}
      {project.mockupVariant === "resetaph" && <ResetaMockup />}
      {project.mockupVariant === "parapo" && <ParaPoMockup />}
      {project.mockupVariant === "bayaniremit" && <BayaniRemitMockup />}
      {project.mockupVariant === "netforge" && <NetForgeMockup />}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   1. LIGTAS METRO — OLED Dark + Safety Yellow (#EBF728) & Teal Radar Mockup
   ─────────────────────────────────────────────────────────────────────────── */
function LigtasMockup() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(110% 100% at 15% 85%, #3a3d10 0%, #14191e 48%, #090b0e 100%)",
      }}
    >
      {/* Left Brand Mark */}
      <div className="absolute left-[7%] top-[14%] z-10 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EBF728]/15 border border-[#EBF728]/40 text-[#EBF728] font-geistMono text-sm font-bold">
          ▲
        </div>
        <div>
          <div className="font-geistSans text-[19px] font-semibold tracking-tight text-[#fff7f0]">
            LIGTAS METRO
          </div>
          <div className="font-geistMono text-[10px] uppercase tracking-widest text-[#EBF728]/80">
            NOAH • PAGASA • MMDA RADAR
          </div>
        </div>
      </div>

      {/* Right-Bottom Bleeding App Window Mockup */}
      <div className="absolute left-[30%] top-[22%] right-[-4%] bottom-[-6%] rounded-tl-xl border border-white/15 bg-[#0b0d11] shadow-[0_24px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col">
        {/* Window Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#11141a] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-geistMono text-[11px] text-white/60">
              ligtas.metro / radar / espana-blvd
            </span>
          </div>
          <span className="rounded bg-[#EBF728]/20 px-2 py-0.5 font-geistMono text-[10px] font-medium text-[#EBF728]">
            HABAGAT LIVE • 3D
          </span>
        </div>

        {/* App Body */}
        <div className="grid flex-1 grid-cols-12 overflow-hidden">
          {/* Left Telemetry Sidebar */}
          <div className="col-span-5 border-r border-white/10 bg-[#0d1016] p-3.5 flex flex-col justify-between font-geistMono">
            <div className="space-y-2.5">
              <div className="text-[10px] uppercase tracking-wider text-white/40">
                CORRIDOR PASSABILITY
              </div>
              {[
                {
                  corridor: "España — Maceda",
                  depth: "0.42m",
                  status: "4x4 ONLY",
                  color: "text-[#f59e0b]",
                },
                {
                  corridor: "Sta. Mesa — V. Mapa",
                  depth: "0.12m",
                  status: "PASSABLE",
                  color: "text-[#22c55e]",
                },
                {
                  corridor: "Araneta — E. Rodriguez",
                  depth: "0.58m",
                  status: "IMPASSABLE",
                  color: "text-[#ef4444]",
                },
                {
                  corridor: "Katipunan — Ateneo",
                  depth: "0.08m",
                  status: "PASSABLE",
                  color: "text-[#22c55e]",
                },
              ].map((row) => (
                <div
                  key={row.corridor}
                  className="rounded border border-white/5 bg-white/[0.02] px-2.5 py-1.5 flex items-center justify-between text-[10px]"
                >
                  <div>
                    <div className="text-white/85 font-medium">{row.corridor}</div>
                    <div className="text-white/40">Gauge: {row.depth}</div>
                  </div>
                  <span className={`font-semibold ${row.color}`}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded border border-[#EBF728]/25 bg-[#EBF728]/5 p-2 text-[10px] text-[#EBF728]">
              Marikina Sto. Niño: 16.4m (Alert Lvl 2)
            </div>
          </div>

          {/* Right 3D Vector Flood Map View */}
          <div
            className="col-span-7 relative p-4 flex flex-col justify-between"
            style={{
              background:
                "radial-gradient(circle at 55% 45%, rgba(72,188,206,0.18), rgba(11,13,17,0.95) 75%)",
            }}
          >
            {/* Vector Grid Lines */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative z-10 flex items-center justify-between">
              <span className="rounded bg-black/70 border border-white/10 px-2 py-1 font-geistMono text-[10px] text-white/70">
                MapLibre GL • Pitch 52°
              </span>
              <span className="rounded bg-[#48bcce]/20 border border-[#48bcce]/40 px-2 py-1 font-geistMono text-[10px] text-[#48bcce]">
                Mapillary 360°
              </span>
            </div>

            {/* Simulated Flood Hazard Polygon & Bypass Route */}
            <div className="relative z-10 my-auto mx-auto w-4/5 rounded-lg border border-[#ef4444]/40 bg-[#ef4444]/10 p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between font-geistMono text-[10px]">
                <span className="text-[#ef4444] font-semibold">
                  ▲ INUNDATION ZONE
                </span>
                <span className="text-white/60">Sedan &lt; 0.20m</span>
              </div>
              <div className="mt-1.5 font-geistMono text-[11px] text-white/90">
                Bypass via Skyway Stage 3 → Nagtahan Exit (+6 min)
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2 font-geistMono text-[10px] text-white/50">
              <span>NOAH Rain: 32mm/hr</span>
              <span>•</span>
              <span>RAG Safety Advisor Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   2. ResetaPH — Deep Medical Teal/Emerald Backdrop + Mobile & Rx Reader Mockup
   ─────────────────────────────────────────────────────────────────────────── */
function ResetaMockup() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(100% 100% at 15% 80%, #0d4a3e 0%, #0b2926 52%, #071414 100%)",
      }}
    >
      {/* Left Brand Mark */}
      <div className="absolute left-[7%] top-[44%] -translate-y-1/2 z-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-[#fff7f0] font-geistMono text-base font-bold">
          Rx
        </div>
        <div>
          <div className="font-geistSans text-[22px] font-semibold tracking-tight text-[#fff7f0]">
            ResetaPH
          </div>
          <div className="font-geistMono text-[11px] text-emerald-300/80">
            Generic Finder • Taglish Care
          </div>
        </div>
      </div>

      {/* Right Phone + Tablet Split Mockup (like SelfServe in reference) */}
      <div className="absolute left-[46%] top-[14%] right-[4%] bottom-[-8%] flex items-end gap-3">
        {/* Phone Frame */}
        <div className="w-[54%] h-[94%] rounded-t-[24px] border-[3px] border-neutral-800 bg-[#faf9f5] text-[#1a1917] p-3.5 shadow-2xl flex flex-col justify-between font-geistSans">
          <div>
            <div className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-neutral-300" />
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <span className="font-geistMono text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                Decoded Reseta
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-geistMono text-[9px] font-medium text-emerald-900">
                Save 62%
              </span>
            </div>

            <div className="mt-2.5 space-y-2">
              <div className="rounded-lg border border-neutral-200 bg-white p-2.5 shadow-sm">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] font-semibold">
                    Co-Amoxiclav 625mg
                  </span>
                  <span className="font-geistMono text-[10px] text-emerald-700 font-semibold">
                    ₱24.50 / tab
                  </span>
                </div>
                <div className="mt-0.5 font-geistMono text-[9.5px] text-neutral-500">
                  Sig: 1 tab BID PC × 7 days (#14)
                </div>
                <div className="mt-1 rounded bg-emerald-50 px-1.5 py-1 text-[9.5px] text-emerald-900">
                  “Inumin 2 beses sa isang araw pagkatapos kumain (Umaga at Gabi).”
                </div>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-white p-2.5 shadow-sm">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] font-semibold">
                    Amlodipine 5mg
                  </span>
                  <span className="font-geistMono text-[10px] text-emerald-700 font-semibold">
                    ₱4.25 / tab
                  </span>
                </div>
                <div className="mt-0.5 font-geistMono text-[9.5px] text-neutral-500">
                  Mercury • South Star • Rose
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-emerald-900 py-1.5 text-center font-geistMono text-[10px] font-medium text-white">
            Show Counter Card →
          </div>
        </div>

        {/* Secondary Card Behind */}
        <div className="w-[46%] h-[82%] rounded-tl-xl border border-white/15 bg-[#0e2220] p-3 text-white/90 font-geistMono text-[10px] space-y-2 shadow-xl">
          <div className="text-emerald-300 font-semibold">TIMELINE SCHEDULE</div>
          <div className="rounded border border-white/10 bg-white/5 p-2">
            <div className="text-white/50">08:00 AM • UMAGA</div>
            <div className="mt-0.5">Co-Amoxiclav + Amlodipine</div>
          </div>
          <div className="rounded border border-white/10 bg-white/5 p-2">
            <div className="text-white/50">08:00 PM • GABI</div>
            <div className="mt-0.5">Co-Amoxiclav 625mg</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   3. PARA PO! — Warm Amber/Slate Jeepney Transit Ticket & Taglish NLP Mockup
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
      <div className="absolute left-[7%] top-[16%] z-10">
        <div className="inline-flex items-center gap-2 rounded border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 font-geistMono text-[11px] font-bold text-amber-300">
          <span>🚌</span>
          <span>PARA PO!</span>
        </div>
        <div className="mt-2 font-geistSans text-[18px] font-medium text-[#fff7f0]">
          Taglish NCR Transit Guide
        </div>
      </div>

      <div className="absolute left-[32%] top-[24%] right-[-4%] bottom-[-6%] rounded-tl-xl border border-white/15 bg-[#141210] p-5 shadow-2xl font-geistMono flex flex-col justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-amber-400/80">
            TAGLISH QUERY INPUT
          </div>
          <div className="mt-1.5 rounded-lg border border-white/10 bg-black/50 p-3 text-[11px] text-white/90">
            &ldquo;Paano pumunta galing Cubao papuntang BGC High Street?&rdquo;
          </div>

          <div className="mt-4 space-y-2">
            {[
              {
                leg: "01",
                mode: "MRT-3",
                route: "Araneta-Cubao → Ayala Station",
                fare: "₱20.00",
              },
              {
                leg: "02",
                mode: "BGC BUS",
                route: "EDSA Ayala Terminal → Bonifacio Stopover",
                fare: "₱15.00",
              },
              {
                leg: "03",
                mode: "WALK",
                route: "250m lakad pa-BGC High Street",
                fare: "₱0.00",
              },
            ].map((item) => (
              <div
                key={item.leg}
                className="flex items-center justify-between rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-[10.5px]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="rounded bg-amber-400/20 px-1.5 py-0.5 text-[9.5px] font-semibold text-amber-300">
                    {item.mode}
                  </span>
                  <span className="text-white/85">{item.route}</span>
                </div>
                <span className="text-emerald-400">{item.fare}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-white/45">
          <span>SQLite Offline Dispatch Archive</span>
          <span>Total Estimated Fare: ₱35.00</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   4. BayaniRemit — Monochromatic Indigo/Slate Fintech & 3NF Envelope Mockup
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
      <div className="absolute left-[7%] top-[16%] z-10">
        <div className="font-geistSans text-[20px] font-semibold tracking-tight text-[#fff7f0]">
          BayaniRemit
        </div>
        <div className="font-geistMono text-[10.5px] text-violet-300/75">
          3NF Schema • OFW Envelope Ledger
        </div>
      </div>

      <div className="absolute left-[30%] top-[22%] right-[-4%] bottom-[-6%] rounded-tl-xl border border-white/15 bg-[#0e0d14] p-5 shadow-2xl font-geistMono flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <div className="text-[10px] text-white/45">BATCH #RM-2026-09</div>
              <div className="text-[15px] font-semibold text-white">
                $1,200.00 USD → ₱67,440.00 PHP
              </div>
            </div>
            <span className="rounded bg-violet-500/20 border border-violet-400/30 px-2 py-0.5 text-[10px] text-violet-300">
              56.20 PHP/USD
            </span>
          </div>

          <div className="mt-3.5 space-y-2">
            {[
              { env: "Household & Groceries", alloc: "₱25,000", pct: "78%" },
              { env: "PUP Tuition & Books", alloc: "₱18,000", pct: "100%" },
              { env: "Emergency Medical Fund", alloc: "₱14,440", pct: "42%" },
              { env: "Pag-IBIG MP2 Savings", alloc: "₱10,000", pct: "100%" },
            ].map((e) => (
              <div
                key={e.env}
                className="rounded border border-white/10 bg-white/[0.02] px-3 py-2 text-[10.5px] flex items-center justify-between"
              >
                <span className="text-white/85">{e.env}</span>
                <div className="flex items-center gap-3">
                  <span className="text-violet-300">{e.alloc}</span>
                  <span className="text-white/40 w-8 text-right">{e.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-2.5 text-[10px] text-white/40">
          <span>11 Normalized Tables (3NF)</span>
          <span>Supabase RLS Verified</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   5. NetForge — Cold Cyan/Abyss Skia Network Topology & OSPF Simulator Mockup
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
      <div className="absolute left-[7%] top-[16%] z-10">
        <div className="font-geistSans text-[20px] font-semibold tracking-tight text-[#fff7f0]">
          NetForge
        </div>
        <div className="font-geistMono text-[10.5px] text-[#48bcce]">
          Skia Canvas • OSPF &amp; Graph Visualizer
        </div>
      </div>

      <div className="absolute left-[30%] top-[22%] right-[-4%] bottom-[-6%] rounded-tl-xl border border-white/15 bg-[#090e13] p-5 shadow-2xl font-geistMono flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-[10px]">
          <span className="text-[#48bcce]">ALGORITHM: DIJKSTRA SPF (OSPF AREA 0)</span>
          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-300">
            DEPLOY READY
          </span>
        </div>

        {/* Simulated Topology Graph */}
        <div className="relative my-3 flex items-center justify-between px-4 py-5 rounded-lg border border-white/10 bg-black/40">
          <div className="rounded border border-[#48bcce] bg-[#48bcce]/15 px-2.5 py-1.5 text-center text-[10px]">
            <div className="font-bold text-[#48bcce]">R1-CORE</div>
            <div className="text-[9px] text-white/50">10.0.0.1/30</div>
          </div>

          <div className="flex-1 border-t border-dashed border-[#48bcce] mx-2 text-center text-[9px] text-[#48bcce]">
            cost: 10
          </div>

          <div className="rounded border border-white/25 bg-white/5 px-2.5 py-1.5 text-center text-[10px]">
            <div className="font-bold text-white">SW-DIST</div>
            <div className="text-[9px] text-white/50">VLAN 10,20</div>
          </div>

          <div className="flex-1 border-t border-dashed border-[#48bcce] mx-2 text-center text-[9px] text-[#48bcce]">
            trunk g0/1
          </div>

          <div className="rounded border border-emerald-400/60 bg-emerald-400/10 px-2.5 py-1.5 text-center text-[10px]">
            <div className="font-bold text-emerald-300">FW-EDGE</div>
            <div className="text-[9px] text-white/50">ACL PERMIT</div>
          </div>
        </div>

        <div className="rounded bg-black/70 border border-white/10 p-2.5 text-[10px] text-white/70">
          <span className="text-[#48bcce]">R1-CORE#</span> router ospf 1 &rarr;
          network 10.0.0.0 0.0.0.3 area 0
        </div>
      </div>
    </div>
  );
}
