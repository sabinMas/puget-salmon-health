# PLANNING.md — Puget Salmon Health Dashboard

> Vision, architecture, information architecture, data model, and design decisions.

---

## 1. Vision & Purpose

The Puget Salmon Health Dashboard is a public website that answers two intertwined questions:

1. **"How are the salmon doing?"** — through clear, visual, data-backed indicators of salmon health across Puget Sound watersheds.
2. **"Why does it matter, and who has always known?"** — by centering the knowledge, stewardship, and ongoing leadership of the Native Nations of Puget Sound.

The site is not a government report or an academic paper. It's a **community learning tool** — accessible to a curious neighbor, useful to a teacher, and respectful enough that a tribal program director would feel comfortable pointing people to it.

### Design Philosophy

- **Two equal pillars**: Data and Indigenous knowledge are presented as complementary, not hierarchical. The dashboard is not "the real content" with tribal pages as decoration. Both are primary.
- **Tribal voices lead**: Content architecture makes it structurally clear that tribal nations are knowledge holders and co-leaders. Tribal content sections are authored and governed by partners, not by us.
- **Clarity over cleverness**: Simple layouts, plain language, strong visual hierarchy. A 7th grader should be able to understand the landing page. A scientist should find the data credible.
- **Built to grow**: The data layer uses adapters that can swap mock data for live APIs. The content layer uses templates that can scale from 1 to 20+ tribal partners. New watersheds, species, and projects can be added without redesigning the site.

---

## 2. Information Architecture

### 2.1 Sitemap

```
Home (/)
│
├── Dashboard (/dashboard)
│   ├── Overview (default view — all Puget Sound)
│   ├── By Watershed (/dashboard/[basin-slug])
│   │   └── e.g., /dashboard/skagit, /dashboard/nisqually
│   └── By Species (/dashboard?species=chinook)  ← filter, not separate route
│
├── Nations (/nations)
│   ├── Index — all participating tribal partners
│   └── Individual Nation (/nations/[tribe-slug])
│       ├── History & Salmon Relationship
│       ├── Stewardship & Projects (or links to /stewardship/[project])
│       └── Media Gallery
│
├── Learn (/learn)
│   ├── Index — module overview
│   ├── Module: Salmon Life Cycle (/learn/salmon-life-cycle)
│   ├── Module: Why Salmon Matter (/learn/why-salmon-matter)
│   ├── Module: Treaty Rights & Co-Management (/learn/treaty-rights)
│   ├── Module: Reading the Dashboard (/learn/reading-the-dashboard)
│   └── For Educators (/learn/educators)
│       └── Downloadable lesson plans, activity ideas
│
├── Stewardship (/stewardship)
│   ├── Index — all projects
│   └── Individual Project (/stewardship/[project-slug])
│
├── About (/about)
│   ├── About This Project
│   ├── Data Sources & Methods
│   ├── Tribal Partnerships & Data Ethics
│   └── Contact / Get Involved
│
└── Shared Elements (present on all pages)
    ├── Global Navigation (header)
    ├── Footer (attribution, links, land acknowledgment)
    └── "How to read this" contextual help tooltips
```

### 2.2 Navigation Structure

**Primary Navigation (header — always visible):**

| Label | Route | Notes |
|---|---|---|
| Dashboard | `/dashboard` | The data view |
| Nations | `/nations` | Tribal partners hub |
| Learn | `/learn` | Education modules |
| Stewardship | `/stewardship` | Projects & stories |
| About | `/about` | Project info & ethics |

**Secondary Navigation:**
- Within Dashboard: watershed selector (dropdown/map) + species filter
- Within Nations: sidebar or tab nav for each tribe's sub-sections
- Within Learn: module list with progress indicators (optional)

**Utility Navigation (top-right or mobile menu):**
- Search (if implemented)
- Accessibility settings (text size, contrast toggle — stretch goal)

---

## 3. Core User Journeys

### Journey 1: Curious Local — "How are the salmon in my area?"

```
Home → Dashboard → Select watershed (e.g., Skagit) →
  See salmon return trends + environmental indicators →
  Read "What does this mean?" interpretation →
  (Optional) Click through to tribal stewardship projects in that basin →
  (Optional) Click through to Learn module on salmon ecology
```

