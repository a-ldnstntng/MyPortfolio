export interface ProjectItem {
  slug: string;
  name: string;
  season: string; // e.g., "Fall 2026" — editable placeholder
  tagline: string; // One-line description under card
  subtitle: string;
  featuredWide?: boolean; // Makes LIGTAS METRO slightly wider as the top project
  cover: string; // Path in /public/projects/[slug]/cover.png
  github?: string;
  liveUrl?: string;
  tags: string[];
  overview: string[];
  features: { title: string; detail: string }[];
  accentColor: string;
  mockupVariant: "ligtas" | "resetaph" | "parapo" | "bayaniremit" | "netforge";
}

export interface CitationItem {
  key: string;
  name: string;
  role: string;
  dates: string;
  summary: string;
  href?: string;
  badgeText: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SITE CONFIGURATION & CLEARLY MARKED PLACEHOLDERS
// Edit your links, handle, or email below in one place.
// ─────────────────────────────────────────────────────────────────────────────
export const SITE_CONFIG = {
  name: "Ali Andrei Tanting",
  shortName: "Ali Andrei",
  tagline: "i am cooked",
  location: "Manila, Philippines",
  university: "Polytechnic University of the Philippines",
  socials: [
    {
      label: "github",
      href: "https://github.com/a-ldnstntng", // PLACEHOLDER: update if your GitHub URL changes
    },
    {
      label: "linkedin",
      href: "https://www.linkedin.com/in/ali-andrei-tanting-126a7140b",
    },
    {
      label: "x",
      href: "https://x.com/liandrei_",
    },
    {
      label: "email",
      href: "mailto:andreiladines1901@gmail.com", // PLACEHOLDER: replace with your preferred email address
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// INLINE HOVER CITATIONS FOR HOME PAGE BIO
// ─────────────────────────────────────────────────────────────────────────────
export const CITATIONS: Record<string, CitationItem> = {
  pup: {
    key: "pup",
    name: "PUP Manila",
    role: "BS Computer Science (Research Track)",
    dates: "2024–Present",
    summary:
      "Focusing on graph algorithms, intelligent systems, and civic software engineering for Philippine urban infrastructure.",
    href: "https://www.pup.edu.ph/",
    badgeText: "P",
  },
  aiNative: {
    key: "aiNative",
    name: "AI-Native Workflow",
    role: "Directing, Reviewing & Shipping with Agents",
    dates: "Daily Practice",
    summary:
      "Building full-stack software with AI coding agents in the loop — focusing on architecture specs, deterministic verification, and rapid iteration.",
    href: "/projects",
    badgeText: "A",
  },
  ligtas: {
    key: "ligtas",
    name: "LIGTAS METRO",
    role: "Flood-Aware Commute Radar",
    dates: "Fall 2026",
    summary:
      "Real-time Metro Manila flood bypass radar combining 3D MapLibre GL hazard mapping, hydrological telemetry, and vehicle passability thresholds.",
    href: "/projects/ligtas-metro",
    badgeText: "L",
  },
  resetaph: {
    key: "resetaph",
    name: "ResetaPH",
    role: "Prescription Scanner & Price Comparator",
    dates: "Fall 2026",
    summary:
      "Reads handwritten Philippine prescriptions, compares generic medicine prices across local pharmacies, and outputs a Taglish care schedule.",
    href: "/projects/resetaph",
    badgeText: "R",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS DATA (Ordered Left-to-Right as Requested)
// Drop real cover images at /public/projects/[slug]/cover.png at any time.
// ─────────────────────────────────────────────────────────────────────────────
export const PROJECTS: ProjectItem[] = [
  {
    slug: "ligtas-metro",
    name: "LIGTAS METRO",
    season: "Fall 2026", // PLACEHOLDER: edit season label as needed
    tagline: "Flood-aware commute radar and road passability platform for Metro Manila.",
    subtitle: "Metro Manila Flood-Safe Commute & Emergency Bypass Radar",
    featuredWide: true,
    cover: "/projects/ligtas-metro/cover.png",
    github: "https://github.com/a-ldnstntng/LIGTAS",
    liveUrl: "", // PLACEHOLDER: add deployed URL when live
    tags: [
      "React 19",
      "Vite",
      "Tailwind CSS",
      "MapLibre GL",
      "Mapillary JS",
      "Gemini API",
      "Capacitor",
      "OSM Nominatim",
    ],
    accentColor: "#EBF728",
    mockupVariant: "ligtas",
    overview: [
      "Metro Manila's major thoroughfares flood within minutes during Habagat and typhoon season, leaving commuters and motorists stranded without localized ground-truth data. LIGTAS METRO is a flood-aware commute radar and road passability platform engineered for the National Capital Region, grounded in Project NOAH, DOST-PAGASA, MMDA EFCOS, and Open-Meteo GLoFAS hydrological telemetry.",
      "The platform pairs a high-contrast MapLibre GL 3D spatial hazard radar (supporting dynamic pitch tilt, flood elevation polygons, and OpenFreeMap vector tiles) with 360° street-level baselines via Mapillary v4 so commuters can visually compare dry-weather road clearances against live water gauges across España, Sta. Mesa, Araneta, Taft, Katipunan, and the Marikina River Basin.",
      "It computes a deterministic vehicle passability matrix for Pedestrians (<0.15m), Sedans (<0.20m), and SUVs/4x4s (<0.50m), alongside a 9-column rainfall trend matrix, river discharge forecasts, one-tap emergency dispatch hotlines (911, MMDA 136, Red Cross 143), and a deterministic RAG safety advisor powered by Gemini Flash.",
    ],
    features: [
      {
        title: "Roadway Ground Truth & Passability Matrix",
        detail:
          "Live water depth gauges with deterministic clearance thresholds for Pedestrians, Sedans, and SUVs/4x4s across flood-prone NCR corridors.",
      },
      {
        title: "MapLibre GL 3D Flood Radar",
        detail:
          "Interactive 2D/3D vector basemap overlaying flood hazard polygons, river stage stations, and rainfall intensity contours.",
      },
      {
        title: "360° Photometric Street View Baselines",
        detail:
          "Integrated Mapillary v4 street-level panoramic imagery and compass bearings for verifying physical roadway elevation.",
      },
      {
        title: "Deterministic RAG Safety Advisor",
        detail:
          "Conversational route safety assistant powered by Gemini API with an offline hydrological fallback engine and official PAGASA alert citations.",
      },
    ],
  },
  {
    slug: "resetaph",
    name: "ResetaPH",
    season: "Fall 2026", // PLACEHOLDER: edit season label as needed
    tagline: "Prescription scanner that decodes doctor reseta, compares PH generic drug prices, and builds a Taglish care guide.",
    subtitle: "AI Prescription Reader & Generic Medicine Price Comparator",
    featuredWide: false,
    cover: "/projects/resetaph/cover.png",
    github: "https://github.com/a-ldnstntng/resetaPH",
    liveUrl: "", // PLACEHOLDER: add deployed URL when live
    tags: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Gemini API",
      "Leaflet",
      "Kotlin",
      "Docker",
    ],
    accentColor: "#38bdf8",
    mockupVariant: "resetaph",
    overview: [
      "Deciphering handwritten medical prescriptions (reseta) and navigating steep out-of-pocket drug prices at the pharmacy counter are everyday obstacles for Filipino patients, seniors, and caregivers. ResetaPH is a prescription scanner, generic medicine price comparator, and Taglish care guide tailored to Philippine clinical shorthand and commercial drug formulations.",
      "Using server-side multimodal Gemini Vision (@google/genai) with structured schema extraction and multi-model fallback, ResetaPH transcribes handwritten prescription lines—translating Latin medical shorthand (OD, BID, TID, PC, AC, PRN) into clear Taglish instructions while flagging any ambiguous cursive as an editable UncertainField for pharmacist verification.",
      "Once decoded, ResetaPH cross-references catalog pricing across Mercury Drug, South Star Drug, and Rose Pharmacy to surface generic equivalents that save up to 62%. It includes a full-screen Pharmacist Counter Mode card, an interactive Leaflet pharmacy branch locator, and a daily medication schedule with spoken audio reminders (Umaga, Tanghali, Gabi).",
    ],
    features: [
      {
        title: "Multimodal Rx Vision Decoder",
        detail:
          "Extracts brand/generic names, strengths, quantities, and sig frequencies from handwritten Philippine prescriptions with uncertain-field safety flags.",
      },
      {
        title: "PH Generic Price Comparison",
        detail:
          "Compares medicine prices across Mercury Drug, South Star Drug, and Rose Pharmacy to highlight affordable generic alternatives.",
      },
      {
        title: "Full-Screen Pharmacist Counter Card",
        detail:
          "High-contrast, large-print display mode designed to be handed directly to pharmacy counter staff for frictionless ordering.",
      },
      {
        title: "Taglish Care Guide & Spoken Schedule",
        detail:
          "Translates clinical abbreviations into a daily Umaga / Tanghali / Gabi timeline with bilingual Tagalog/English toggle and voice playback.",
      },
    ],
  },
  {
    slug: "para-po",
    name: "PARA PO!",
    season: "Summer 2026", // PLACEHOLDER: edit season label as needed
    tagline: "Offline-capable NCR public transit guide that understands natural Taglish commute queries.",
    subtitle: "Philippine Public Transit Guide & Taglish Route Extractor",
    featuredWide: false,
    cover: "/projects/para-po/cover.png",
    github: "https://github.com/a-ldnstntng/para-po",
    liveUrl: "", // PLACEHOLDER: add deployed URL when live
    tags: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Gemini API",
      "SQLite",
      "Capacitor",
      "Web Speech API",
    ],
    accentColor: "#10b981",
    mockupVariant: "parapo",
    overview: [
      "Navigating Metro Manila's jeepneys, UV Express vans, buses, tricycles, and rail lines relies on commuter wisdom shared in conversational Taglish rather than rigid GTFS feeds. PARA PO! is an offline-capable NCR public transit guide that treats Taglish as a first-class citizen, turning colloquial directions into structured, step-by-step transit itineraries.",
      "Backed by a React 19 + TypeScript frontend and an Express + SQLite (sql.js) persistence layer, the app uses a multi-model Gemini cascade to extract vehicle mode badges, landmark transfer points, actionable instructions, and estimated Philippine Peso (₱) fares—paired with hands-free Filipino (fil-PH) voice input via the Web Speech API.",
      "Extracted routes are rendered as scannable Thermal Print Commute Tickets with generated barcodes and saved to a local Terminal Dispatch Archive for offline access and community upvote verification.",
    ],
    features: [
      {
        title: "Taglish & Filipino Voice Route Extraction",
        detail:
          "Parses natural Taglish queries and fil-PH voice dictation into structured multi-leg PUV itineraries with PHP fare estimates.",
      },
      {
        title: "Thermal Print Commute Tickets",
        detail:
          "Renders step-by-step transit cards complete with mode badges, landmark transfer nodes, and scannable barcodes.",
      },
      {
        title: "Offline SQLite Terminal Dispatch Archive",
        detail:
          "Caches verified routes locally via sql.js with instant search filtering and crowdsourced accuracy upvotes.",
      },
    ],
  },
  {
    slug: "bayaniremit",
    name: "BayaniRemit",
    season: "Spring 2026", // PLACEHOLDER: edit season label as needed
    tagline: "Relational database and YNAB-style envelope tracker for OFW remittance and household allocation.",
    subtitle: "OFW Remittance & Household Financial Allocation System",
    featuredWide: false,
    cover: "/projects/bayaniremit/cover.png",
    github: "https://github.com/a-ldnstntng/BayaniRemit",
    liveUrl: "https://bayani-remit.vercel.app",
    tags: [
      "Next.js",
      "React 19",
      "TypeScript",
      "PostgreSQL",
      "Supabase",
      "Tailwind CSS",
      "Zustand",
      "Recharts",
    ],
    accentColor: "#a78bfa",
    mockupVariant: "bayaniremit",
    overview: [
      "Overseas Filipino Workers (OFWs) send remittances home every month, yet families often lack a unified system to track how transfer batches are allocated across household needs, tuition, debt, and savings goals. BayaniRemit is a relational database and household envelope budgeting platform built for OFWs and their beneficiaries.",
      "Architected around an 11-table, Third Normal Form (3NF) PostgreSQL schema (profiles, beneficiaries, income_sources, transfer_providers, exchange_rate_snapshots, remittance_batches, envelopes, envelope_allocations, transactions, savings_goals, and audit_log) with Supabase Row Level Security, it pairs strict relational integrity with a clean monochromatic dark fintech interface.",
      "Remitters can split incoming transfer batches across custom household envelopes, log local PHP (₱) expenses against allocations, compare transfer provider fee snapshots, and export chronological audit ledgers to CSV.",
    ],
    features: [
      {
        title: "11-Table, 3NF Relational Schema",
        detail:
          "Normalized PostgreSQL database modeling remittance batches, exchange rate snapshots, beneficiaries, and envelope allocations with RLS.",
      },
      {
        title: "YNAB-Style Household Envelope Budgeting",
        detail:
          "Splits remittance inflows across dedicated family expense categories with real-time On Track / Over Budget status tracking.",
      },
      {
        title: "Audit Trail & Ledger CSV Export",
        detail:
          "Chronological transaction logging across currencies and transfer providers with one-click spreadsheet export.",
      },
    ],
  },
  {
    slug: "netforge",
    name: "NetForge",
    season: "Spring 2026", // PLACEHOLDER: edit season label as needed
    tagline: "Mobile network topology designer, Layer 2/3 packet simulator, and graph algorithm visualizer.",
    subtitle: "Mobile Network Topology Designer & Packet Simulator",
    featuredWide: false,
    cover: "/projects/netforge/cover.png",
    github: "https://github.com/Renz5678/NetForge",
    liveUrl: "", // PLACEHOLDER: add APK / release link if desired
    tags: [
      "React Native",
      "Expo",
      "TypeScript",
      "React Native Skia",
      "Zustand",
      "Supabase",
      "PostgreSQL",
      "AsyncStorage",
      "Jest",
    ],
    accentColor: "#48bcce",
    mockupVariant: "netforge",
    overview: [
      "Designing and validating Layer 2 and Layer 3 network topologies traditionally requires desktop simulators like Cisco Packet Tracer or physical lab racks. NetForge brings offline-first network topology design, packet simulation, and step-by-step graph algorithm visualization to mobile via React Native, Expo, and a GPU-accelerated 2D Skia canvas.",
      "Users wire together Routers, Switches, Firewalls, WAN Uplinks, and Department Hosts with per-port IPv4/CIDR addressing, Access/Trunk VLANs, static routes, single-area OSPF, and stateless firewall ACL rule chains. Six pure-TypeScript graph algorithms—Dijkstra's SPF, A* Pathfinding, Multi-Source BFS, DFS Cycle Detection (with Tarjan's articulation points), BFS Topological Sort (with VLSM subnetting), and Prim's MST—power both the live routing tables and an interactive frame-by-frame canvas replay.",
      "Includes a Five-Phase Validate Pass that audits topology readiness and a syntax-accurate Cisco IOS CLI Configuration Exporter that generates ready-to-paste router and switch scripts.",
    ],
    features: [
      {
        title: "GPU-Accelerated Skia Topology Canvas",
        detail:
          "Touch-first diagramming for Routers, Switches, Firewalls, WANs, and Hosts with port-level wiring and pinch-to-zoom gestures.",
      },
      {
        title: "Layer 2/3 Packet Simulator & Six Graph Visualizers",
        detail:
          "Simulates hop-by-hop packet routing with Longest Prefix Match, VLAN tagging, ACL evaluation, and step-by-step replays of Dijkstra, A*, BFS, DFS/Tarjan, TopoSort, and Prim's MST.",
      },
      {
        title: "Cisco IOS CLI Configuration Exporter",
        detail:
          "Generates syntax-accurate interface, OSPF, switchport VLAN, and extended ACL configuration scripts per device.",
      },
    ],
  },
];

// Placeholder array for future Hackathon photo archives on /gallery
export const GALLERY_ARCHIVES: {
  id: string;
  title: string;
  event: string;
  date: string;
  src: string;
}[] = [];
