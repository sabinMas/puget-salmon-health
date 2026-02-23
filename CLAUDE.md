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

### 2026-02-22 (session 7, continued again x2)
- **M7.4 — Content review**: Audited every page for stale tribal-partnership claims; fixes: removed "Tribal content is authored and governed by partner nations" from footer; replaced two dead `/nations` links (salmon-life-cycle + treaty-rights "Continue Learning") with `/stewardship`; removed "with tribal partners (M6)" from educators resources subtitle; removed "Tribal partners are also available for classroom presentations" from educators CTA; softened about page "two equal pillars" paragraph to factual framing; deleted orphaned `components/nations/` folder and `lib/data/tribes.ts` (no imports anywhere); treaty-rights factual history content untouched
- `npm run build` ✅ 15 routes clean

### 2026-02-22 (session 7, continued again)
- **M5.6** — Added freshness indicators throughout dashboard: imported `salmonDataFetchedAt` in both `/dashboard` and `/dashboard/[basin]`; appended `· Refreshed Feb 21, 2026` to WDFW chart source footnotes; USGS temp tooltip now shows `As of [date, time]` from live station timestamp; Data Sources accordion shows station count + live timestamp inline; added `fmtDate` / `fmtDateTime` helpers to both pages
- M5 milestone marked **COMPLETE** in TASKS.md; M2 updated to REMOVED; M6 flagged for replan
- `npm run build` ✅ 15 routes clean

### 2026-02-22 (session 7, continued)
- **M5.4** — Fixed 3 GeoJSON name mismatches: added `geoJsonName?: string` to `Watershed` interface; set values for Lake Washington/Cedar/Sammamish (`"Cedar-Sammamish River"`), Green/Duwamish (`"Duwamish River"`), and Puyallup/White (`"Puyallup-White River"`); updated `WatershedMap.tsx` lookup to use `w.geoJsonName ?? w.name` — all 6 map polygons now clickable
- **M5.5** — Swept all "Mock Data" labels: WDFW salmon returns source → `"data.wa.gov"`; temp/flow trend charts → `"Synthetic historical data — USGS NWIS annual summaries planned"`; about page status note updated from yellow warning to blue informational, reflecting live WDFW + USGS status
- `npm run build` ✅ 15 routes clean

### 2026-02-22 (session 7)
- **M5.3b** — Wired real USGS temperature data into the dashboard `SalmonMetricCard`: fetches `/api/usgs` client-side, uses per-watershed lat/lon bounding boxes to filter nearby stations, computes median temperature, shows station count; falls back to `—` with error tooltip; updated Data Sources section to reflect live vs synthetic data
- **Nations removal** — Deleted `app/nations/` (both index and `[tribe]` pages); removed "Nations" from `SiteHeader` nav; rewrote `app/page.tsx` to remove `getTribes()` and `/nations` links, replacing "Meet the Nations" CTAs with "View Projects" → `/stewardship`; replaced the "Knowledge Holders" pillar with a "The Projects" pillar; removed "Tribal Partners" metric card (now "Stewardship Projects"); simplified `app/stewardship/page.tsx` and `app/stewardship/[project]/page.tsx` to remove all `/nations/[slug]` links and `getTribes()` dependency; updated basin detail page to link to `/stewardship` instead of `/nations`
- `npm run build` ✅ 15 routes clean (down from 16+2 tribe routes)

### 2026-02-21 (session 5)
- **M1.2** — Built `<IndicatorChart>` (`components/dashboard/IndicatorChart.tsx`) using Recharts: `AreaChart`/`LineChart`, `ResponsiveContainer`, gradient fill, custom tooltip, accessible `<figcaption>` summary, loading skeleton, empty state; exports `ChartDataPoint` type
- **M1.6** — Rebuilt basin detail page (`app/dashboard/[basin]/page.tsx`) as a server component: fetches salmon return data server-side, passes to chart components; Chinook area chart, 6-species breakdown grid, env indicator charts, tribal connections block, `generateMetadata`
- **M1.7** — Dashboard polish: map instruction caption, "Explore [basin] in detail →" link appears when watershed selected, temperature trend direction corrected
- M1 milestone marked **COMPLETE** in TASKS.md
- `npm run lint` ✅ `npm run build` ✅ all 15 routes