**Key need:** Fast, visual answer with enough context to understand significance.
**Design implication:** Dashboard must have a prominent geography selector and at-a-glance metrics before detailed charts.

### Journey 2: Teacher — "Find a lesson idea for my class"

```
Home → Learn → Browse modules by topic or grade band →
  Select "Why Salmon Matter" module →
  Read content, view embedded visuals →
  Scroll to "For Educators" section with lesson ideas →
  Download/copy lesson plan →
  (Optional) Link to Nations pages for cultural context
```

**Key need:** Scannable, grade-appropriate content with ready-to-use materials.
**Design implication:** Learn pages need clear age-band indicators and a dedicated educator section with downloadable resources.

### Journey 3: Tribal Staff — "Review how our content appears"

```
Home → Nations → Select their tribe's page →
  Review all sections: history, current programs, media gallery →
  Check attribution block accuracy →
  Note any needed changes for revision request →
  (Optional) View Stewardship projects linked to their tribe
```

**Key need:** Accurate, respectful presentation with clear governance.
**Design implication:** Every tribal page must have visible attribution, last-reviewed date, and a clear process for requesting changes.

### Journey 4: Student (middle school) — "Learn about salmon for a school project"

```
Home → Learn → "Salmon Life Cycle" module →
  Read age-appropriate content with diagrams →
  Interactive: follow a salmon's journey →
  (Optional) Explore Dashboard to find real data for their watershed →
  (Optional) Visit Nations page to learn about tribal connections
```

**Key need:** Engaging, visual, age-appropriate. Not overwhelming.
**Design implication:** Learn modules need a gentle reading level option and visual storytelling components.

### Journey 5: NGO/Government Staff — "Get context for a report or meeting"

```
Home → Dashboard → Browse multiple watersheds →
  Compare trends across basins →
  Read data source documentation (/about) →
  (Optional) Reference specific stewardship projects →
  Share or cite specific charts/pages
```

**Key need:** Credible data with clear sourcing and caveats.
**Design implication:** Every chart needs source attribution and export/share capability (stretch goal).

---

## 4. Page-Level Wireframe Descriptions

### 4.1 Home Page (`/`)

**Purpose:** Orientation, emotional hook, and wayfinding. Answers: "What is this site?" and "Where should I go?"

| Order | Section | Contents |
|---|---|---|
| 1 | **Hero** | Large heading: "How Are the Salmon?" / Subheading: "Tracking salmon health across Puget Sound — informed by science and guided by the knowledge of the Native Nations who have stewarded these waters since time immemorial." / Background: subtle, respectful illustration or photograph (no stock photos of tribal members without permission). / Two CTAs: "Explore the Dashboard" → `/dashboard`, "Meet the Nations" → `/nations` |
| 2 | **At-a-Glance Pulse** | 3–4 `<SalmonMetricCard>` components showing headline numbers: e.g., "Chinook returns this year: [X]", "Watersheds monitored: [X]", "Tribal partners: [X]", "Active restoration projects: [X]". Each card links to its detail view. |
| 3 | **Two-Pillar Introduction** | Side-by-side panels: Left — "The Data" (brief description of the dashboard + preview chart thumbnail + link). Right — "The Knowledge Holders" (brief description of tribal partnerships + representative quote placeholder + link to Nations). Visual parity communicates equal importance. |
| 4 | **Featured Story** | A single `<StoryCard>` highlighting one tribal stewardship project or learning module. Rotates or is manually curated. Includes image, title, short excerpt, and "Read more" link. |
| 5 | **How to Use This Site** | Three icon+text blocks: "Check the Data" / "Learn the Story" / "Hear from Nations" — each a brief sentence with a link. Helps orient first-time visitors. |
| 6 | **Footer** | Site-wide footer (see shared components below). |

---

### 4.2 Dashboard Page (`/dashboard`)

**Purpose:** Primary data interface. Answer "how are salmon doing?" with visual indicators.

