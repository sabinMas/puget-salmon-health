# TASKS.md — Puget Salmon Health Dashboard

> Milestones, sprints, and task tracking.
> Update this file as tasks are completed or plans change.

---

## Milestone Overview

```
M0: Project Setup & Foundation          ██░░░░░░░░  ~1 week
M1: Dashboard MVP (mock data)           ░░░░░░░░░░  ~2-3 weeks
M2: Nations Template System             ░░░░░░░░░░  ~2-3 weeks
M3: Learn & Education Hub               ░░░░░░░░░░  ~2 weeks
M4: Stewardship & About Pages           ░░░░░░░░░░  ~1-2 weeks
M5: Data Integration (real APIs)        ░░░░░░░░░░  ~3-4 weeks
M6: CMS & Partner Editing Workflow      ░░░░░░░░░░  ~TBD
M7: Polish, Accessibility Audit, Launch ░░░░░░░░░░  ~2 weeks
```

---

## M0: Project Setup & Foundation

> **Goal:** Repo is scaffolded, dev environment works, shared components exist, mock data is in place, and the site shell (nav + footer + routing) is functional.

### Tasks

- [ ] **M0.1 — Initialize Next.js project**
  - `npx create-next-app@latest` with TypeScript, Tailwind, App Router, ESLint
  - Set up project structure per CLAUDE.md
  - Configure Prettier, ESLint rules
  - Verify dev server runs

- [ ] **M0.2 — Set up design tokens**
  - Configure Tailwind `tailwind.config.ts` with custom colors, fonts, spacing from PLANNING.md
  - Create `globals.css` with Tailwind directives and any CSS custom properties
  - Install and configure fonts (Source Sans Pro or chosen typeface)

- [ ] **M0.3 — Build layout shell**
  - `<SiteHeader>` with responsive navigation (5 primary nav items)
  - `<SiteFooter>` with attribution, links, land acknowledgment placeholder
  - `<SkipToContent>` accessibility link
  - Root layout (`src/app/layout.tsx`) composing header + main + footer
  - Verify navigation works for all top-level routes (even if pages are stubs)

- [ ] **M0.4 — Create shared UI components (first pass)**
  - `<Card>` — base card with variants
  - `<PageHeader>` — title + subtitle + optional breadcrumbs
  - `<InfoTooltip>` — accessible tooltip/popover
  - `<StatusBadge>` — healthy/caution/concern
  - `<Placeholder>` — clearly marked placeholder block

- [ ] **M0.5 — Create mock data files**
  - `/public/data/watersheds.json` — list of Puget Sound watersheds (name, slug, region, approximate center coordinates)
  - `/public/data/species.json` — salmon species list
  - `/public/data/salmon-returns.json` — mocked annual return data (5-10 years × 3-5 watersheds × 3-4 species)
  - `/public/data/env-indicators.json` — mocked environmental readings
  - `/public/data/tribes.json` — list of tribal partners (name, slug, placeholder info)
  - `/public/data/projects.json` — mocked stewardship projects

- [ ] **M0.6 — Build data adapters (mock phase)**
  - `src/lib/data/watersheds.ts` — `getWatersheds()`, `getWatershedBySlug()`
  - `src/lib/data/species.ts` — `getSpecies()`
  - `src/lib/data/salmon-returns.ts` — `getSalmonReturns(basin?, species?, yearRange?)`
  - `src/lib/data/env-indicators.ts` — `getIndicators(basin?, type?)`
  - `src/lib/data/tribes.ts` — `getTribes()`, `getTribeBySlug()`
  - `src/lib/data/projects.ts` — `getProjects(tribe?, type?, basin?)`
  - All adapters return typed interfaces, read from `/public/data/` JSON

- [ ] **M0.7 — Stub all pages**
  - Create route files for every page in the sitemap with minimal content
  - Each stub shows its `<PageHeader>` and a "Coming soon" `<Placeholder>`
  - Verify all routes resolve correctly

**M0 Definition of Done:** You can run `npm run dev`, see the site shell with working navigation, click through to every stubbed page, and the mock data adapters return data when called.

---

## M1: Dashboard MVP (Mock Data)

> **Goal:** The Dashboard page and basin detail pages are functional with mocked data, charts, and filters.

### Tasks

