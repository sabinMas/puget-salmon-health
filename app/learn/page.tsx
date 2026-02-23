import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Learn',
  description:
    'Learn about Pacific salmon — their life cycle, ecological role, treaty rights, and the co-management that protects them across Puget Sound.',
  openGraph: {
    title: 'Learn | Puget Sound Salmon Health',
    description:
      'Learning modules on salmon biology, treaty rights, and watershed data literacy for students, educators, and curious adults.',
    url: '/learn',
  },
};

export default function LearnPage() {
  const modules = [
    {
      slug: 'salmon-life-cycle',
      title: 'Salmon Life Cycle',
      description: 'Follow a salmon\'s journey from egg to ocean and back to spawn.',
      time: '15 min',
      gradeLevel: 'Grades 5-8',
    },
    {
      slug: 'why-salmon-matter',
      title: 'Why Salmon Matter',
      description: 'Ecological, cultural, and economic importance of salmon to Puget Sound.',
      time: '20 min',
      gradeLevel: 'Grades 7-12',
    },
    {
      slug: 'treaty-rights',
      title: 'Treaty Rights & Co-Management',
      description: 'The history of salmon fishing rights and tribal-state co-management.',
      time: '25 min',
      gradeLevel: 'Grades 9-12 / Adult',
    },
    {
      slug: 'reading-the-dashboard',
      title: 'Reading the Dashboard',
      description: 'How to interpret salmon population data and environmental indicators.',
      time: '10 min',
      gradeLevel: 'All ages',
    },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Learn"
          description="Understand the story of salmon — from their life cycle and ecological role to the treaty rights and stewardship that protect them."
        />

        {/* Audience Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-gray-800">
            <strong>For all learners:</strong> These modules are designed to be accessible to
            middle school students while providing depth for adult learners. Educators will find
            lesson ideas and discussion questions within each module.
          </p>
        </div>

        {/* Module Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-primary">Learning Modules</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((module) => (
              <Link key={module.slug} href={`/learn/${module.slug}`}>
                <Card className="hover:shadow-xl transition-all duration-300 h-full">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-primary">{module.title}</h3>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {module.time}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{module.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{module.gradeLevel}</span>
                      <span className="text-primary font-semibold text-sm">Start Module →</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* For Educators */}
        <div className="bg-secondary text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Resources for Educators</h2>
          <p className="mb-6">
            Each learning module includes discussion questions, activity ideas, and connections to
            the dashboard data. Looking for downloadable lesson plans?
          </p>
          <Link
            href="/learn/educators"
            className="inline-block bg-white text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View Educator Resources
          </Link>
        </div>
      </div>
    </div>
  );
}
