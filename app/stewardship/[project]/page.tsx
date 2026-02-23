// Server component — data fetched at request time.

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHeader }         from '@/components/ui/PageHeader';
import { getProjects }        from '@/lib/data/projects';
import { getWatershedBySlug } from '@/lib/data/watersheds';
import type { ProjectType }   from '@/types';

// ── Constants ─────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<ProjectType, string> = {
  habitat_restoration: 'Habitat Restoration',
  monitoring:          'Monitoring',
  climate_adaptation:  'Climate Adaptation',
  youth_education:     'Youth Education',
  hatchery:            'Hatchery',
  research:            'Research',
};

const TYPE_COLORS: Record<ProjectType, string> = {
  habitat_restoration: 'bg-green-100 text-green-800',
  monitoring:          'bg-blue-100 text-blue-800',
  climate_adaptation:  'bg-orange-100 text-orange-800',
  youth_education:     'bg-purple-100 text-purple-800',
  hatchery:            'bg-teal-100 text-teal-800',
  research:            'bg-gray-100 text-gray-800',
};

function slugToName(slug: string): string {
  return slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ project: string }>;
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { project: slug } = await params;
  const project = getProjects().find((p) => p.slug === slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.title} | Stewardship | Puget Sound Salmon Health`,
    description: project.excerpt,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ProjectPage({ params }: PageProps) {
  const { project: slug } = await params;
  const project = getProjects().find((p) => p.slug === slug);
  if (!project) notFound();

  const watershed = await getWatershedBySlug(project.watershedId);

  const typeLabel = TYPE_LABELS[project.type];
  const typeColor = TYPE_COLORS[project.type];
  const tribeNames = project.tribeIds.map(slugToName);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <nav className="mb-4 text-sm flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/stewardship" className="text-primary hover:underline">
            Stewardship
          </Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">{project.title}</span>
        </nav>

        {/* Header + status badge */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <PageHeader title={project.title} description={project.excerpt} />
          <span
            className={`shrink-0 mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              project.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span aria-hidden="true">{project.status === 'active' ? '●' : '✓'}</span>
            {project.status === 'active' ? 'Active' : 'Completed'}
          </span>
        </div>

        {/* Meta pills — type, watershed */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColor}`}>
            {typeLabel}
          </span>
          {watershed && (
            <Link
              href={`/dashboard/${project.watershedId}`}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 hover:bg-teal-100 transition-colors"
            >
              {watershed.name} Watershed ↗
            </Link>
          )}
        </div>

        {/* Project overview */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-primary mb-4">Project Overview</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-6">{project.excerpt}</p>
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
            <p className="text-sm font-medium mb-1">Full project story coming soon</p>
            <p className="text-xs">
              Detailed narrative, goals, timeline, and photos will be added as this site grows.
            </p>
          </div>
        </div>

        {/* Impact metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-primary mb-4">Project Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-primary mb-1">2021</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Year Started</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5 text-center">
              <p className="text-lg font-bold text-primary mb-1">
                {tribeNames.join(', ')}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                {tribeNames.length === 1 ? 'Lead Organization' : 'Lead Organizations'}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-primary mb-1 capitalize">{project.status}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Project Status</p>
            </div>
          </div>
        </div>

        {/* Related watershed */}
        {watershed && (
          <div className="bg-surface border border-gray-200 rounded-lg p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-primary mb-1">Watershed Data</h2>
              <p className="text-sm text-gray-600">
                This project operates in the{' '}
                <strong>{watershed.name}</strong> watershed ({watershed.region}).
                View current salmon health indicators and environmental conditions.
              </p>
            </div>
            <Link
              href={`/dashboard/${project.watershedId}`}
              className="shrink-0 text-sm font-semibold text-primary border border-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
            >
              View Basin →
            </Link>
          </div>
        )}

        {/* Footer nav */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Link href="/stewardship" className="text-primary hover:underline text-sm">
            ← Back to Stewardship
          </Link>
          <Link href="/learn/salmon-life-cycle" className="text-primary hover:underline text-sm">
            Learn about salmon recovery →
          </Link>
        </div>

      </div>
    </div>
  );
}
