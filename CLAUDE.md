# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Role

Full-stack web developer + data engineer. Primary mission: scrape and integrate Puget Sound Chinook salmon data from WDFW, USGS, NOAA, and the Puget Sound Partnership into a live interactive dashboard.

## Dev Command

```bash
npm run dev       # Next.js dev server → http://localhost:3010
npx nodemon app.js  # Legacy Express proxy (kept; use only if testing app.js routes directly)
```

Next.js hot-reloads automatically. No manual restarts needed.

## Architecture

**Backend** — `app.js` (Express, port 3000)
- Serves all static files (`index.html`, `styles.css`, `script.js`, `data/`)
- Proxies all external API calls server-side (eliminates CORS, enables caching)
- In-memory cache per route with 15-minute TTL

**Frontend** — `index.html` / `styles.css` / `script.js`
- `index.html` — Semantic HTML only. Loads Leaflet (v1.9.4) and Chart.js (v4.3.0) from CDN, then `styles.css` and `script.js`.
- `styles.css` — All visual styling. CSS variables for theming, Flexbox/Grid for layout.
- `script.js` — All client logic (~1000+ lines), organized into labeled block-comment sections.

### script.js Sections (in order)

1. **Configuration** — API constants pointing to `/api/*` Express routes; global layer state vars.
2. **Temperature helpers** — `getTemperatureColor/Status/Icon()`, `fetchUSGSTemperatureData()`, `loadTemperatureStations()`, `createTemperatureLegend()`, `toggleTemperature()`.
3. **Fallback data** — `FALLBACK_WATERSHED_DATA` (8 watersheds) used when `/api/wdfw` is unavailable.
4. **Time slider** — `generateHistoricalData()`, `updateMapForYear()`, `toggleAnimation()`, `initializeTimeSlider()`. Synthesizes historical data back to 1990.
5. **Population helpers** — `getPopulationColor()`, `statusLabel()`, `statusClass()`, `getHabitatColor()`.
6. **Data fetching** — `fetchWDFWData()`, `loadWatershedBoundaries()`, `fetchFishBarriers()` / `loadFishBarriers()`, `toggleBarriers()`.
7. **Initialization** — `initDashboard()` orchestrates all async loads, renders circles/charts/status card.

### Data Flow

All client API calls go to Express routes on `localhost:3000`. `initDashboard()`:

1. Loads `data/puget-sound-watersheds.geojson` → Leaflet polygon layer
2. Calls `/api/barriers` → WSDOT ArcGIS → Leaflet marker layer
3. Calls `/api/usgs` → parsed temperature stations → Leaflet marker layer
4. Calls `/api/wdfw` → WDFW SPI data → falls back to `FALLBACK_WATERSHED_DATA` on error
5. Renders population circles sized by `sqrt(population)`, colored by `% of recovery target`
6. Populates Chart.js charts (5-year trend line, watershed comparison bar chart)
7. Initializes time slider (1990–2024) with play/pause animation

### Population Health Color Scale

`getPopulationColor()` in `script.js`, based on `% of recovery target`:

| Range | Color | Status |
|-------|-------|--------|
| < 5% | `#dc2626` Red | Critical |
| 5–10% | `#ea580c` Orange | Endangered |
| 10–25% | `#ca8a04` Yellow | Threatened |
| ≥ 25% | `#22c55e` Green | Stable |

## API Routes (app.js)

| Route | Source | Description |
|-------|--------|-------------|
| `GET /api/wdfw` | data.wa.gov Socrata | WDFW SPI metrics (Puget Sound Chinook) |
| `GET /api/usgs` | waterservices.usgs.gov NWIS | Stream temperature, Puget Sound bounding box |
| `GET /api/barriers` | data.wsdot.wa.gov ArcGIS | Fish passage barriers |
| `GET /api/scrape` | WDFW + NOAA + PSP | Aggregated salmon data from multiple sources |

## Session Workflow

At the start of every session:
1. Read `CLAUDE.md`, `PLANNING.md`, and `TASKS.md`
2. Pick the next uncompleted task from `TASKS.md`
3. Work the task

Before stopping:
- Append a short summary of what was done to the **Session Log** section at the bottom of this file

---

## Adding a New Watershed

1. Add entry to `FALLBACK_WATERSHED_DATA` in `script.js` (~line 335) with fields: `watershed`, `population`, `recoveryTarget`, `latestYear`, `targetYear`, `estuary`, `tributaries`.
2. Add coordinates to the `coords` object inside `initDashboard()` (~line 975).
3. Add a matching GeoJSON feature to `data/puget-sound-watersheds.geojson`.

---

## Session Log

### 2026-02-21 (session 2)
- Milestone 1 "Site Shell Complete" — all checklist items implemented, `npm run build` clean
- Mobile hamburger nav in `SiteHeader.tsx` — animating bars, auto-closes on route change, `aria-expanded`
- Font loading: `Source_Sans_3` via `next/font/google`, `--font-sans-loaded` variable pattern (no circular CSS reference)
- `components/ui/InfoTooltip.tsx` — click toggle, Escape + outside-click dismiss, `role="tooltip"`
- `components/ui/Placeholder.tsx` — `owner` + `section` props, dashed border, now used in `/nations/[tribe]`
- `lib/data/species.ts` — 6 species with scientific names; `Species` type updated with `scientificName`
- `lib/data/projects.ts` — 5 mock projects (one per ProjectType), filterable by tribeId/type/watershedId
- `app/page.tsx` — stats strip added (8 watersheds, 9 nations, 5 projects)
- TASKS.md: M0.3, M0.4, M0.6 all marked complete; M0 milestone fully done

### 2026-02-21 (session 1)

- Scaffolded Next.js 15 + TypeScript + Tailwind v4 starter directly in repo (no `create-next-app`)
- Created: `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `app/globals.css`, `app/layout.tsx`
- Home page (`app/page.tsx`) with hero, two-pillar intro, how-to-use section
- All 14 routes stubbed and verified: `/`, `/dashboard/[basin]`, `/nations/[tribe]`, `/learn/[module]`, `/stewardship/[project]`, `/about`, + 4 API routes
- `components/layout/SiteHeader.tsx` (active nav state), `SiteFooter.tsx` (land acknowledgment)
- `components/ui/` — Card, PageHeader, StatusBadge
- `types/index.ts` — Watershed, Tribe, SalmonReturn, EnvReading, Project, PopulationStatus
- `lib/data/` — watersheds, tribes, salmon-returns, env-indicators adapters (mock Phase 1)
- API routes migrated from `app.js` → `app/api/{wdfw,usgs,barriers,scrape}/route.ts` with 15-min ISR
- Fixed `react-leaflet` version: v4→v5 (React 19 peer dep); `npm run build` passes clean
- Updated TASKS.md: M0.1, M0.2, M0.7 complete; M0.3, M0.4, M0.6 in progress; M0.5 approach changed

### 2026-02-20
- Created `app.js`: Express server on port 3010 (user changed from 3000), static serving + 4 proxy routes (`/api/wdfw`, `/api/usgs`, `/api/barriers`, `/api/scrape`) with 15-min in-memory cache
- Added `"type": "module"` to `package.json` for ES module support
- Rewrote `CLAUDE.md` to reflect Express backend, new dev command (`npx nodemon app.js`), updated architecture and API route table
- Added `node_modules/` to `.gitignore`
- Established session workflow: read CLAUDE.md + PLANNING.md + TASKS.md each session, pick next task, log summary here before stopping
