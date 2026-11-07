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

// Screenshot-led covers share one composition so artwork scales with its card.
function PhoneScreenshot({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    <div className={`project-phone ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={780} height={1688} draggable={false} />
    </div>
  );
}

function LigtasPresentation() {
  return (
    <div className="project-art project-art-ligtas">
      <div className="project-art-brand">
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 3 30 28H2L16 3Z" fill="currentColor"/><path d="M16 12v7m0 4v.5" stroke="#34351b" strokeWidth="2.5" strokeLinecap="round"/></svg>
        <span>LIGTAS METRO</span>
      </div>
      <PhoneScreenshot className="project-phone-back" src="/projects/ligtas-metro/01-ground-truth-mobile.png" alt="LIGTAS METRO roadway conditions and vehicle passability" />
      <PhoneScreenshot className="project-phone-front" src="/projects/ligtas-metro/02-flood-radar-3d-mobile.png" alt="LIGTAS METRO 3D flood radar with an elevated bypass route" />
    </div>
  );
}

function ResetaPresentation() {
  return (
    <div className="project-art project-art-reseta">
      <div className="project-art-brand"><span className="project-art-rx" aria-hidden="true">Rx</span><span>ResetaPH</span></div>
      <PhoneScreenshot className="project-phone-back" src="/projects/resetaph/redesign-home.png" alt="Redesigned ResetaPH Android home screen with prescription scanning and quick actions" />
      <PhoneScreenshot className="project-phone-front" src="/projects/resetaph/redesign-welcome.png" alt="Redesigned ResetaPH welcome screen with illustrated medicine tiles" />
    </div>
  );
}

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

function BayaniRemitMockup() {
  return (
    <div className="project-art project-art-bayani">
      <div className="project-art-brand">
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="3" y="7" width="26" height="19" rx="3" stroke="currentColor" strokeWidth="2"/><path d="m4 9 12 9L28 9" stroke="currentColor" strokeWidth="2"/></svg>
        <span>BayaniRemit</span>
      </div>
      <div className="project-browser">
        <div className="project-browser-bar" aria-hidden="true"><i/><i/><i/><span>BayaniTrack</span></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/projects/bayaniremit/02-home-styled.jpg" alt="BayaniRemit's BayaniTrack landing page for remittance tracking and household envelope budgeting" width={1280} height={900} draggable={false} />
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