| Order | Section | Contents |
|---|---|---|
| 1 | **Page Header** | Title: "Salmon Health Dashboard" / Subtitle: "Current conditions and trends across Puget Sound watersheds." |
| 2 | **Geography & Filter Bar** | `<WatershedSelector>` (dropdown or clickable map) + `<SpeciesFilter>` (pill buttons: All, Chinook, Coho, Chum, Pink, Sockeye) + optional time range selector. Sticky on scroll. |
| 3 | **At-a-Glance Summary** | Row of 3–5 `<SalmonMetricCard>` components for the selected watershed/species: latest return estimate, trend direction (↑↓→), key environmental indicator (water temp, flow), overall status indicator (healthy/caution/concern). Each card has a "What does this mean?" tooltip. |
| 4 | **Primary Chart: Salmon Returns Over Time** | `<IndicatorChart>` — line/area chart showing annual returns for the selected species + basin. Clear axis labels, legend, data source footnote. Below the chart: 2–3 sentence plain-language interpretation. |
| 5 | **Environmental Indicators Panel** | Grid of 2–3 smaller `<IndicatorChart>` components: water temperature trends, streamflow, habitat quality proxy (e.g., impervious surface %, riparian cover). Each has its own mini-interpretation. |
| 6 | **Context Sidebar or Section** | "Why This Matters" block: 1–2 paragraphs connecting the data to ecological and cultural significance. Links to relevant Learn module and Nations page for this watershed's tribal partners. |
| 7 | **Data Sources & Caveats** | Collapsible section listing data sources, update frequency, known limitations. Link to full `/about` data documentation. |

**Basin Detail Page (`/dashboard/[basin]`):** Same layout as above but pre-filtered to that basin, with additional basin-specific context (map zoomed in, local tribal connections, local projects).

---

### 4.3 Nations Index Page (`/nations`)

**Purpose:** Introduce the tribal partnership model and provide navigation to individual partner pages.

| Order | Section | Contents |
|---|---|---|
| 1 | **Page Header** | Title: "The Nations of Puget Sound" / Subtitle: "Salmon recovery is guided by the knowledge and leadership of the tribes who have cared for these waters and fish since time immemorial. The content in this section is authored and governed by each tribal partner." |
| 2 | **Partnership Statement** | A framed/highlighted block explaining: content governance, tribal data sovereignty, the fact that tribes control their pages, and how to learn more about the partnership model. |
| 3 | **Nations Grid** | Grid of `<TribalPartnerCard>` components (one per partner). Each card shows: tribal name, a representative image (provided by tribe or placeholder), short tagline, and "Visit Page →" link. Cards are arranged alphabetically or by geography (configurable). |
| 4 | **Map View (optional/stretch)** | Interactive map showing approximate traditional territories of participating tribes. Boundaries, names, and styling as directed by tribal partners. |
| 5 | **Call to Action** | "Interested in partnering?" block with contact information. |

---

### 4.4 Individual Nation Page (`/nations/[tribe-slug]`)

**Purpose:** A tribe's own space — their history, relationship with salmon, current work, and media.

**This is the most important template to get right. It must be:**
- Scalable (works for 9+ tribes with varying amounts of content)
- Flexible (some tribes may provide extensive content, others minimal at first)
- Governed (clear attribution and review status)

| Order | Section | Contents |
|---|---|---|
| 1 | **Hero / Title Block** | Tribe name (in English and in their language if provided). Subtitle or tagline provided by tribe. Optional: hero image provided by tribe. |
| 2 | **Attribution & Governance Block** | `<AttributionBanner>`: "Content on this page is authored and approved by [Tribe Name]. Last reviewed: [date]. [Tribe Name] retains the right to modify or remove this content at any time." |
| 3 | **Introduction** | 1–3 paragraphs: the tribe's relationship with salmon, in their own words. [Placeholder: "This section will contain an introduction authored by [Tribe Name] about their relationship with salmon and Puget Sound."] |
| 4 | **Historical Practices** | `<ContentSection>`: Historical fishing practices, technologies, seasonal rounds. May include images, illustrations, or maps. [Placeholder text clearly marked.] |
| 5 | **Cultural Teachings (if shared)** | `<ContentSection>`: Ceremonies, First Salmon traditions, teachings that the tribe has chosen to share publicly. This section is **entirely optional** and only appears if the tribe provides content. A note: "Cultural teachings are shared at the discretion of [Tribe Name]. Not all knowledge is meant to be public, and we respect that." |
| 6 | **Salmon Today** | `<ContentSection>`: How salmon are part of the tribe's life today — food, community, economy, youth programs, hatcheries, etc. |
| 7 | **Stewardship Projects** | Grid of `<ProjectCard>` components linking to `/stewardship/[project]` pages associated with this tribe. |
| 8 | **Media Gallery** | `<MediaGallery>`: photos, videos, audio clips. Each item has tribal-approved caption and credit. |
| 9 | **Linked Data** | "Salmon in [Tribe Name]'s waters" — mini-dashboard view (`<MiniDashboard>`) showing key metrics for watersheds in/near the tribe's territory. Links to full dashboard. |
| 10 | **Contact / Learn More** | Tribe's preferred contact info or website link. |

