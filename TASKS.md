# TASKS.md — Puget Salmon Health Dashboard

> Milestones, sprints, and task tracking.
> Update this file as tasks are completed or plans change.

---

## Milestone Overview

```
M0: Project Setup & Foundation          ██████████  COMPLETE ✅
M1: Dashboard MVP                       ██████████  COMPLETE ✅
M2: Nations Template System             ██████████  REMOVED (no real partnerships)
M3: Learn & Education Hub               ██████████  COMPLETE ✅
M4: Stewardship & About Pages           ██████████  COMPLETE ✅
M5: Data Integration (real APIs)        ██████████  COMPLETE ✅
M6: CMS & Partner Editing Workflow      ░░░░░░░░░░  NEEDS REPLAN
M7: Polish, Accessibility Audit, Launch ████████░░  ~80% complete
```

---

## M0: Project Setup & Foundation ✅ COMPLETE

- [x] M0.1 — Initialize Next.js project
- [x] M0.2 — Set up design tokens
- [x] M0.3 — Build layout shell
- [x] M0.4 — Create shared UI components (first pass)
- [x] M0.5 — Create mock data files
- [x] M0.6 — Build data adapters (mock phase)
- [x] M0.7 — Stub all pages

---

## M1: Dashboard MVP ✅ COMPLETE

- [x] M1.1 — Build `<SalmonMetricCard>` component
- [x] M1.2 — Build `<IndicatorChart>` component (Recharts area/line, accessible data table)
- [x] M1.3 — Build `<WatershedSelector>` component
- [x] M1.4 — Build `<SpeciesFilter>` component
- [x] M1.5 — Assemble Dashboard page (`/dashboard`)
- [x] M1.6 — Build basin detail page (`/dashboard/[basin]`)
- [x] M1.7 — Dashboard polish
- [x] M1.8 — Build `<WatershedMap>` component (Leaflet, GeoJSON polygons, click-to-select)

---

## M2: Nations Template System — REMOVED

All `/nations` pages, `components/nations/`, and `lib/data/tribes.ts` deleted.
No real tribal partnerships exist — removing fabricated content was the correct call.
Stewardship projects page (`/stewardship`) covers restoration initiatives instead.

---

## M3: Learn & Education Hub ✅ COMPLETE

- [x] M3.1 — Build `<LearningModuleCard>` component
- [-] M3.2 — `<AudienceToggle>` (deferred)
- [-] M3.3 — `<KeyTakeaways>` (inline; abstraction deferred)
- [-] M3.4 — `<EducatorResources>` (inline; abstraction deferred)
- [x] M3.5 — Assemble Learn index page (`/learn`)
- [x] M3.6 — Module: "Salmon Life Cycle" (`/learn/salmon-life-cycle`)
- [x] M3.7 — Module: "Treaty Rights & Co-Management" (`/learn/treaty-rights`)
- [x] M3.8 — Educators page (`/learn/educators`) — updated to list all 4 modules
- [x] M3.9 — Module: "Why Salmon Matter" (`/learn/why-salmon-matter`)
- [x] M3.10 — Module: "Reading the Dashboard" (`/learn/reading-the-dashboard`)

---

## M4: Stewardship & About Pages ✅ COMPLETE

- [x] M4.1 — Build `<ProjectCard>` component
- [x] M4.2 — Build `<ProjectFilterBar>` (client-side filter pills in ProjectList.tsx)
- [x] M4.3 — Assemble Stewardship index (`/stewardship`)
- [x] M4.4 — Assemble Stewardship detail template (`/stewardship/[project-slug]`)
- [x] M4.5 — Wire to real `getProjects()` data with working links
- [x] M4.6 — Assemble About page (`/about`)

---

## M5: Data Integration (Real APIs) ✅ COMPLETE

> Architecture: build-time seed JSON — `npm run data:refresh` → `lib/data/real/salmon-returns.json`
> No PostgreSQL needed. DB deferred to M6.

