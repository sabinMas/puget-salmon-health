# TASKS.md — Puget Salmon Health Dashboard

> Milestones, sprints, and task tracking.
> Update this file as tasks are completed or plans change.

---

## Milestone Overview

```
M0: Project Setup & Foundation          ██████████  COMPLETE
M1: Dashboard MVP (mock data)           ██████████  COMPLETE ✅
M2: Nations Template System             ██████████  REMOVED (no real partnerships)
M3: Learn & Education Hub               ██████████  COMPLETE ✅
M4: Stewardship & About Pages           ██████████  COMPLETE ✅
M5: Data Integration (real APIs)        ██████████  COMPLETE ✅
M6: CMS & Partner Editing Workflow      ░░░░░░░░░░  NEEDS REPLAN (Nations removed)
M7: Polish, Accessibility Audit, Launch ░░░░░░░░░░  ~0% (not started)
```

---



## Task: Fix dynamic Learn module page for Next.js 15 ✅ COMPLETE

- Removed invalid `subtitle` prop from `Props` interface in `app/learn/[module]/page.tsx`
- Created `eslint.config.mjs` (flat config for ESLint 9 + Next.js 15)
- Fixed all lint errors site-wide: unescaped entities (`&apos;`/`&quot;`), `<a>` → `<Link>`, unused imports
- Fixed `subtitle` → `description` in educators and stewardship pages
- Removed duplicate inline `InfoTooltip` stub from `SalmonMetricCard.tsx`; fixed prop `text` → `content`
- `npm run lint` → ✅ no warnings or errors
- `npm run build` → ✅ all 15 routes compile cleanly


## M0: Project Setup & Foundation ✅ COMPLETE

> **Goal:** Repo is scaffolded, dev environment works, shared components exist, mock data is in place, and the site shell (nav + footer + routing) is functional.

### Tasks

- [x] **M0.1 — Initialize Next.js project**
- [x] **M0.2 — Set up design tokens**
- [x] **M0.3 — Build layout shell**
- [x] **M0.4 — Create shared UI components (first pass)**
- [x] **M0.5 — Create mock data files**
- [x] **M0.6 — Build data adapters (mock phase)**
- [x] **M0.7 — Stub all pages**

**M0 Definition of Done:** ✅ You can run `npm run dev`, see the site shell with working navigation, click through to every stubbed page, and the mock data adapters return data when called.

---

## M1: Dashboard MVP (Mock Data) 🚧 IN PROGRESS (~60%)

> **Goal:** The Dashboard page and basin detail pages are functional with mocked data, charts, and filters.

### Tasks

- [x] **M1.1 — Build `<SalmonMetricCard>` component**
- [x] **M1.2 — Build `<IndicatorChart>` component** ✅
- [x] **M1.3 — Build `<WatershedSelector>` component**
- [x] **M1.4 — Build `<SpeciesFilter>` component**
- [x] **M1.5 — Assemble Dashboard page (`/dashboard`)**
- [x] **M1.6 — Build basin detail page (`/dashboard/[basin]`)** ✅
- [x] **M1.7 — Dashboard polish** ✅
- [x] **M1.8 — Build `<WatershedMap>` component** ✅
  - See detailed plan below

**M1 Definition of Done:** A visitor can go to `/dashboard`, select a watershed, filter by species, and see charts with mocked data and plain-language explanations. All charts have accessible alternatives.

---

## M1.8 — WatershedMap: Detailed Implementation Plan

> **Goal:** Replace the plain watershed dropdown with a clickable Leaflet map of Puget Sound, where each watershed polygon is selectable. The dropdown remains as an accessible fallback. Map and dropdown stay in sync.

### Why this matters
The map is the visual centrepiece of the dashboard. It grounds every number in geography and makes "which watershed?" intuitive — especially for users who don't know watershed names by heart.

### What the finished component does
- Renders an interactive Leaflet map centred on Puget Sound (~47.6°N, 122.3°W, zoom 9)
- Draws each watershed as a coloured polygon from the GeoJSON file already in `/public/data/puget-sound-watersheds.geojson`
- **Hover:** polygon highlights + tooltip shows watershed name
- **Click:** selects that watershed → updates the same state used by the dropdown (they stay in sync)
- **Colour coding:** polygons coloured by mock salmon health status (green / amber / red) using the same colour scale from PLANNING.md
- **"All Puget Sound" reset:** clicking the map background or an "All" button deselects
- **Accessibility:** the existing `<WatershedSelector>` dropdown is kept alongside the map — keyboard users never lose functionality

### Files to create / modify

| Action | File | What changes |
|--------|------|-------------|
| **Create** | `components/dashboard/WatershedMap.tsx` | The Leaflet map — `'use client'`, imports `leaflet/dist/leaflet.css`, renders `MapContainer` + `TileLayer` + `GeoJSON` |
| **Modify** | `app/dashboard/page.tsx` | `next/dynamic` import of `WatershedMap` (ssr: false); add map section between PageHeader and filter bar |
| **Modify** | `lib/data/watersheds.ts` | Add `status` field (`'healthy' \| 'caution' \| 'concern'`) to mock data for colour coding |

