import type { Metadata } from 'next';
import Link from 'next/link';
import { SalmonMetricCard } from '@/components/dashboard/SalmonMetricCard';
import { getWatersheds } from '@/lib/data/watersheds';
import { getSalmonReturns } from '@/lib/data/salmon-returns';
import { getProjects } from '@/lib/data/projects';

export const metadata: Metadata = {
  title: { absolute: 'Puget Sound Salmon Health' },
  description:
    'Track salmon populations, stream temperatures, and watershed health across ' +
    'Puget Sound watersheds using real data from WDFW and USGS.',
  openGraph: {
    title: 'Puget Sound Salmon Health',
    description:
      'Track salmon populations, stream temperatures, and watershed health across ' +
      'Puget Sound watersheds using real data from WDFW and USGS.',
    url: '/',
  },
};

export default async function Home() {
  const watersheds = await getWatersheds();
  const recentReturns = await getSalmonReturns(undefined, undefined, 2024, 2024);
  const totalReturns = recentReturns.reduce((sum, r) => sum + r.countEstimate, 0);
  const projects = getProjects();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-bold mb-6">How Are the Salmon?</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Tracking salmon health across Puget Sound — real data from WDFW, USGS, and ongoing
            restoration projects working to bring these fish back.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore the Dashboard
            </Link>
            <Link
              href="/stewardship"
              className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>

      {/* At-a-Glance Pulse */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">At a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SalmonMetricCard
              label="Total Returns (2024)"
              value={totalReturns.toLocaleString()}
              unit="fish"
              trend="stable"
              tooltipText="Estimated total salmon returns across all monitored watersheds and species for 2024"
              href="/dashboard"
            />
            <SalmonMetricCard
              label="Watersheds Monitored"
              value={watersheds.length}
              tooltipText="Number of major watershed basins tracked in this dashboard"
              href="/dashboard"
            />
            <SalmonMetricCard
              label="Stewardship Projects"
              value={projects.length}
              tooltipText="Ongoing salmon restoration and monitoring projects across Puget Sound"
              href="/stewardship"
            />
          </div>
        </div>
      </section>

      {/* Two-Pillar Introduction */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Data Pillar */}
          <div className="bg-surface border border-gray-200 rounded-lg p-8">
            <div className="text-4xl mb-4" aria-hidden="true">📊</div>
            <h2 className="text-2xl font-bold mb-4 text-primary">The Data</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Real-time and historical data on salmon populations, water quality, stream
              temperatures, and habitat conditions across Puget Sound watersheds. Integrated from
              WDFW, USGS, and tribal monitoring programs.
            </p>
            <Link
              href="/dashboard"
              className="inline-block text-primary font-semibold hover:underline"
            >
              Explore Dashboard →
            </Link>
          </div>

          {/* Projects Pillar */}
          <div className="bg-surface border border-gray-200 rounded-lg p-8">
            <div className="text-4xl mb-4" aria-hidden="true">🌊</div>
            <h2 className="text-2xl font-bold mb-4 text-primary">The Projects</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Habitat restoration, hatchery programs, water quality monitoring, and youth education
              initiatives are working to recover salmon across Puget Sound. See what&apos;s happening
              in each watershed.
            </p>
            <Link
              href="/stewardship"
              className="inline-block text-primary font-semibold hover:underline"
            >
              View Stewardship Projects →
            </Link>
          </div>
        </div>
      </section>

      {/* How to Use This Site */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            How to Use This Site
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4" aria-hidden="true">📈</div>
              <h3 className="text-xl font-semibold mb-2">Check the Data</h3>
              <p className="text-gray-700">
                See current salmon populations, water conditions, and long-term trends for your
                watershed.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4" aria-hidden="true">📚</div>
              <h3 className="text-xl font-semibold mb-2">Learn the Story</h3>
              <p className="text-gray-700">
                Understand salmon ecology, treaty rights, and why salmon recovery matters to all of
                us.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4" aria-hidden="true">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Explore Projects</h3>
              <p className="text-gray-700">
                Discover ongoing restoration, monitoring, and education initiatives working to bring
                salmon back.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
