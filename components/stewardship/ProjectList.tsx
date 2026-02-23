'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Project, ProjectType } from '@/types';

// ── Constants ─────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<ProjectType, string> = {
  habitat_restoration: 'Habitat Restoration',
  monitoring:          'Monitoring',
  climate_adaptation:  'Climate Adaptation',
  youth_education:     'Youth Education',
  hatchery:            'Hatchery',
  research:            'Research',
};

const TYPE_COLORS: Record<ProjectType, { pill: string; filter: string; filterActive: string }> = {
  habitat_restoration: {
    pill:        'bg-green-100 text-green-800',
    filter:      'border-green-200 text-green-800 hover:bg-green-50',
    filterActive: 'bg-green-100 border-green-400 text-green-900 font-semibold',
  },
  monitoring: {
    pill:        'bg-blue-100 text-blue-800',
    filter:      'border-blue-200 text-blue-800 hover:bg-blue-50',
    filterActive: 'bg-blue-100 border-blue-400 text-blue-900 font-semibold',
  },
  climate_adaptation: {
    pill:        'bg-orange-100 text-orange-800',
    filter:      'border-orange-200 text-orange-800 hover:bg-orange-50',
    filterActive: 'bg-orange-100 border-orange-400 text-orange-900 font-semibold',
  },
  youth_education: {
    pill:        'bg-purple-100 text-purple-800',
    filter:      'border-purple-200 text-purple-800 hover:bg-purple-50',
    filterActive: 'bg-purple-100 border-purple-400 text-purple-900 font-semibold',
  },
  hatchery: {
    pill:        'bg-teal-100 text-teal-800',
    filter:      'border-teal-200 text-teal-800 hover:bg-teal-50',
    filterActive: 'bg-teal-100 border-teal-400 text-teal-900 font-semibold',
  },
  research: {
    pill:        'bg-gray-100 text-gray-800',
    filter:      'border-gray-200 text-gray-700 hover:bg-gray-50',
    filterActive: 'bg-gray-100 border-gray-400 text-gray-900 font-semibold',
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProjectWithMeta extends Project {
  tribeNames: string[];
}

interface ProjectListProps {
  projects: ProjectWithMeta[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProjectList({ projects }: ProjectListProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectType | 'all'>('all');

  // Collect only the types present in the data
  const presentTypes = Array.from(new Set(projects.map((p) => p.type))) as ProjectType[];

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.type === activeFilter);

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter projects by type">
        <button
          onClick={() => setActiveFilter('all')}
          aria-pressed={activeFilter === 'all'}
          className={`px-4 py-1.5 rounded-full text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
            activeFilter === 'all'
              ? 'bg-primary text-white border-primary font-semibold'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          All ({projects.length})
        </button>

        {presentTypes.map((type) => {
          const count = projects.filter((p) => p.type === type).length;
          const colors = TYPE_COLORS[type];
          const isActive = activeFilter === type;
          return (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              aria-pressed={isActive}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                isActive ? colors.filterActive : colors.filter
              }`}
            >
              {TYPE_LABELS[type]} ({count})
            </button>
          );
        })}
      </div>

      {/* Project grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 flex flex-col"
          >
            <div className="p-6 flex flex-col flex-1">
              <div className="mb-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${TYPE_COLORS[project.type].pill}`}>
                  {TYPE_LABELS[project.type]}
                </span>
              </div>

              <h3 className="text-lg font-bold text-primary mb-2 leading-snug">
                {project.title}
              </h3>

              <p className="text-sm text-gray-600 mb-2">
                <strong>Led by:</strong> {project.tribeNames.join(', ')}
              </p>

              <p className="text-sm text-gray-700 leading-relaxed flex-1">
                {project.excerpt}
              </p>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  project.status === 'active'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <span aria-hidden="true">{project.status === 'active' ? '● ' : '✓ '}</span>
                  {project.status === 'active' ? 'Active' : 'Completed'}
                </span>
                <Link
                  href={`/stewardship/${project.slug}`}
                  className="text-sm font-semibold text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
                  aria-label={`Learn more about ${project.title}`}
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-12">No projects match this filter.</p>
      )}
    </div>
  );
}