### 2026-02-22 (session 9)
- M7.1 — Full accessibility audit + fixes (WCAG 2.1 AA):
  - app/page.tsx: decorative emoji → `aria-hidden="true"`; H3→H2 for "The Data"/"The Projects"; H4→H3 for "How to Use" items (fixed H1→H3 skip)
  - app/about/page.tsx: added `scope="col"` to all table `<th>` elements
  - SpeciesFilter: added `aria-pressed` + `focus:ring-2` to all toggle buttons
  - ProjectList: added `aria-pressed` + focus rings to filter buttons; `aria-hidden` on status symbols (●/✓); `aria-label` on "Learn More →" links (was ambiguous across cards)
  - WatershedMap: focus ring on "Show all ×" reset button
  - InfoTooltip: added `useId()` + `id` on tooltip + `aria-describedby` on button; `aria-hidden` on SVG icon
  - IndicatorChart: added `<details>` data table as screen-reader/keyboard alternative to every chart
  - dashboard/page.tsx: added `aria-live="polite"` region for chart loading announcements; map loading skeleton gets `aria-label`
  - educators/page.tsx: `aria-label` on "Open Module →" links to disambiguate between modules
  - Confirmed existing passes: skip-to-content in layout.tsx ✓, WatershedSelector label/id ✓, StatusBadge role="img" ✓, breadcrumb aria-label ✓
- `npm run build` → ✅ 15 routes clean

### 2026-02-22 (session 8)
- M7.3 — Responsive design review: fixed 6 issues across the site
  - SiteHeader: hamburger button `p-1` → `p-2 min-h-[44px] min-w-[44px]` (WCAG 44px tap target)
  - WatershedMap: fixed 380px height → `h-[280px] sm:h-[380px]` (shorter on mobile)
  - app/page.tsx hero: `text-5xl` → `text-3xl sm:text-5xl` (prevents overflow on small phones)
  - dashboard/[basin]: `flex-wrap` on header row + footer nav; `p-8` → `p-4 sm:p-8` on chart card
  - about/page.tsx table: `px-6 py-3/4` → `px-3 py-2/3 sm:px-6 sm:py-3/4` (more room on mobile)
  - IndicatorChart: axis label font 12→11px, y-axis width 45→40px (less clutter at small widths)
- `npm run build` → ✅ 15 routes clean

### 2026-02-22 (session 7)
- Removed all Nations/tribal pages and orphaned code (app/nations/, components/nations/, lib/data/tribes.ts) — no real partnerships exist
- Removed "Nations" from SiteHeader nav
- Rewrote app/page.tsx: Nations CTA → "View Projects", Knowledge Holders pillar → "The Projects", Tribal Partners metric → "Stewardship Projects"
- Updated app/stewardship/page.tsx, stewardship/[project]/page.tsx, dashboard/[basin]/page.tsx to remove /nations links
- M5.3b: Added live USGS temperature widget to dashboard; WATERSHED_BOUNDS bounding boxes, medianTemp() helper, currentTempInfo useMemo, live station count in metric card label
- M5.4: Added geoJsonName field to Watershed; fixed 3 polygon mismatches (Cedar-Sammamish, Duwamish, Puyallup-White)
- M5.5: Updated all source attribution strings (WDFW → data.wa.gov, env charts → "Synthetic historical data")
- M5.6: Added salmonDataFetchedAt + fmtDate/fmtDateTime freshness labels; M5 COMPLETE
- Removed "Tribal partnerships" section from about page
- M7.4: Audited all pages for stale tribal claims; fixed SiteFooter, salmon-life-cycle, treaty-rights, educators, about
- M7.5: Added `metadataBase` + og/twitter defaults to app/layout.tsx; added metadata exports to app/page.tsx (absolute title), app/learn/page.tsx, app/stewardship/page.tsx, app/about/page.tsx; created app/dashboard/layout.tsx (server wrapper for 'use client' dashboard page)
- `npm run build` → ✅ 15 routes clean

### 2026-02-21 (session 6)
- M3.7 — Built `app/learn/treaty-rights/page.tsx`: full 5-section module (1855 treaties, fish-ins, Boldt Decision, co-management in practice, Culverts Case); key takeaways, educator discussion questions + activities + standards alignment, continue-learning links; `generateMetadata`
- M3.8 — Rebuilt `app/learn/educators/page.tsx`: module overview with objectives + standards, 4 classroom activity ideas, downloadable resources (placeholders for M6), contact CTA
- M3.6 polish — Added `generateMetadata` + breadcrumb to salmon-life-cycle; fixed broken `why-salmon-matter` link
- M3 milestone COMPLETE; `npm run build` → ✅ 16 routes clean

### 2026-02-21 (session 5)
- M4.5 — Rewrote `app/stewardship/page.tsx` as async server component using real `getProjects()` + `getTribes()`; resolves tribeIds to display names
- M4.2 — Created `components/stewardship/ProjectList.tsx` (client): filter pills by project type + filtered grid with working links; closes M4 ✅
- M2.8 — Added `TribeContent` interface + narrative content to `lib/data/tribes.ts` for Tulalip, Muckleshoot, Puyallup, Nisqually; added `watershedIds` field
- M2.8 — Rebuilt `app/nations/[tribe]/page.tsx`: real ContentSection content, stewardship project links, watershed basin links, `generateMetadata`, breadcrumb
- M2.9 — Updated `TribalPartnerCard` to use `displayName`, added "Content live" badge; added `metadata` to nations index
- M2 and M4 milestones now COMPLETE; `npm run build` ✅ 15 routes clean

