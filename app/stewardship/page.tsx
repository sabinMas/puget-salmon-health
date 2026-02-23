import type { Metadata } from 'next';
import { PageHeader }  from '@/components/ui/PageHeader';
import { ProjectList } from '@/components/stewardship/ProjectList';
import { getProjects } from '@/lib/data/projects';

export const metadata: Metadata = {
  title: 'Stewardship & Projects',
  description:
    'Salmon recovery projects across Puget Sound — habitat restoration, fish passage, water quality monitoring, and youth education initiatives.',
  openGraph: {
    title: 'Stewardship & Projects | Puget Sound Salmon Health',
    description:
      'Explore ongoing salmon restoration and monitoring projects working to bring salmon back to Puget Sound watersheds.',
    url: '/stewardship',
  },
};

function slugToName(slug: string): string {
  return slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

export default async function StewardshipPage() {
  const rawProjects = getProjects();

  const projects = rawProjects.map((project) => ({
    ...project,
    tribeNames: project.tribeIds.map(slugToName),
  }));

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Stewardship & Projects"
          description="Salmon recovery efforts across Puget Sound — habitat restoration, monitoring, climate adaptation, and youth education."
        />

        <ProjectList projects={projects} />

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-gray-800 text-sm">
            <strong>Note:</strong> This is a curated selection of representative projects. Many more
            restoration, monitoring, and education initiatives are underway across Puget Sound.
          </p>
        </div>
      </div>
    </div>
  );
}