- [ ] **M1.1 — Build `<SalmonMetricCard>` component**
  - Shows label, value, unit, trend arrow (↑↓→), optional tooltip
  - Accessible: screen reader announces trend direction
  - Links to relevant detail view

- [ ] **M1.2 — Build `<IndicatorChart>` component**
  - Accepts time-series data array, renders line/area chart (Recharts)
  - Configurable: title, axis labels, source footnote
  - Responsive (resizes with container)
  - Text-based data summary for accessibility
  - "What does this mean?" interpretation text below chart

- [ ] **M1.3 — Build `<WatershedSelector>` component**
  - Dropdown listing all watersheds from mock data
  - "All Puget Sound" as default option
  - `onChange` callback updates parent page state
  - Keyboard accessible

- [ ] **M1.4 — Build `<SpeciesFilter>` component**
  - Horizontal row of pill/chip buttons (All, Chinook, Coho, etc.)
  - Toggle selection, supports "All" default
  - Keyboard accessible with focus ring

- [ ] **M1.5 — Assemble Dashboard page (`/dashboard`)**
  - Compose: PageHeader → Filter Bar (WatershedSelector + SpeciesFilter) → MetricCards row → Primary IndicatorChart (salmon returns) → Environmental Indicators grid → Context section → Data sources collapsible
  - Filters update all data views reactively
  - Plain-language interpretations below each chart

- [ ] **M1.6 — Build basin detail page (`/dashboard/[basin]`)**
  - Dynamic route, loads data for specific basin
  - Same layout as main dashboard but pre-filtered
  - Additional basin-specific context section
  - Breadcrumb: Dashboard > [Basin Name]

- [ ] **M1.7 — Dashboard polish**
  - Loading states for charts
  - Empty states ("No data available for this selection")
  - Responsive layout testing (mobile, tablet, desktop)
  - Color contrast verification for all chart elements

**M1 Definition of Done:** A visitor can go to `/dashboard`, select a watershed, filter by species, and see charts with mocked data and plain-language explanations. All charts have accessible alternatives.

---

## M2: Nations Template System

> **Goal:** The Nations index and individual tribe pages are functional with a scalable, content-governed template.

### Tasks

- [ ] **M2.1 — Build `<AttributionBanner>` component**
  - Displays tribe name, review date, governance statement
  - Visually distinct (e.g., bordered, lightly shaded)
  - Present on every tribal content page/section

- [ ] **M2.2 — Build `<TribalPartnerCard>` component**
  - Card for the Nations index grid
  - Shows: name, image (or placeholder), tagline, link
  - Consistent sizing, accessible image alt text

- [ ] **M2.3 — Build `<ContentSection>` component**
  - Flexible block: title, MDX body, optional media sidebar
  - Handles cases where content is not yet provided (shows `<Placeholder>`)
  - `sectionType` prop to style differently if needed

- [ ] **M2.4 — Build `<MediaGallery>` component**
  - Grid layout for images, video embeds, audio players
  - Each item: media, caption, credit line (tribe attribution)
  - Lightbox or modal view for images
  - Accessible: captions serve as alt text, video has captions note

- [ ] **M2.5 — Build `<MiniDashboard>` component**
  - Compact view: 2-3 metric cards + small sparkline chart
  - Pulls data via same adapters as main dashboard
  - Used on tribe pages to show "Salmon in [Tribe]'s waters"

- [ ] **M2.6 — Assemble Nations index page (`/nations`)**
  - PageHeader with partnership introduction
  - Partnership governance statement block
  - Grid of TribalPartnerCards from mock data
  - Contact/partnership CTA

- [ ] **M2.7 — Assemble individual Nation page template (`/nations/[tribe-slug]`)**
  - Dynamic route, loads tribe data by slug
  - Full page layout per PLANNING.md §4.4
  - All sections use `<ContentSection>` with placeholders
  - `<AttributionBanner>` at top
  - `<MediaGallery>` populated with placeholder items
  - `<MiniDashboard>` for linked watersheds
  - Stewardship `<ProjectCard>` grid for linked projects

- [ ] **M2.8 — Create 2-3 sample tribe page MDX files**
  - Use real tribe names that are publicly known Puget Sound partners (e.g., Tulalip, Muckleshoot, Puyallup) but with ALL content clearly marked as placeholder
  - Demonstrate the template with varying amounts of content (one fuller, one minimal)