---

### 4.5 Learn Index Page (`/learn`)

**Purpose:** Hub for educational content. Helps users (especially educators and students) find learning pathways.

| Order | Section | Contents |
|---|---|---|
| 1 | **Page Header** | Title: "Learn" / Subtitle: "Understand the story of salmon — from their life cycle and ecological role to the treaty rights and stewardship that protect them." |
| 2 | **Audience Selector** | `<AudienceToggle>`: "I'm a student (middle school)" / "I'm a student or adult learner" / "I'm an educator". Adjusts displayed content level or highlights relevant materials. Stored in local state, not a hard gate. |
| 3 | **Module Cards** | Grid of `<LearningModuleCard>` components. Each shows: module title, short description, estimated time, topics covered, grade-level suitability icon. |
| 4 | **For Educators** | Highlighted section: "Resources for Educators" with links to downloadable lesson plans, activity ideas, standards alignment notes. Links to `/learn/educators`. |
| 5 | **Connection Block** | "These modules connect to the Dashboard data and the Nations' knowledge. Learning is richer when you explore all three." — with icon links to Dashboard and Nations. |

---

### 4.6 Learn Module Page (`/learn/[module-slug]`)

**Purpose:** A single guided learning experience on one topic.

| Order | Section | Contents |
|---|---|---|
| 1 | **Module Header** | Title, brief description, estimated reading time, grade-level indicator. |
| 2 | **Content Body** | Rich MDX content: prose, diagrams, embedded charts or interactive elements, image figures with captions. Structured with clear H2/H3 headings for scannability. |
| 3 | **Key Takeaways** | Boxed summary: 3–5 bullet points of what the reader should now understand. |
| 4 | **Connections** | Links to related Dashboard views, Nations pages, and other Learn modules. |
| 5 | **For Educators** | Collapsible section with lesson ideas, discussion questions, and activity suggestions for this specific module. |

---

### 4.7 Stewardship Index (`/stewardship`)

**Purpose:** Showcase ongoing tribal stewardship and restoration projects.

| Order | Section | Contents |
|---|---|---|
| 1 | **Page Header** | Title: "Stewardship & Projects" / Subtitle: "Tribal nations are leading salmon recovery through habitat restoration, monitoring, climate adaptation, and youth education." |
| 2 | **Filter Bar** | Filter by: tribe, project type (restoration, monitoring, education, climate adaptation), watershed. |
| 3 | **Project Grid** | Grid of `<ProjectCard>` components. Each shows: project name, lead tribe(s), location, project type tag, thumbnail image, short description. |

---

### 4.8 Stewardship Project Page (`/stewardship/[project-slug]`)

| Order | Section | Contents |
|---|---|---|
| 1 | **Project Header** | Title, lead tribe(s), location, project type, status (active/completed). |
| 2 | **Attribution** | `<AttributionBanner>` for the tribe(s) involved. |
| 3 | **Story / Description** | Rich content: what the project does, why it matters, how it connects traditional knowledge and modern science. |
| 4 | **Media** | Photos, video, maps. |
| 5 | **Impact / Results** | Data or qualitative outcomes if available. |
| 6 | **Related** | Links to the tribe's Nations page, relevant Dashboard basin view, related Learn modules. |

---

### 4.9 About Page (`/about`)