### Technical decisions

**SSR:** Leaflet uses `window`, so the component must be loaded with:
```ts
const WatershedMap = dynamic(
  () => import('@/components/dashboard/WatershedMap'),
  { ssr: false, loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" /> }
);
```

**Tile layer:** OpenStreetMap (no API key needed for development):
```
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

**GeoJSON → watershed slug matching:** The GeoJSON `properties.name` (e.g. `"Skagit River"`) maps to `lib/data/watersheds.ts` `name` field. On polygon click, look up the watershed by name → get its slug → call `onChange(slug)`.

**Colour scale (matches PLANNING.md health scale):**
```
healthy  → #22c55e (green)
caution  → #ca8a04 (amber)
concern  → #dc2626 (red)
```
Mock status assigned per watershed in `lib/data/watersheds.ts` for now; swapped for real data in M5.

**WatershedMap props:**
```ts
interface WatershedMapProps {
  watersheds: Watershed[];   // from lib/data/watersheds.ts (includes status)
  selected: string;          // slug or 'all'
  onChange: (slug: string) => void;
}
```

**Dashboard layout after M1.8:**
```
PageHeader
├── WatershedMap (full-width, ~350px tall, click to select)
├── Filter Bar (WatershedSelector dropdown + SpeciesFilter — stays as accessible alt)
├── At-a-Glance Metric Cards
├── Primary Chart (placeholder → Recharts in M1.2)
├── Environmental Indicators
└── Data Sources
```

### Acceptance criteria
- [ ] Map renders on `/dashboard` without SSR errors
- [ ] Clicking any watershed polygon updates the page filter (same state as dropdown)
- [ ] Selecting a watershed via dropdown highlights the correct polygon on the map
- [ ] Polygons are coloured by mock health status
- [ ] Hovering a polygon shows the watershed name
- [ ] Clicking map background resets to "All Puget Sound"
- [ ] Map has `aria-label` and the dropdown is still present for keyboard users
- [ ] `npm run build` passes clean

---

## M2: Nations Template System ✅ COMPLETE

> **Goal:** The Nations index and individual tribe pages are functional with a scalable, content-governed template.

### Tasks

- [x] **M2.1 — Build `<AttributionBanner>` component**
- [x] **M2.2 — Build `<TribalPartnerCard>` component**
- [x] **M2.3 — Build `<ContentSection>` component**
- [-] **M2.4 — Build `<MediaGallery>` component** (deferred — no media assets yet; placeholder sufficient)
- [x] **M2.5 — Build `<MiniDashboard>` component** (basic version using SalmonMetricCard)
- [x] **M2.6 — Assemble Nations index page (`/nations`)**
- [x] **M2.7 — Assemble individual Nation page template (`/nations/[tribe-slug]`)**
- [x] **M2.8 — Create 2-3 sample tribe pages** ✅ (Tulalip, Muckleshoot, Puyallup, Nisqually — real content + watershed/project links)
- [x] **M2.9 — Nations polish** ✅ (TribalPartnerCard uses displayName, content-live badge, generateMetadata on index)

**M2 Definition of Done:** ✅ The Nations index shows 9+ partner cards. Clicking any card leads to a full tribe page template with clearly marked placeholders, governance attribution, and linked dashboard data.

---

## M3: Learn & Education Hub ✅ COMPLETE

> **Goal:** The Learn hub and at least 2 learning modules are functional.

### Tasks

- [x] **M3.1 — Build `<LearningModuleCard>` component** (using Card)
- [-] **M3.2 — Build `<AudienceToggle>` component** (deferred — not needed for DoD; add in polish pass)
- [-] **M3.3 — Build `<KeyTakeaways>` component** (inline in each module; abstraction not needed yet)
- [-] **M3.4 — Build `<EducatorResources>` component** (educators page uses inline data arrays; abstraction deferred)
- [x] **M3.5 — Assemble Learn index page (`/learn`)**
- [x] **M3.6 — Create Module: "Salmon Life Cycle" (`/learn/salmon-life-cycle`)** ✅
- [x] **M3.7 — Create Module: "Treaty Rights & Co-Management" (`/learn/treaty-rights`)** ✅
- [x] **M3.8 — Create Educators page (`/learn/educators`)** ✅

**M3 Definition of Done:** ✅ A teacher can visit `/learn`, see module options, read through at least 2 complete modules, and find downloadable lesson ideas.

---

## M4: Stewardship & About Pages ✅ COMPLETE

> **Goal:** Stewardship index/detail and About page are functional.

### Tasks

- [x] **M4.1 — Build `<ProjectCard>` component** (using Card)
- [x] **M4.2 — Build `<ProjectFilterBar>` component** ✅ (client-side filter pills in ProjectList.tsx)
- [x] **M4.3 — Assemble Stewardship index (`/stewardship`)**
- [x] **M4.4 — Assemble Stewardship detail template (`/stewardship/[project-slug]`)** ✅
- [x] **M4.5 — Create 3-4 sample project pages** ✅ (stewardship index wired to real getProjects() data with working links)
- [x] **M4.6 — Assemble About page (`/about`)** ✅

**M4 Definition of Done:** ✅ All pages in the sitemap are functional with mock/placeholder content. The full site is navigable end-to-end.

---

## M5: Data Integration (Real APIs) 🚧 IN PROGRESS

> **Goal:** Replace mock data with real data sources where available.

### Architecture Decision (from M5.2a exploration)
No PostgreSQL needed for M5. Use a **build-time seed JSON** approach:
- `scripts/fetch-wdfw.ts` fetches → parses → writes `lib/data/real/salmon-returns.json`
- `getSalmonReturns()` reads from the JSON file (works with ISR, no DB needed)
- Database (Prisma) deferred to M6 when CMS content storage is needed

### Key dataset: `fgyz-n3uk` (WDFW Escapement/SPI)
- Schema documented in `docs/wdfw-schema.md`
- Population Name → watershed slug mapping: complete (all 9 watersheds)
- Species mapping: Chinook/Coho/Chum/Pink/Sockeye/Steelhead → speciesId '1'–'6'
- Data type to use: TSAEJ → Spawner Fish → NOSAEJ (priority order)
- Year coverage: reliable 2010–2023; 2024 partial

### Tasks

- [-] **M5.1 — Set up PostgreSQL + Prisma** (deferred to M6 — not needed for M5 DoD)
- [x] **M5.2a — Explore WDFW API schema, document field mapping** ✅ (`docs/wdfw-schema.md`)
- [x] **M5.2b — Write `scripts/fetch-wdfw.mjs` seed script** ✅ (`npm run data:refresh` → writes `lib/data/real/salmon-returns.json`, 391 real records)
- [x] **M5.2c — Update `getSalmonReturns()` to read real JSON** ✅ (static `require()` import; exports `salmonDataFetchedAt` for M5.6)
- [x] **M5.3a — Fix USGS `/api/usgs` 400 error; get current temp per watershed** ✅ (removed `stateCd=WA` — can't combine with `bBox`; 49 stations now return real temps)
- [x] **M5.3b — Add current-temperature widget to dashboard (separate from historical charts)** ✅
- [x] **M5.4 — Verify GeoJSON `properties.name` values match watershed data** ✅
- [x] **M5.5 — Remove mock data labels; update source attributions** ✅
- [x] **M5.6 — Add data freshness indicators ("Last updated: X") to dashboard** ✅

**M5 Definition of Done:** Dashboard shows real salmon return and environmental data for at least 3 watersheds.

---

## M6: CMS & Partner Editing Workflow 🗓️ PLANNED

> **Goal:** Tribal partners (or their liaisons) can create and edit content without code changes.

### Tasks

- [ ] **M6.1 — Evaluate and select headless CMS**
- [ ] **M6.2 — Set up CMS with tribal content schema**
- [ ] **M6.3 — Migrate MDX content to CMS**
- [ ] **M6.4 — Update Next.js to fetch from CMS**
- [ ] **M6.5 — Create partner onboarding guide**

---

## M7: Polish, Accessibility Audit, Launch 🗓️ PLANNED

> **Goal:** Site is production-ready with verified accessibility, performance, and content.

### Tasks

- [x] **M7.1 — Full accessibility audit** ✅
- [ ] **M7.2 — Performance optimization**
- [x] **M7.3 — Responsive design review** ✅
- [x] **M7.4 — Content review** ✅
- [x] **M7.5 — SEO setup** ✅
- [ ] **M7.6 — Deployment**
- [ ] **M7.7 — Documentation**

---

## Task Status Legend

```
- [ ] Not started
- [~] In progress
- [x] Complete
- [!] Blocked (note blocker)
- [-] Deferred / descoped
```

---

## Current Sprint Status (Updated: Feb 21, 2026)

### Just Completed

✅ **Next.js Prototype MVP built:**
- Home page with hero, two-pillar design, at-a-glance metrics
- Dashboard page with filters and metric cards (chart component next)
- Nations index with 9 tribal partners and partnership statement
- Individual Nation page template with attribution and placeholders
- Learn index with 4 module cards
- Sample Learn module (Salmon Life Cycle) with full content
- Stewardship index with project cards
- About page with mission, data sources, accessibility statement
- Updated README with full project documentation

### Next Priorities

1. **M1.2:** Build `<IndicatorChart>` component with Recharts
2. **M1.6:** Basin detail pages (`/dashboard/[basin]`)
3. **M2.4:** `<MediaGallery>` component for tribal content
4. **M3.7:** Second Learn module (Treaty Rights)
5. **M4.4:** Stewardship project detail page template

### Blockers

None currently. Ready to continue building!