- [ ] **M2.9 — Nations polish**
  - Responsive grid layouts
  - Graceful handling of missing content (sections hide or show placeholder)
  - Verify attribution banners are prominent and accurate

**M2 Definition of Done:** The Nations index shows 9+ partner cards. Clicking any card leads to a full tribe page template with clearly marked placeholders, governance attribution, and linked dashboard data. The template gracefully handles tribes with minimal vs. extensive content.

---

## M3: Learn & Education Hub

> **Goal:** The Learn hub and at least 2 learning modules are functional.

### Tasks

- [ ] **M3.1 — Build `<LearningModuleCard>` component**
  - Title, description, time estimate, grade-level badge, link

- [ ] **M3.2 — Build `<AudienceToggle>` component**
  - Toggle between audience levels
  - Affects which content/resources are highlighted (not a hard filter)

- [ ] **M3.3 — Build `<KeyTakeaways>` component**
  - Boxed/highlighted summary block with key points

- [ ] **M3.4 — Build `<EducatorResources>` component**
  - Collapsible section with downloadable resources
  - Each resource: title, description, file type, download link

- [ ] **M3.5 — Assemble Learn index page (`/learn`)**
  - PageHeader, AudienceToggle, ModuleCard grid, Educator section, Connection block

- [ ] **M3.6 — Create Module: "Salmon Life Cycle" (`/learn/salmon-life-cycle`)**
  - Full MDX content (sample text, diagrams described, chart embeds)
  - KeyTakeaways at end
  - EducatorResources section with sample lesson ideas

- [ ] **M3.7 — Create Module: "Treaty Rights & Co-Management" (`/learn/treaty-rights`)**
  - Full MDX content covering treaty history, co-management, tribal sovereignty
  - Extremely careful, respectful framing — factual, not interpretive
  - Links to Nations pages and external authoritative sources

- [ ] **M3.8 — Create Educators page (`/learn/educators`)**
  - Index of all downloadable resources across modules
  - Tips for using the dashboard in classrooms
  - Standards alignment notes (placeholder)

**M3 Definition of Done:** A teacher can visit `/learn`, see module options, read through at least 2 complete modules, and find downloadable lesson ideas.

---

## M4: Stewardship & About Pages

> **Goal:** Stewardship index/detail and About page are functional.

### Tasks

- [ ] **M4.1 — Build `<ProjectCard>` component**
  - Title, tribe(s), location, type tag, thumbnail, excerpt

- [ ] **M4.2 — Build `<ProjectFilterBar>` component**
  - Filters: tribe, project type, watershed

- [ ] **M4.3 — Assemble Stewardship index (`/stewardship`)**
  - PageHeader, filter bar, project grid from mock data

- [ ] **M4.4 — Assemble Stewardship detail template (`/stewardship/[project-slug]`)**
  - Full page layout per PLANNING.md §4.8
  - AttributionBanner, story content, media, impact, related links

- [ ] **M4.5 — Create 3-4 sample project pages**
  - Mocked projects with placeholder content
  - Varying project types to demonstrate template flexibility

- [ ] **M4.6 — Assemble About page (`/about`)**
  - All sections per PLANNING.md §4.9
  - Data sources table with mock entries
  - Tribal partnership model description
  - Accessibility statement

**M4 Definition of Done:** All pages in the sitemap are functional with mock/placeholder content. The full site is navigable end-to-end.

---

## M5: Data Integration (Real APIs)

> **Goal:** Replace mock data with real data sources where available.

### Tasks

- [ ] **M5.1 — Set up PostgreSQL + Prisma**
  - Create database, define Prisma schema matching conceptual model
  - Run migrations
  - Seed with historical data (where publicly available)

