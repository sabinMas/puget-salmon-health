import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Resources for Educators | Learn | Puget Sound Salmon Health',
  description:
    'Lesson plans, discussion guides, standards alignment, and data activities for teaching about Puget Sound salmon.',
};

// ── Data ──────────────────────────────────────────────────────────────────────

const MODULES = [
  {
    slug: 'salmon-life-cycle',
    title: 'Salmon Life Cycle',
    grades: 'Grades 5–8',
    time: '15 min',
    subjects: ['Life Science', 'Environmental Science'],
    objectives: [
      'Identify and sequence the six life stages of Pacific salmon',
      'Explain the concept of anadromy and why it makes salmon vulnerable',
      'Connect habitat quality at each life stage to population health',
    ],
    standards: 'NGSS MS-LS1-4, MS-LS2-4',
  },
  {
    slug: 'treaty-rights',
    title: 'Treaty Rights & Co-Management',
    grades: 'Grades 9–12 / Adult',
    time: '25 min',
    subjects: ['Social Studies', 'Civics', 'Environmental Justice'],
    objectives: [
      'Summarize the key provisions of the 1855 Pacific Northwest treaties',
      'Explain the significance of the 1974 Boldt Decision for tribal fishing rights',
      'Describe how co-management works in practice and why it matters for salmon',
    ],
    standards: 'CCSS RH.9-10.6, C3 D2.His.5.9-12, WA EALRs 4.1 & 4.3',
  },
];

const ACTIVITIES = [
  {
    title: 'Live Data Exploration',
    description:
      'Use the Salmon Health Dashboard to explore real population trends for a local watershed. Students compare multi-year data, identify patterns, and form hypotheses about causes.',
    grade: 'Grades 6–12',
    time: '30–45 min',
    link: '/dashboard',
    linkLabel: 'Open Dashboard',
  },
  {
    title: 'Watershed Mapping',
    description:
      'Use the interactive map on the dashboard to locate Puget Sound watersheds. Students research one watershed, identify the tribal nations with treaty rights there, and summarize current salmon health status.',
    grade: 'Grades 5–10',
    time: '45–60 min',
    link: '/dashboard',
    linkLabel: 'Open Map',
  },
  {
    title: 'Treaty Text Primary Source Analysis',
    description:
      'Read excerpts from the Medicine Creek or Point Elliott treaties alongside excerpts from the Boldt Decision. Students analyze how the same treaty language was interpreted differently by state and tribal parties over 120 years.',
    grade: 'Grades 9–12',
    time: '45–60 min',
    link: '/learn/treaty-rights',
    linkLabel: 'Module Background',
  },
  {
    title: 'Salmon Life Cycle Field Observation',
    description:
      'If you are near a salmon-bearing stream, plan a fall spawning observation. Use the life cycle module as pre-reading. Students record observations and connect to population data from the dashboard.',
    grade: 'Grades 4–8',
    time: '1–2 hours + field time',
    link: '/learn/salmon-life-cycle',
    linkLabel: 'Module Background',
  },
];

const RESOURCES = [
  {
    title: 'Salmon Life Cycle — Educator Guide',
    description: 'Discussion questions, activity templates, and vocabulary list for the Salmon Life Cycle module.',
    format: 'PDF — coming in M6',
    available: false,
  },
  {
    title: 'Treaty Rights — Educator Guide',
    description: 'Primary source excerpts, stakeholder role cards for the simulation activity, and timeline template.',
    format: 'PDF — coming in M6',
    available: false,
  },
  {
    title: 'Dashboard Data Activity Worksheet',
    description: 'Structured worksheet guiding students through reading the dashboard, interpreting trends, and forming evidence-based claims.',
    format: 'PDF — coming in M6',
    available: false,
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EducatorsPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/learn" className="text-primary hover:underline">Learn</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">Resources for Educators</span>
        </nav>

        <PageHeader
          title="Resources for Educators"
          description="Lesson guides, live-data activities, and standards alignment for teaching about Puget Sound salmon — from biology to treaty rights."
        />

        {/* How to use */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-10">
          <h2 className="font-bold text-gray-800 mb-2">How to Use These Materials</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Each learning module on this site is designed to stand alone as a 15–25 minute reading
            suitable for independent or guided classroom use. The modules connect to the live
            Salmon Health Dashboard for data-literacy extensions. Discussion questions and activity
            ideas are embedded in each module under the &quot;For Educators&quot; section.
            Downloadable lesson plans and worksheets are in development (see below).
          </p>
        </div>

        {/* Module overview */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-6">Learning Modules</h2>
          <div className="space-y-4">
            {MODULES.map((mod) => (
              <div
                key={mod.slug}
                className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row md:items-start gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      {mod.grades}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      {mod.time}
                    </span>
                    {mod.subjects.map((s) => (
                      <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-primary text-lg mb-2">{mod.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">Standards: {mod.standards}</p>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                      Learning Objectives
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {mod.objectives.map((obj) => (
                        <li key={obj} className="flex gap-2">
                          <span className="shrink-0 text-primary mt-0.5">›</span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Link
                  href={`/learn/${mod.slug}`}
                  className="shrink-0 self-start text-sm font-semibold text-primary border border-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                  aria-label={`Open module: ${mod.title}`}
                >
                  Open Module →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Activity ideas */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-6">Classroom Activity Ideas</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {ACTIVITIES.map((act) => (
              <div key={act.title} className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col">
                <h3 className="font-bold text-gray-800 mb-1">{act.title}</h3>
                <div className="flex gap-3 mb-3 text-xs text-gray-500">
                  <span>{act.grade}</span>
                  <span>·</span>
                  <span>{act.time}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed flex-1 mb-4">
                  {act.description}
                </p>
                <Link
                  href={act.link}
                  className="self-start text-xs font-semibold text-primary hover:underline"
                >
                  {act.linkLabel} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Downloadable resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-2">Downloadable Resources</h2>
          <p className="text-sm text-gray-500 mb-6">
            Educator guides and worksheets are in development and will be available for download
            when content is finalized.
          </p>
          <div className="space-y-3">
            {RESOURCES.map((res) => (
              <div
                key={res.title}
                className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4 opacity-70"
              >
                <div className="shrink-0 w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500 text-xs font-bold">PDF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-700 text-sm">{res.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{res.description}</p>
                </div>
                <span className="shrink-0 text-xs text-gray-400 mt-0.5 whitespace-nowrap">
                  {res.format}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Partnership / contact */}
        <div className="bg-primary text-white rounded-lg p-8">
          <h2 className="text-xl font-bold mb-2">Bring This Into Your Classroom</h2>
          <p className="text-sm leading-relaxed mb-4 text-gray-200">
            Are you a teacher or curriculum specialist who would like to pilot these materials?
            We&apos;d love to work with you — please reach out to discuss.
          </p>
          <a
            href="mailto:education@pugetsalmonhealth.org"
            className="inline-block bg-white text-primary px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            Contact the Education Team
          </a>
        </div>

      </div>
    </div>
  );
}
