# TASKS.md — Puget Salmon Health Dashboard

> Milestones, sprints, and task tracking.
> Update this file as tasks are completed or plans change.

---

## Milestone Overview

```
M0: Project Setup & Foundation          ██████████  COMPLETE
M1: Dashboard MVP (mock data)           ██████░░░░  ~60% (in progress)
M2: Nations Template System             ███████░░░  ~70% (mostly complete)
M3: Learn & Education Hub               ██░░░░░░░░  ~20% (started)
M4: Stewardship & About Pages           █████░░░░░  ~50% (index pages done)
M5: Data Integration (real APIs)        ░░░░░░░░░░  ~0% (not started)
M6: CMS & Partner Editing Workflow      ░░░░░░░░░░  ~0% (not started)
M7: Polish, Accessibility Audit, Launch ░░░░░░░░░░  ~0% (not started)
```

---

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
- [ ] **M1.2 — Build `<IndicatorChart>` component** 🚧 NEXT
  - Install Recharts
  - Create time-series line/area chart component
  - Add responsive behavior
  - Add accessibility text summaries
- [x] **M1.3 — Build `<WatershedSelector>` component**
- [x] **M1.4 — Build `<SpeciesFilter>` component**
- [x] **M1.5 — Assemble Dashboard page (`/dashboard`)**
- [ ] **M1.6 — Build basin detail page (`/dashboard/[basin]`)**
- [ ] **M1.7 — Dashboard polish**

**M1 Definition of Done:** A visitor can go to `/dashboard`, select a watershed, filter by species, and see charts with mocked data and plain-language explanations. All charts have accessible alternatives.

---

## M2: Nations Template System 🚧 IN PROGRESS (~70%)

> **Goal:** The Nations index and individual tribe pages are functional with a scalable, content-governed template.

### Tasks

- [x] **M2.1 — Build `<AttributionBanner>` component**
- [x] **M2.2 — Build `<TribalPartnerCard>` component**
- [x] **M2.3 — Build `<ContentSection>` component**
- [ ] **M2.4 — Build `<MediaGallery>` component**
- [x] **M2.5 — Build `<MiniDashboard>` component** (basic version using SalmonMetricCard)
- [x] **M2.6 — Assemble Nations index page (`/nations`)**
- [x] **M2.7 — Assemble individual Nation page template (`/nations/[tribe-slug]`)**
- [ ] **M2.8 — Create 2-3 sample tribe page MDX files**
- [ ] **M2.9 — Nations polish**

**M2 Definition of Done:** The Nations index shows 9+ partner cards. Clicking any card leads to a full tribe page template with clearly marked placeholders, governance attribution, and linked dashboard data.

---

## M3: Learn & Education Hub 🚧 STARTED (~20%)

> **Goal:** The Learn hub and at least 2 learning modules are functional.

### Tasks

- [x] **M3.1 — Build `<LearningModuleCard>` component** (using Card)
- [ ] **M3.2 — Build `<AudienceToggle>` component**
- [ ] **M3.3 — Build `<KeyTakeaways>` component** (basic version done in module)
- [ ] **M3.4 — Build `<EducatorResources>` component**
- [x] **M3.5 — Assemble Learn index page (`/learn`)**
- [x] **M3.6 — Create Module: "Salmon Life Cycle" (`/learn/salmon-life-cycle`)** ✅
- [ ] **M3.7 — Create Module: "Treaty Rights & Co-Management" (`/learn/treaty-rights`)**
- [ ] **M3.8 — Create Educators page (`/learn/educators`)**

**M3 Definition of Done:** A teacher can visit `/learn`, see module options, read through at least 2 complete modules, and find downloadable lesson ideas.

---

## M4: Stewardship & About Pages 🚧 IN PROGRESS (~50%)

> **Goal:** Stewardship index/detail and About page are functional.

### Tasks

- [x] **M4.1 — Build `<ProjectCard>` component** (using Card)
- [ ] **M4.2 — Build `<ProjectFilterBar>` component**
- [x] **M4.3 — Assemble Stewardship index (`/stewardship`)**
- [ ] **M4.4 — Assemble Stewardship detail template (`/stewardship/[project-slug]`)**
- [ ] **M4.5 — Create 3-4 sample project pages**
- [x] **M4.6 — Assemble About page (`/about`)** ✅

**M4 Definition of Done:** All pages in the sitemap are functional with mock/placeholder content. The full site is navigable end-to-end.

---

## M5: Data Integration (Real APIs) 🗓️ PLANNED

> **Goal:** Replace mock data with real data sources where available.

### Tasks

- [ ] **M5.1 — Set up PostgreSQL + Prisma**
- [ ] **M5.2 — Build WDFW/StreamNet salmon returns adapter**
- [ ] **M5.3 — Build USGS water data adapter**
- [ ] **M5.4 — Build watershed GeoJSON pipeline**
- [ ] **M5.5 — Swap adapters from mock → real**
- [ ] **M5.6 — Add data freshness indicators**

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

- [ ] **M7.1 — Full accessibility audit**
- [ ] **M7.2 — Performance optimization**
- [ ] **M7.3 — Responsive design review**
- [ ] **M7.4 — Content review**
- [ ] **M7.5 — SEO setup**
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