- [ ] **M5.2 — Build WDFW/StreamNet salmon returns adapter**
  - Research API availability and data format
  - Build adapter that fetches and normalizes data
  - Implement caching strategy (don't hammer APIs)

- [ ] **M5.3 — Build USGS water data adapter**
  - Fetch water temperature and streamflow from USGS NWIS
  - Map USGS site IDs to our watershed entities

- [ ] **M5.4 — Build watershed GeoJSON pipeline**
  - Obtain or generate GeoJSON for Puget Sound watersheds
  - Integrate with map component

- [ ] **M5.5 — Swap adapters from mock → real**
  - Update adapter internals; verify UI still works identically
  - Add error handling and fallback to cached/mock data

- [ ] **M5.6 — Add data freshness indicators**
  - Show "Last updated: [date]" on dashboard
  - Handle stale data gracefully

**M5 Definition of Done:** Dashboard shows real salmon return and environmental data for at least 3 watersheds. Mock data is used as fallback where real data is unavailable.

---

## M6: CMS & Partner Editing Workflow

> **Goal:** Tribal partners (or their liaisons) can create and edit content without code changes.

### Tasks

- [ ] **M6.1 — Evaluate and select headless CMS**
  - Compare Sanity, Strapi, Payload CMS
  - Key criteria: content approval workflows, role-based access, media management, MDX/rich text support

- [ ] **M6.2 — Set up CMS with tribal content schema**
  - Content types matching our data model (TribalContent, Project, etc.)
  - Approval workflow fields (status, reviewer, date)

- [ ] **M6.3 — Migrate MDX content to CMS**
  - Move tribal content and project pages from MDX files to CMS entries

- [ ] **M6.4 — Update Next.js to fetch from CMS**
  - Replace MDX file reads with CMS API calls
  - Maintain same component rendering

- [ ] **M6.5 — Create partner onboarding guide**
  - Documentation for tribal partners on how to submit/edit content
  - Review workflow documentation

**M6 Definition of Done:** Tribal content can be created and edited through a CMS interface with approval workflows. Code deploys are not required for content changes.

---

## M7: Polish, Accessibility Audit, Launch

> **Goal:** Site is production-ready with verified accessibility, performance, and content.

### Tasks

- [ ] **M7.1 — Full accessibility audit**
  - Automated testing (axe, Lighthouse)
  - Manual keyboard navigation testing
  - Screen reader testing (VoiceOver, NVDA)
  - Fix all critical and serious issues

- [ ] **M7.2 — Performance optimization**
  - Lighthouse performance audit
  - Image optimization verification
  - Bundle analysis, code splitting review
  - Lazy loading verification for charts/maps

- [ ] **M7.3 — Responsive design review**
  - Test all pages at mobile (320px), tablet (768px), desktop (1280px+)
  - Fix layout issues

- [ ] **M7.4 — Content review**
  - Verify all placeholder text is clearly marked
  - Verify attribution banners on all tribal content
  - Spell check, grammar check
  - Link verification (no broken links)

- [ ] **M7.5 — SEO setup**
  - Meta titles and descriptions for all pages
  - Open Graph tags for social sharing
  - Sitemap.xml generation
  - robots.txt configuration

- [ ] **M7.6 — Deployment**
  - Set up production deployment (Vercel or chosen platform)
  - Configure custom domain
  - Set up monitoring/analytics (privacy-respecting, e.g., Plausible or Umami)
  - SSL verification

- [ ] **M7.7 — Documentation**
  - Update CLAUDE.md, PLANNING.md, TASKS.md
  - Create README.md with setup instructions
  - Document deployment process

**M7 Definition of Done:** Site is live, accessible, performant, and all tribal content is clearly governed. The project team has documentation to maintain and extend the site.

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

## Sprint Planning Notes

### Recommended First Sprint (Week 1-2)

Focus: **M0 (all tasks) + M1.1 through M1.5**

This gives you:
1. A working dev environment with the full site shell
2. Mock data flowing through adapters
3. The Dashboard page — the most complex and reusable page — functional

**Why start with the Dashboard:**
- It exercises the most components (charts, filters, cards, tooltips)
- Components built here (MetricCard, IndicatorChart) are reused on Nations pages (MiniDashboard)
- The adapter pattern, proven here with mock data, sets the pattern for all other data
- It's the most "demo-able" page for stakeholder feedback

### Recommended Second Sprint (Week 3-4)

Focus: **M1.6-M1.7 + M2 (all tasks)**

This gives you:
1. Dashboard fully polished with basin detail pages
2. The Nations template system — the most politically important page

After Sprint 2, you have the two core pillars (Data + Nations) functional and can demo to tribal partners for feedback.