- [-] M5.1 — PostgreSQL + Prisma (deferred to M6)
- [x] M5.2a — Explore WDFW API schema, document field mapping (`docs/wdfw-schema.md`)
- [x] M5.2b — Write `scripts/fetch-wdfw.mjs` seed script (391 real records, 9 watersheds)
- [x] M5.2c — Update `getSalmonReturns()` to read real JSON; exports `salmonDataFetchedAt`
- [x] M5.3a — Fix USGS `/api/usgs` 400 error; 49 stations return real temps
- [x] M5.3b — Add current-temperature widget to dashboard
- [x] M5.4 — Verify GeoJSON name matching; added `geoJsonName` field to 3 watersheds
- [x] M5.5 — Remove mock data labels; update source attributions
- [x] M5.6 — Add data freshness indicators ("Refreshed Feb 21, 2026") to dashboard

---

## M6: CMS for Stewardship Projects 🚧 PARTIALLY COMPLETE

> Original scope (tribal partner CMS with content governance) is obsolete.
> New scope: lightweight way to add/edit stewardship project content without code changes.
> Projects list partner organizations (tribal nations, NGOs, agencies) as plain text strings.

- [ ] M6.1 — Decide on CMS approach (current: `lib/data/projects.ts`; upgrade if non-dev editors needed)
- [x] M6.2 — Refactored `Project` type: `tribeIds` → `partnerOrgs: string[]`; added `yearStarted: number`
- [x] M6.3 — Added 9 real, publicly documented Puget Sound stewardship projects
- [x] M6.4 — Updated all stewardship pages + `ProjectList` to render `partnerOrgs` (no governance banner)
- [ ] M6.5 — Write a short guide for adding new projects
- [x] M6.6 — Contact form: `/api/contact` (Resend), `<ContactForm>` component, about page integration

---

## M7: Polish, Accessibility Audit, Launch 🚧 ~80% COMPLETE

> **Goal:** Site is production-ready with verified accessibility, performance, and content.

- [x] **M7.1 — Full accessibility audit** ✅
  - WCAG 2.1 AA fixes: emoji aria-hidden, heading levels, table scope, aria-pressed on toggles,
    focus rings, InfoTooltip aria-describedby, IndicatorChart data table, aria-live for chart updates,
    descriptive aria-labels on ambiguous links
- [x] **M7.2 — Performance optimization** ✅
  - Eliminated build-time ISR cache failures (were 11–20MB Socrata responses)
  - `/api/wdfw` now serves pre-seeded 107KB local JSON
  - `/api/scrape` uses Socrata `/resource/` endpoint with SoQL filters (under 2MB)
  - GeoJSON cache headers (immutable, 1yr), gzip compression, `poweredByHeader: false`
  - Leaflet CSS scoped to dashboard layout only (saves ~30KB on all other pages)
  - Font: `display: swap` + `adjustFontFallback` to reduce CLS
- [x] **M7.3 — Responsive design review** ✅
  - Hamburger tap target 44×44px, map height responsive, hero heading scales,
    basin page flex-wrap, about table padding, chart axis font
- [x] **M7.4 — Content review** ✅
  - Removed all stale tribal-partnership claims site-wide
- [x] **M7.5 — SEO setup** ✅
  - metadataBase, title template, OG/Twitter tags on all pages
  - dashboard/layout.tsx wrapper for 'use client' dashboard metadata
- [x] **M7.6 — Deployment** ✅ — Live on Vercel (auto-deploy from main)
- [x] **M7.7 — Documentation** ✅ — README fully rewritten; PLANNING.md updated

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

## Current Sprint Status (Updated: Feb 22, 2026)

### Just Completed This Session

- ✅ Removed all Nations/tribal pages (fabricated partnerships)
- ✅ M5 Data Integration fully complete
- ✅ M7.1 Accessibility audit (WCAG 2.1 AA fixes across 9 files)
- ✅ M7.2 Performance optimization (API cache failures eliminated, Leaflet CSS scoped)
- ✅ M7.3 Responsive design review
- ✅ M7.4 Content review
- ✅ M7.5 SEO (metadata, OG, Twitter on all pages)

### Next Priorities

1. **Contact form activation** — Add `RESEND_API_KEY` + `CONTACT_EMAIL` to Vercel environment variables (Settings → Environment Variables), then redeploy
2. **M6.1** — Decide on CMS approach for stewardship projects (plain TS file is fine until a non-dev needs to edit)
3. **M6.5** — Write a short guide for adding new stewardship projects

### Blockers

None. Build is clean. Site is deployable.