### 2026-02-21 (session 4)
- Built `<WatershedMap>` component (`components/dashboard/WatershedMap.tsx`) using react-leaflet v5
- Added `status: WatershedStatus` field to `Watershed` interface and all 9 mock watersheds in `lib/data/watersheds.ts`
- Added `@import "leaflet/dist/leaflet.css"` to `app/globals.css`
- Wired map into `app/dashboard/page.tsx` via `next/dynamic({ ssr: false })` — map + dropdown stay in sync via shared state
- Map features: GeoJSON polygon layer from `/public/data/puget-sound-watersheds.geojson`, click-to-select, hover highlight, status colour legend, selected-watershed label, "Show all ×" reset button
- `npm run lint` ✅ `npm run build` ✅ (all 15 routes)

### 2026-02-21 (session 3)
- Created `eslint.config.mjs` (ESLint 9 flat config with `next/core-web-vitals` + `next/typescript`)
- Fixed `app/learn/[module]/page.tsx`: removed invalid `subtitle` field from `Props` interface; added full metadata
- Fixed all remaining `subtitle=` → `description=` on `PageHeader` in educators and stewardship pages
- Fixed `SalmonMetricCard.tsx`: removed duplicate inline `InfoTooltip` stub, fixed prop `text` → `content`
- Fixed unescaped entities (`&apos;`, `&quot;`) across about, salmon-life-cycle, nations, tribe pages
- Replaced bare `<a>` tags with Next.js `<Link>` in dashboard/[basin], nations/[tribe]
- Removed unused `PageHeader` import from `nations/[tribe]/page.tsx`
- `npm run lint` → ✅ zero warnings/errors; `npm run build` → ✅ all 15 routes clean

### 2026-02-21 (session 3)
- M4.4 — Built `app/stewardship/[project]/page.tsx` as a proper server component
- Fetches project by slug (from `lib/data/projects.ts`), watershed by slug, and all tribes
- Renders: breadcrumb, header + active/completed badge, type + watershed meta pills, tribal attribution banner, project overview (with M6 CMS placeholder), impact metric cards, watershed dashboard link, linked tribal partner cards, footer nav
- Handles tribeIds that don't match mock tribes data (formats slug → display name fallback)
- `npm run build` → ✅ 15 routes compile cleanly

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

### 2026-02-21 (session 4)
- M5.3a: Fixed USGS `/api/usgs` 400 error — root cause: NWIS rejects `stateCd` + `bBox` together ("only one major filter"). Removed `stateCd=WA`; `bBox` alone returns 49 real stations with current temps
- Build: `/api/usgs` now statically generates with 15-min ISR (was `ƒ Dynamic` due to build-time error, now `○ Static`)

### 2026-02-21 (session 3)
- M5.2b: Created `scripts/fetch-wdfw.mjs` — paginated Socrata fetch of `fgyz-n3uk`, 44-entry population→watershed map, data-type priority (TSAEJ→Spawner Fish→NOSAEJ→Escapement Fish), outputs `lib/data/real/salmon-returns.json`
- Ran `npm run data:refresh`: fetched 7,664 rows → parsed to 391 real SalmonReturn records across 9 watersheds + 6 species (106.5 KB)
- Added `"data:refresh": "node scripts/fetch-wdfw.mjs"` to `package.json` scripts
- M5.2c: Rewrote `lib/data/salmon-returns.ts` to load from real JSON via `require()` (static, works with webpack); removed synthetic mock generator; exports `salmonDataFetchedAt` for M5.6 freshness UI
- Key fix: `node:fs`/`node:path` imports break webpack — use static `require()` for JSON in Next.js instead
- `npm run build` → ✅ 16 routes clean

### 2026-02-20
- Created `app.js`: Express server on port 3010 (user changed from 3000), static serving + 4 proxy routes (`/api/wdfw`, `/api/usgs`, `/api/barriers`, `/api/scrape`) with 15-min in-memory cache
- Added `"type": "module"` to `package.json` for ES module support
- Rewrote `CLAUDE.md` to reflect Express backend, new dev command (`npx nodemon app.js`), updated architecture and API route table
- Added `node_modules/` to `.gitignore`
- Established session workflow: read CLAUDE.md + PLANNING.md + TASKS.md each session, pick next task, log summary here before stopping
