import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { AttributionBanner } from '@/components/nations/AttributionBanner';
import { ContentSection } from '@/components/nations/ContentSection';
import { SalmonMetricCard } from '@/components/dashboard/SalmonMetricCard';
import { getTribeBySlug } from '@/lib/data/tribes';

interface TribePageProps {
  params: Promise<{
    tribe: string;
  }>;
}

export default async function TribePage(props: TribePageProps) {
  const params = await props.params;
  const tribe = await getTribeBySlug(params.tribe);

  if (!tribe) {
    notFound();
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">{tribe.displayName}</h1>
          {tribe.languageName && (
            <p className="text-xl text-gray-600 italic mb-4">{tribe.languageName}</p>
          )}
          <p className="text-lg text-gray-700">{tribe.tagline}</p>
        </div>

        {/* Attribution Banner */}
        <AttributionBanner tribeName={tribe.displayName} reviewDate="Pending" />

        {/* Introduction Section */}
        <ContentSection
          title="Our Relationship with Salmon"
          tribeName={tribe.displayName}
          sectionType="introduction"
          showPlaceholder={true}
        />

        {/* Historical Practices */}
        <ContentSection
          title="Historical Practices"
          tribeName={tribe.displayName}
          sectionType="historical-practices"
          showPlaceholder={true}
        />

        {/* Salmon Today */}
        <ContentSection
          title="Salmon in Our Community Today"
          tribeName={tribe.displayName}
          sectionType="salmon-today"
          showPlaceholder={true}
        />

        {/* Linked Data - Mini Dashboard */}
        <section className="mb-8 bg-surface border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Salmon in {tribe.displayName}'s Waters
          </h2>
          <p className="text-gray-700 mb-6">
            Key metrics for watersheds within or near {tribe.displayName}'s traditional territory.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SalmonMetricCard label="Chinook Returns" value="1,234" trend="up" />
            <SalmonMetricCard label="Water Temp" value="58°F" trend="stable" />
            <SalmonMetricCard label="Habitat Quality" value="Good" trend="up" />
          </div>
          <div className="mt-6">
            <a
              href="/dashboard"
              className="text-primary font-semibold hover:underline"
            >
              View Full Dashboard Data →
            </a>
          </div>
        </section>

        {/* Stewardship Projects */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Stewardship Projects</h2>
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-600">
              Project cards for {tribe.displayName}-led restoration and monitoring efforts will
              appear here.
            </p>
            <a href="/stewardship" className="text-primary font-semibold hover:underline mt-4 inline-block">
              View All Projects →
            </a>
          </div>
        </section>

        {/* Contact/Learn More */}
        <section className="bg-primary text-white rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">Learn More</h3>
          {tribe.websiteUrl ? (
            <p>
              Visit{' '}
              <a
                href={tribe.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-200"
              >
                {tribe.displayName}'s website
              </a>{' '}
              for more information about their programs and initiatives.
            </p>
          ) : (
            <p>For more information, please contact {tribe.displayName} directly.</p>
          )}
        </section>
      </div>
    </div>
  );
}