| Order | Section | Contents |
|---|---|---|
| 1 | **About This Project** | Who built it, why, what it aims to do. |
| 2 | **Tribal Partnerships** | How the partnership model works. Content governance. Tribal data sovereignty principles. Review/approval processes. Rights to revise/remove. |
| 3 | **Data Sources & Methods** | Table of data sources, update frequencies, links. Caveats and known limitations. |
| 4 | **Accessibility Statement** | Commitment to WCAG 2.1 AA and how to report issues. |
| 5 | **Contact** | How to reach the team, how to get involved, how tribes can join. |

---

## 5. Data Model (Conceptual)

### Entities & Relationships

```
┌─────────────┐       ┌──────────────────┐       ┌───────────────┐
│    Tribe     │──────<│   TribalContent   │       │    Species    │
│              │  1:N  │                  │       │               │
│ id           │       │ id               │       │ id            │
│ name         │       │ tribe_id (FK)    │       │ common_name   │
│ slug         │       │ section_type     │       │ scientific_nm │
│ display_name │       │ title            │       │ slug          │
│ language_name│       │ body_mdx         │       │ icon          │
│ territory_geo│       │ media[]          │       └───────┬───────┘
│ website_url  │       │ approval_status  │               │
│ contact_info │       │ approved_by      │               │
└──────┬───────┘       │ approved_date    │               │
       │               │ can_be_removed   │               │
       │               └──────────────────┘               │
       │                                                  │
       │  N:M                                             │
       ▼                                                  │
┌──────────────┐       ┌──────────────────┐               │
│  Watershed   │──────<│  SalmonReturn    │───────────────┘
│  / Basin     │  1:N  │                  │
│              │       │ id               │
│ id           │       │ watershed_id(FK) │
│ name         │       │ species_id (FK)  │
│ slug         │       │ year             │
│ region       │       │ count_estimate   │
│ geometry_geo │       │ method           │
│ area_sq_km   │       │ source           │
└──────┬───────┘       │ confidence       │
       │               └──────────────────┘
       │
       │  1:N
       ▼
┌──────────────────┐       ┌──────────────────┐
│ EnvIndicator     │       │    Project       │
│ Reading          │       │                  │
│                  │       │ id               │
│ id               │       │ title            │
│ watershed_id(FK) │       │ slug             │
│ indicator_type   │       │ tribe_ids[] (FK) │
│ value            │       │ watershed_id(FK) │
│ unit             │       │ project_type     │
│ date             │       │ status           │
│ source           │       │ body_mdx         │
└──────────────────┘       │ media[]          │
                           └──────────────────┘
```

### Key Relationships

- **Tribe ↔ Watershed**: Many-to-many (a tribe's territory may span multiple watersheds; a watershed may be in multiple tribes' territories). Join table: `tribe_watershed`.
- **Tribe → TribalContent**: One-to-many. Each content block belongs to one tribe and has an approval status.
- **Tribe → Project**: Many-to-many (projects can be inter-tribal). Join table: `tribe_project`.
- **Watershed → SalmonReturn**: One-to-many. Returns are per-watershed, per-species, per-year.
- **Watershed → EnvIndicatorReading**: One-to-many. Readings are per-watershed, per-indicator-type, per-date.
- **Species → SalmonReturn**: One-to-many.

### Enums / Lookup Values

```typescript
// Species
type SalmonSpecies = 'chinook' | 'coho' | 'chum' | 'pink' | 'sockeye' | 'steelhead';

// Indicator types
type IndicatorType = 'water_temp' | 'streamflow' | 'dissolved_oxygen' | 'habitat_quality' | 'impervious_surface';

// Project types
type ProjectType = 'habitat_restoration' | 'monitoring' | 'climate_adaptation' | 'youth_education' | 'hatchery' | 'research';

// Content section types (for tribal content blocks)
type ContentSectionType = 'introduction' | 'historical_practices' | 'cultural_teachings' | 'salmon_today' | 'custom';

// Approval status
type ApprovalStatus = 'draft' | 'pending_review' | 'approved' | 'revision_requested' | 'removed';
```

---

## 6. Reusable Component Library

### Dashboard Components

