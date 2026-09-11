"use client";

import Marquee from "@/components/Marquee";
import TechIcon from "@/components/TechIcon";
import {
  ArrowUpRight,
  Code,
  Envelope,
  MapPin,
  User,
  Brain,
  Globe,
  ChatCircle,
  CloudRain,
  Bus,
  CurrencyCircleDollar,
  Plugs,
  DeviceMobile,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { smoothScrollTo } from "@/lib/utils";

const aiTools = [
  { name: "Claude", color: "#D4A574" },
  { name: "Antigravity", color: "#7C3AED" },
  { name: "Codex", color: "#10A37F" },
  { name: "OpenCode", color: "#2563EB" },
  { name: "Gemini", color: "#4285F4" },
  { name: "Cursor", color: "#6366F1" },
];

const techStack = [
  "React Native",
  "TypeScript",
  "Python",
  "PostgreSQL",
  "MySQL",
  "Linux",
  "Packet Tracer",
];

const alsoWorkingWith = [
  "React 19",
  "Vite",
  "Tailwind CSS",
  "Node.js",
  "Express",
  "Gemini API",
  "SQLite",
  "Capacitor",
  "MapLibre GL",
  "Git",
];

export default function PortfolioContent() {
  return (
    <div className="w-full max-w-[1100px] mx-auto min-w-0">
      {/* ═══════════ HOME ═══════════ */}
      <section id="home" className="mb-8 sm:mb-10 scroll-mt-28 lg:scroll-mt-20 w-full min-w-0">
        {/* Hero */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-8 mb-6 sm:mb-8 w-full min-w-0">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sand-100 leading-[1.15] mb-4 sm:mb-5">
              AI Enthusiast.
              <br />
              I like to Build things.
            </h2>
            <p className="text-base sm:text-lg max-w-xl leading-[2.1] sm:leading-[2.2]">
              <span className="bg-sand-200 text-[#0A0A0A] font-medium px-2 py-0.5 rounded-[3px] box-decoration-clone shadow-sm">
                AI-powered developer and Computer Science Research major, currently
                pursuing my BS in Computer Science at the Polytechnic University of
                the Philippines. I build intelligent applications and automations,
                from flood-aware commute radars to transit guides, leveraging
                cutting-edge tools to solve real problems for real people.
              </span>
            </p>
          </div>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo("contact");
            }}
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3.5
                       bg-sand-200 text-[#0A0A0A] rounded-full font-semibold text-base
                       hover:bg-sand-100 transition-colors duration-200
                       shadow-lg shadow-black/30 sm:mt-2 cursor-pointer"
          >
            Get in touch
            <ChatCircle size={20} weight="fill" aria-hidden="true" />
          </a>
        </div>

        {/* Marquee */}
        <Marquee />
      </section>

      {/* ═══════════ BENTO GRID ═══════════ */}
      <section aria-label="Overview" className="mb-14 sm:mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* ── Projects Card ── */}
          <Card asChild className="group cursor-pointer border-white/[0.08]">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo("projects");
              }}
            >
              <CardHeader>
                <span className="card-dot" aria-hidden="true" />
                <CardTitle>PROJECTS</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-sand-400/60 mb-4">
                  Flood radars, transit guides, budget trackers, and AI tools
                  built for the Philippines and beyond.
                </p>
                <div
                  className="aspect-[4/3] rounded-xl bg-gradient-to-br from-sand-400/20 to-sand-500/10
                              flex items-center justify-center overflow-hidden
                              group-hover:from-sand-400/30 group-hover:to-sand-500/20 transition-all duration-500"
                >
                  <span
                    className="text-sand-200/10 text-[4.5rem] font-black select-none"
                    aria-hidden="true"
                  >
                    {"</>"}
                  </span>
                </div>
              </CardContent>
            </a>
          </Card>

          {/* ── About Card ── */}
          <Card asChild className="group cursor-pointer border-white/[0.08]">
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo("about");
              }}
            >
              <CardHeader>
                <span className="card-dot" aria-hidden="true" />
                <CardTitle>ABOUT</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-sand-400/60 mb-4">Who I am and how I work.</p>
                <div
                  className="aspect-[4/3] rounded-xl bg-gradient-to-br from-sand-500/10 to-sand-500/5
                              flex items-center justify-center"
                >
                  <User
                    size={72}
                    weight="duotone"
                    className="text-sand-400/15"
                    aria-hidden="true"
                  />
                </div>
              </CardContent>
            </a>
          </Card>

          {/* ── AI Tools Card ── */}
          <Card>
            <CardHeader>
              <span className="card-dot" aria-hidden="true" />
              <CardTitle>AI TOOLS</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-sand-400/60 mb-4">
                AI agents, assistants, and the tools I build with every day.
              </p>
              <div className="flex flex-wrap gap-2">
                {aiTools.map((tool) => (
                  <Badge key={tool.name}>
                    <TechIcon name={tool.name} size={14} />
                    {tool.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ── Tech Stack Card ── */}
          <Card>
            <CardHeader>
              <span className="card-dot" aria-hidden="true" />
              <CardTitle>TECH STACK</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-sand-400/60 mb-3">
                Languages, frameworks, and tools I work with.
              </p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <Badge key={tech}>
                    <TechIcon name={tech} size={14} />
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ── Services Card ── */}
          <Card>
            <CardHeader>
              <span className="card-dot" aria-hidden="true" />
              <CardTitle>SERVICES</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-sand-400/60 mb-3">
                What I build for clients and teams.
              </p>
              <ul className="space-y-3">
                {[
                  { icon: Globe, label: "Web Applications", num: "01" },
                  { icon: Brain, label: "AI Integrations", num: "02" },
                  { icon: DeviceMobile, label: "Mobile / PWA", num: "03" },
                  { icon: Code, label: "API Development", num: "04" },
                ].map((svc) => (
                  <li
                    key={svc.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2.5">
                      <svc.icon
                        size={18}
                        weight="duotone"
                        className="text-sand-400"
                        aria-hidden="true"
                      />
                      {svc.label}
                    </span>
                    <span className="text-sand-500/30 text-xs font-semibold">
                      {svc.num}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* ── Contact Preview Card ── */}
          <Card asChild className="group cursor-pointer border-white/[0.08]">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo("contact");
              }}
            >
              <CardHeader>
                <span className="card-dot" aria-hidden="true" />
                <CardTitle>CONTACT</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-sand-400/60 mb-5">
                  Let&apos;s build something amazing together.
                </p>
                <div
                  className="flex items-center gap-2 text-sand-300 font-semibold text-base
                              group-hover:gap-3.5 transition-all duration-300"
                >
                  <span>Get in touch</span>
                  <ArrowUpRight size={20} weight="bold" aria-hidden="true" />
                </div>
              </CardContent>
            </a>
          </Card>
        </div>
      </section>

      {/* ═══════════ PROJECTS ═══════════ */}
      <section id="projects" className="mb-14 sm:mb-20 scroll-mt-28 lg:scroll-mt-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-sand-100 mb-6 sm:mb-8">Projects</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* LIGTAS METRO */}
          <Card asChild className="group cursor-pointer">
            <a
              href="https://github.com/a-ldnstntng/LIGTAS"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className="aspect-[16/9] rounded-xl bg-gradient-to-br from-blue-700 to-blue-500
                            mb-5 flex items-center justify-center overflow-hidden
                            group-hover:from-blue-600 group-hover:to-blue-400 transition-all duration-500"
              >
                <CloudRain
                  size={56}
                  weight="duotone"
                  className="text-white/20"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-bold text-sand-100 mb-1 flex items-center gap-2">
                LIGTAS METRO
                <ArrowUpRight
                  size={20}
                  weight="bold"
                  className="text-sand-500/0 group-hover:text-sand-300 transition-colors duration-200"
                  aria-hidden="true"
                />
              </h3>
              <p className="text-sm text-sand-400 font-medium mb-3">
                Flood-Aware Commute Radar
              </p>
              <p className="text-sm text-sand-400/60 mb-4">
                Metro Manila&apos;s roads flood in minutes during Habagat/typhoon
                season. LIGTAS METRO fixes that with real ground-truth data —
                dual-mode inspection, hydrological telemetry, vehicle-specific
                passability, and MapLibre GL vector radar.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "React 19",
                  "Vite",
                  "Tailwind CSS",
                  "MapLibre GL",
                  "Mapillary JS",
                  "Lucide React",
                  "OSM Nominatim",
                ].map((tag) => (
                  <Badge key={tag}>
                    <TechIcon name={tag} size={12} />
                    {tag}
                  </Badge>
                ))}
              </div>
            </a>
          </Card>

          {/* PARA PO! */}
          <Card asChild className="group cursor-pointer">
            <a
              href="https://github.com/a-ldnstntng/para-po"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className="aspect-[16/9] rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-500
                            mb-5 flex items-center justify-center overflow-hidden
                            group-hover:from-emerald-600 group-hover:to-emerald-400 transition-all duration-500"
              >
                <Bus
                  size={56}
                  weight="duotone"
                  className="text-white/20"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-bold text-sand-100 mb-1 flex items-center gap-2">PARA PO!
                <ArrowUpRight
                  size={20}
                  weight="bold"
                  className="text-sand-500/0 group-hover:text-sand-300 transition-colors duration-200"
                  aria-hidden="true"
                />
              </h3>
              <p className="text-sm text-sand-400 font-medium mb-3">
                NCR Commute &amp; PUV Transit Guide
              </p>
              <p className="text-sm text-sand-400/60 mb-4">
                Philippine public transit guide treating Taglish as a first-class
                citizen. Features conversational route extraction via multi-model
                Gemini cascade, digital transit passes, offline-first PWA, and
                crowdsourced accuracy.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "React 19",
                  "TypeScript",
                  "Vite",
                  "Tailwind CSS",
                  "Node.js",
                  "Express",
                  "Gemini API",
                  "SQLite",
                  "Capacitor",
                ].map((tag) => (
                  <Badge key={tag}>
                    <TechIcon name={tag} size={12} />
                    {tag}
                  </Badge>
                ))}
              </div>
            </a>
          </Card>

          {/* BayaniRemit */}
          <Card asChild className="group cursor-pointer">
            <a
              href="https://github.com/a-ldnstntng/BayaniRemit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className="aspect-[16/9] rounded-xl bg-gradient-to-br from-violet-700 to-violet-500
                            mb-5 flex items-center justify-center overflow-hidden
                            group-hover:from-violet-600 group-hover:to-violet-400 transition-all duration-500"
              >
                <CurrencyCircleDollar
                  size={56}
                  weight="duotone"
                  className="text-white/20"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-bold text-sand-100 mb-1 flex items-center gap-2">
                BayaniRemit
                <ArrowUpRight
                  size={20}
                  weight="bold"
                  className="text-sand-500/0 group-hover:text-sand-300 transition-colors duration-200"
                  aria-hidden="true"
                />
              </h3>
              <p className="text-sm text-sand-400 font-medium mb-3">
                Remittance &amp; Household Budget Tracker
              </p>
              <p className="text-sm text-sand-400/60 mb-4">
                OFW remittance and household allocation tracker, originally built
                as a full relational database project (11-table, 3NF schema) —
                now being rebuilt into a real full-stack app with a budget-tracker
                feel.
              </p>
              <div className="flex flex-wrap gap-2">
                {["PostgreSQL", "MySQL"].map((tag) => (
                  <Badge key={tag}>
                    <TechIcon name={tag} size={12} />
                    {tag}
                  </Badge>
                ))}
              </div>
            </a>
          </Card>

          {/* AIRelay */}
          <Card asChild className="group cursor-pointer">
            <a
              href="https://github.com/a-ldnstntng/airelay"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className="aspect-[16/9] rounded-xl bg-gradient-to-br from-amber-700 to-amber-500
                            mb-5 flex items-center justify-center overflow-hidden
                            group-hover:from-amber-600 group-hover:to-amber-400 transition-all duration-500"
              >
                <Plugs
                  size={56}
                  weight="duotone"
                  className="text-white/20"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-bold text-sand-100 mb-1 flex items-center gap-2">AIRelay
                <ArrowUpRight
                  size={20}
                  weight="bold"
                  className="text-sand-500/0 group-hover:text-sand-300 transition-colors duration-200"
                  aria-hidden="true"
                />
              </h3>
              <p className="text-sm text-sand-400 font-medium mb-3">
                Chrome Extension
              </p>
              <p className="text-sm text-sand-400/60 mb-4">
                Ever run out of tokens on Claude mid-conversation and have to
                start over on Gemini or ChatGPT, re-explaining everything? AIRelay
                kills that friction — seamlessly relay context across AI platforms.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Chrome Extension", "JavaScript", "AI APIs"].map((tag) => (
                  <Badge key={tag}>
                    <TechIcon name={tag} size={12} />
                    {tag}
                  </Badge>
                ))}
              </div>
            </a>
          </Card>
        </div>
      </section>

      {/* ═══════════ ABOUT ═══════════ */}
      <section id="about" className="mb-14 sm:mb-20 scroll-mt-28 lg:scroll-mt-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-sand-100 mb-6 sm:mb-8">About</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Bio */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Developer &amp; AI Engineer</CardTitle>
            </CardHeader>
            <Separator className="bg-white/[0.1]" />
            <CardContent className="pt-4">
              <div className="space-y-4 text-base text-sand-400/75 leading-relaxed">
                <p>
                  I&apos;m Ali Andrei L. Tanting — a developer passionate about
                  leveraging artificial intelligence to build smarter, faster, and
                  more impactful software. I specialize in creating applications
                  that solve real problems in the Philippines and beyond — from
                  flood-aware commute radars to transit guides that treat Taglish
                  as a first-class citizen.
                </p>
                <p>
                  My approach combines hands-on engineering with the latest AI
                  tools. Whether it&apos;s building full-stack web applications
                  with React and Node.js, designing AI-powered automations with
                  Claude and Gemini, or crafting mobile-first PWAs with Capacitor,
                  I focus on delivering clean, maintainable code that creates real
                  value for real people.
                </p>
                <p>
                  When I&apos;m not coding, you&apos;ll find me exploring the
                  latest developments in AI, contributing to open-source projects,
                  and continuously learning new technologies to stay at the cutting
                  edge.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar cards */}
          <div className="space-y-5 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <Badge key={tech}>
                      <TechIcon name={tech} size={14} />
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Also Working With</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {alsoWorkingWith.map((tech) => (
                    <Badge key={tech}>
                      <TechIcon name={tech} size={14} />
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ═══════════ CONTACT ═══════════ */}
      <section id="contact" className="mb-14 sm:mb-20 scroll-mt-28 lg:scroll-mt-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-sand-100 mb-6 sm:mb-8">Contact</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Let&apos;s work together</CardTitle>
            </CardHeader>
            <CardContent>
              <form action="#contact" className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-sand-300 mb-2"
                    >
                      Name
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-sand-300 mb-2"
                    >
                      Email
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-sand-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell me about your project..."
                    className="w-full px-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.1]
                               text-base text-sand-200 placeholder:text-sand-500/40
                               focus:outline-none focus:ring-2 focus:ring-sand-400/30 focus:border-sand-400/50
                               transition-all duration-200 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-sand-200 text-[#0A0A0A]
                             rounded-full font-semibold text-base hover:bg-sand-100
                             transition-colors duration-200 shadow-lg shadow-black/30
                             focus:outline-none focus:ring-2 focus:ring-sand-400 focus:ring-offset-2
                             focus:ring-offset-black"
                >
                  Send Message
                  <ArrowUpRight size={20} weight="bold" aria-hidden="true" />
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Contact info */}
          <div className="space-y-5 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <a
                    href="mailto:andreiladines1901@gmail.com"
                    className="flex items-center gap-3 text-base text-sand-300 hover:text-sand-100 transition-colors"
                  >
                    <Envelope
                      size={22}
                      weight="duotone"
                      className="text-sand-400 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="break-all">andreiladines1901@gmail.com</span>
                  </a>
                  <Separator className="bg-white/[0.1]" />
                  <div className="flex items-center gap-3 text-base text-sand-300">
                    <MapPin
                      size={22}
                      weight="duotone"
                      className="text-sand-400 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>Philippines</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent>
                <p className="text-base text-sand-400/60 mb-3">
                  Prefer a quick chat?
                </p>
                <a
                  href="https://www.facebook.com/a.ldnstntng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-base font-semibold text-sand-300
                             hover:text-sand-100 transition-colors"
                >
                  <ChatCircle size={22} weight="duotone" aria-hidden="true" />
                  Message me on Facebook
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
