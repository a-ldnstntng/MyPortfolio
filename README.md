# Ali Andrei Tanting — Portfolio

Minimalist personal portfolio featuring an interactive cellular-grid **ASCII Orca Pod** simulation (`/`), a side-scrolling project showcase (`/projects`), project deep-dives (`/projects/[slug]`), and a hackathon archive gallery (`/gallery`).

## Tech Stack
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + CSS Custom Properties (`#1a1917` Dark / `#f5f4f1` Light)
- **Simulation:** 60fps 2D Canvas Cellular Grid Rasterizer (`components/AsciiOrcaGrid.tsx`)
- **Motion:** Framer Motion + `requestAnimationFrame` horizontal wheel inertia

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Customizing Content & Covers

All site copy, social links, inline bio citations, project metadata, and gallery items live in a single file:
- **[`lib/projects.ts`](./lib/projects.ts)**

### Dropping in Real Project Cover Images
Each project card reads from `/public/projects/[slug]/cover.png` (and falls back automatically to a custom-coded device UI mockup if no image file is present):
- `/public/projects/ligtas-metro/cover.png`
- `/public/projects/resetaph/cover.png`
- `/public/projects/para-po/cover.png`
- `/public/projects/bayaniremit/cover.png`
- `/public/projects/netforge/cover.png`

### Adding Hackathon Photos to `/gallery`
Currently `/gallery` renders `coming soon.` while `GALLERY_ARCHIVES` in `lib/projects.ts` is empty. Adding an item to `GALLERY_ARCHIVES` automatically activates the responsive photo archive grid.

---

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Keep the default Next.js build settings (`npm run build`) and click **Deploy**.