| Component | Purpose | Props (key) |
|---|---|---|
| `<SalmonMetricCard>` | At-a-glance stat with label, value, trend arrow, and tooltip | `label`, `value`, `unit`, `trend`, `tooltipText`, `href` |
| `<IndicatorChart>` | Time-series line/area chart for any indicator | `data[]`, `title`, `xLabel`, `yLabel`, `source`, `interpretation` |
| `<WatershedSelector>` | Dropdown or map-based watershed picker | `watersheds[]`, `selected`, `onChange` |
| `<SpeciesFilter>` | Pill/chip buttons to filter by salmon species | `species[]`, `selected`, `onChange` |
| `<MiniDashboard>` | Compact version of key metrics for embedding on other pages | `watershedId`, `speciesId` |
| `<StatusBadge>` | Color-coded badge: healthy / caution / concern | `status`, `label` |

### Tribal Content Components

| Component | Purpose | Props (key) |
|---|---|---|
| `<AttributionBanner>` | Governance/attribution notice for tribal content | `tribeName`, `reviewDate`, `approvedBy` |
| `<TribalPartnerCard>` | Card in the Nations index grid | `tribe` (object with name, slug, tagline, image) |
| `<ContentSection>` | Flexible content block for tribal page sections | `title`, `body` (MDX), `media[]`, `sectionType` |
| `<MediaGallery>` | Grid of images/videos/audio with tribal-approved captions | `items[]` (each with type, src, caption, credit, tribe) |
| `<TribalStoryPanel>` | Featured story block (used on home page, etc.) | `title`, `excerpt`, `image`, `tribeName`, `href` |

### Education Components

| Component | Purpose | Props (key) |
|---|---|---|
| `<LearningModuleCard>` | Card for the Learn index grid | `title`, `description`, `estimatedTime`, `gradeLevel`, `href` |
| `<AudienceToggle>` | Audience/grade-level selector | `audiences[]`, `selected`, `onChange` |
| `<KeyTakeaways>` | Boxed summary of key points | `takeaways[]` |
| `<EducatorResources>` | Collapsible section with lesson plans and activities | `resources[]` |

### Stewardship Components

| Component | Purpose | Props (key) |
|---|---|---|
| `<ProjectCard>` | Card for stewardship project grid | `project` (object with title, tribes, type, location, image, excerpt) |
| `<ProjectFilterBar>` | Filter by tribe, type, watershed | `filters`, `onChange` |

### Shared / Layout Components

| Component | Purpose |
|---|---|
| `<SiteHeader>` | Global nav, logo, responsive menu |
| `<SiteFooter>` | Links, acknowledgment, attribution |
| `<PageHeader>` | Reusable page title + subtitle + breadcrumbs |
| `<InfoTooltip>` | "What does this mean?" help icon with popover |
| `<SkipToContent>` | Accessibility skip link |
| `<Card>` | Base card component (composed by all specific cards above) |
| `<Placeholder>` | Clearly marked placeholder block for content awaiting tribal review |

---

## 7. Data Layer Architecture

### The Adapter Pattern

The most important architectural decision: **all data access goes through adapters** that return consistent TypeScript interfaces, regardless of the data source.

```
UI Component
    ↓ calls
Adapter Function (e.g., getSalmonReturns())
    ↓ internally delegates to
Data Source (mock JSON → PostgreSQL → live API)
```

### Phase Progression

| Phase | Data Source | Adapter Behavior |
|---|---|---|
| **Phase 1 (Now)** | Static JSON in `/public/data/` | Adapter reads and parses local JSON files |
| **Phase 2** | PostgreSQL via Prisma | Adapter queries the database |
| **Phase 3** | Live APIs (WDFW, USGS, StreamNet) + cache | Adapter fetches from external APIs with caching/fallback |

The UI never knows or cares which phase we're in. Components call the same functions and get the same shaped data.

### Known/Target Data Sources

| Data Type | Potential Sources | Status |
|---|---|---|
| Salmon returns (abundance) | WDFW SalmonScape, StreamNet, tribal data programs | Some available; needs research |
| Water temperature | USGS National Water Information System | API available |
| Streamflow | USGS NWIS | API available |
| Habitat quality | Puget Sound Partnership indicators, NOAA | Varies |
| Watershed boundaries | USGS NHD, WA Ecology | GeoJSON available |
| Tribal territory boundaries | To be provided/approved by tribal partners | Must be partner-directed |

