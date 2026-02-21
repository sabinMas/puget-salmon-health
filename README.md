# Puget Sound Salmon Health Dashboard

> An interactive web platform tracking salmon population health across Puget Sound watersheds, built in partnership with tribal nations and informed by both scientific data and traditional ecological knowledge.

## 🌊 Project Vision

This dashboard answers two interconnected questions:

1. **"How are the salmon doing?"** — through clear, visual, data-backed indicators
2. **"Why does it matter, and who has always known?"** — by centering tribal knowledge and leadership

**Design Philosophy:** Data and Indigenous knowledge are presented as equal pillars, not hierarchical. Tribal nations control their own content. The site is accessible, educational, and built to grow.

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5 (App Router, React Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (CSS-first configuration)
- **Data:** PostgreSQL + Prisma (planned), currently using mock data adapters
- **Deployment:** Vercel (or similar)
- **APIs:** WDFW, USGS, WSDOT (integration planned for Phase 2)

## 📚 Project Structure

```
puget-salmon-health/
├── app/                      # Next.js App Router pages
│   ├── page.tsx              # Home page (hero + two pillars)
│   ├── dashboard/            # Data visualization pages
│   ├── nations/              # Tribal partner pages
│   ├── learn/                # Educational modules
│   ├── stewardship/          # Project showcase
│   ├── about/                # About & data sources
│   ├── api/                  # API routes (planned)
│   ├── layout.tsx            # Root layout with nav/footer
│   └── globals.css           # Design tokens + Tailwind config
│
├── components/              # React components
│   ├── layout/               # SiteHeader, SiteFooter
│   ├── ui/                   # Card, PageHeader, StatusBadge, InfoTooltip, Placeholder
│   ├── dashboard/            # SalmonMetricCard, WatershedSelector, SpeciesFilter
│   └── nations/              # TribalPartnerCard, AttributionBanner, ContentSection
│
├── lib/                     # Utilities and data layer
│   └── data/                 # Data adapters (mock → DB → API progression)
│       ├── watersheds.ts
│       ├── species.ts
│       ├── salmon-returns.ts
│       └── tribes.ts
│
├── types/                   # TypeScript type definitions
├── content/                 # MDX files for Learn modules (future)
├── public/                  # Static assets, data files, images
├── PLANNING.md              # Full architecture & design doc
├── TASKS.md                 # Milestone tracking
└── CLAUDE.md                # Claude Code session notes
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/sabinMas/puget-salmon-health.git
cd puget-salmon-health

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📋 Current Status (MVP Phase)

### ✅ Completed (M0 - Foundation)

- [x] Next.js 15 project scaffolded with TypeScript + Tailwind v4
- [x] Design tokens configured (color palette, typography)
- [x] Site navigation shell (header + footer + routing)
- [x] Shared UI components (Card, PageHeader, StatusBadge, InfoTooltip, Placeholder)
- [x] Mock data adapters for watersheds, species, salmon returns, tribes
- [x] All 14+ routes stubbed and building successfully
- [x] Home page with hero, two-pillar design, and at-a-glance metrics
- [x] Dashboard page with filters, metric cards, chart placeholders
- [x] Nations index with partnership statement and tribal partner cards
- [x] Individual Nation page template with attribution and placeholders
- [x] Learn index page with module cards
- [x] Stewardship index page with project cards
- [x] About page with mission, data sources, accessibility statement

### 🚧 In Progress (M1 - Dashboard MVP)

- [ ] `<IndicatorChart>` component with Recharts
- [ ] Dashboard data fetching and state management
- [ ] Basin detail pages (`/dashboard/[basin]`)
- [ ] Responsive design testing and refinement

### 🗓️ Upcoming Milestones

- **M2:** Nations template system refinement, sample tribal content
- **M3:** Learn modules (full MDX content for 2-3 modules)
- **M4:** Stewardship project detail pages
- **M5:** Real API integration (WDFW, USGS, etc.)
- **M6:** CMS for tribal content governance
- **M7:** Accessibility audit, performance optimization, launch

See [TASKS.md](./TASKS.md) for detailed milestone tracking.

## 📊 Data Architecture

### The Adapter Pattern

All data access goes through **adapter functions** in `lib/data/`. This allows us to:

1. Start with mock data (current phase)
2. Migrate to PostgreSQL (Phase 2)
3. Integrate live APIs (Phase 3)

**The UI never knows which data source is active.** Components always call the same adapter functions:

```typescript
import { getWatersheds } from '@/lib/data/watersheds';
import { getSalmonReturns } from '@/lib/data/salmon-returns';

const watersheds = await getWatersheds();
const returns = await getSalmonReturns('skagit', 'chinook', 2020, 2024);
```

Internally, adapters can switch from JSON → DB → API without changing component code.

## 🌱 Design Principles

### Two Equal Pillars

**Data** and **Indigenous knowledge** are presented as complementary, not hierarchical. Both are primary content, not one as the "real" information with the other as decoration.

### Tribal Content Governance

- Tribal nations **control their own pages**: what to share, how to frame it, when to update
- Content is **reviewed and approved** by tribal leadership before publication
- **Attribution banners** on every tribal page make governance transparent
- **Placeholder components** clearly mark sections awaiting tribal content
- Tribes can **modify or remove** content at any time

### Accessibility-First

- WCAG 2.1 Level AA compliance target
- Keyboard navigation for all interactive elements
- Screen reader-friendly chart descriptions
- Color + text/icon pairings (never color alone)
- Skip-to-content links, semantic HTML

### Plain Language

- A 7th grader should understand the landing page
- Technical terms are explained when introduced
- Charts have plain-language interpretations
- "What does this mean?" tooltips throughout

## 🤝 Contributing

### For Tribal Partners

If your tribal nation would like to participate in this project:

1. Contact us at partnerships@pugetsalmonhealth.org
2. We'll schedule a consultation to discuss your vision and governance preferences
3. Content development happens at your pace, with your approval required at every stage
4. You retain full control of your nation's page

### For Developers

Contributions are welcome! Please:

1. Read [PLANNING.md](./PLANNING.md) to understand the architecture
2. Check [TASKS.md](./TASKS.md) for current priorities
3. Follow existing component patterns (especially the adapter pattern)
4. Test accessibility (keyboard nav, screen reader)
5. Submit PRs with clear descriptions

### For Educators

Looking for lesson ideas or standards alignment? Check `/learn/educators` (coming in M3). Feedback on educational content is always welcome.

## 📜 Documentation

- **[PLANNING.md](./PLANNING.md)** — Full architecture, information architecture, sitemap, wireframes, data model
- **[TASKS.md](./TASKS.md)** — Milestone tracking, sprint planning, task breakdown
- **[CLAUDE.md](./CLAUDE.md)** — Claude Code session notes and project setup
- **[DATA_SOURCES.md](./DATA_SOURCES.md)** — Detailed data source reference
- **[QUICKSTART.md](./QUICKSTART.md)** — Developer onboarding guide

## 💯 Acknowledgments

This project is built in partnership with the Native Nations of Puget Sound, who are the original and ongoing stewards of these waters and salmon populations.

Data sources include WDFW, USGS, NOAA Fisheries, Puget Sound Partnership, and tribal monitoring programs.

Built with respect for tribal data sovereignty and traditional ecological knowledge.

## 📧 Contact

- **Partnerships:** partnerships@pugetsalmonhealth.org
- **Data questions:** data@pugetsalmonhealth.org  
- **General inquiries:** info@pugetsalmonhealth.org

---

**License:** [To be determined in consultation with tribal partners]

**Land Acknowledgment:** This dashboard tracks salmon across the traditional territories of the Coast Salish peoples, including but not limited to the Duwamish, Muckleshoot, Puyallup, Snoqualmie, Suquamish, Stillaguamish, Tulalip, Swinomish, Lummi, Nooksack, Nisqually, Squaxin Island, and Skokomish peoples. We honor their past, present, and future stewardship of these lands and waters.