---

## 8. Tech Stack Rationale

See **CLAUDE.md** for the full stack specification. Key reasoning:

- **Next.js** over plain React: SEO matters for a public educational site. Server-side rendering is important for the content-heavy pages (Nations, Learn). API routes eliminate the need for a separate backend.
- **PostgreSQL over MySQL**: You know MySQL so the transition is gentle. Postgres gives us PostGIS for geospatial watershed queries and better JSON support for flexible tribal content fields.
- **Tailwind over custom CSS**: Faster to build consistently. The design system is in the utility classes, not in separate stylesheets. Especially good for a project with many similar-but-not-identical card and section layouts.
- **MDX over a CMS (for now)**: With 9+ tribal partners, you'll eventually need a CMS. But starting with MDX files lets you build and iterate on the template without the overhead of CMS setup. The migration path is clear: MDX → headless CMS, with the same React components rendering the content either way.

---

## 9. Design Tokens & Visual Direction

### Color Palette (Proposed)

Design intent: Earthy, natural, accessible. Inspired by Pacific Northwest landscapes — not "corporate blue" and not "Indian art" pastiche.

```
Primary:     Deep Teal (#1B5E5E)     — trust, water, depth
Secondary:   Warm Terracotta (#B85C38) — earth, salmon, warmth
Accent:      River Stone (#5C7A7A)    — neutral, calm
Background:  Off-White (#FAF8F5)      — warm paper tone
Surface:     Soft Sand (#F0EBE3)      — card backgrounds
Text:        Charcoal (#2D2D2D)       — high contrast on light bg
Text-muted:  Slate (#6B7280)          — secondary text
Success:     Forest Green (#2D6A4F)   — healthy/positive indicators
Warning:     Amber (#D4A017)          — caution indicators
Danger:      Deep Red (#9B2226)       — concern indicators
```

### Typography (Proposed)

```
Headings:  A humanist sans-serif (e.g., Source Sans Pro, Nunito, or similar)
Body:      Same family at regular weight for readability
Monospace: For data labels if needed (JetBrains Mono or similar)
Scale:     Modular scale based on 1rem = 16px base
```

### Accessibility Notes

- All color pairings must meet WCAG AA contrast ratios (4.5:1 body text, 3:1 large text).
- Status colors (green/amber/red) must never be the *only* indicator — always pair with icons or text labels.
- Chart colors should be distinguishable in grayscale and for common color blindness types.

---

## 10. Content Strategy Notes

### Voice & Tone

- **Warm but not casual**: "Welcome to the Puget Salmon Health Dashboard" not "Hey! Let's check on the salmon 🐟"
- **Clear but not dumbed down**: Explain technical terms; don't avoid them entirely.
- **Respectful and deferential to tribal knowledge**: Frame tribal content as expert knowledge, not folklore. Use "Nations" or "tribes" (per partner preference), never "Indians." Follow each partner's preference for their own name.
- **Honest about limitations**: "This data has limitations" is better than false precision.

### Placeholder Conventions

When tribal content has not yet been provided, always use clearly marked placeholders:

```
[Awaiting content from {Tribe Name}]
[This section will contain {description} authored by {Tribe Name}]
[Placeholder image — to be replaced with image provided by {Tribe Name}]
```

Never use generic "Lorem ipsum" for tribal content sections — the placeholder text itself should communicate that this space belongs to a specific partner.

---

## 11. Open Architecture Questions

| Question | Impact | Status |
|---|---|---|
| Should tribal content be stored in the same database as environmental data, or in a separate system to enforce data sovereignty? | Data architecture, hosting | Open |
| Do tribal partners need direct editing access (CMS login) or will they submit content through a liaison? | CMS requirements, auth | Open |
| Should the dashboard support comparison views (e.g., two watersheds side by side)? | UI complexity | Open — probably Phase 2 |
| How will the site handle periods with no data (e.g., off-season for salmon returns)? | Dashboard UX | Open |
| Will there be user accounts or is this entirely public/anonymous? | Auth, personalization | Open — assume public-only for Phase 1 |