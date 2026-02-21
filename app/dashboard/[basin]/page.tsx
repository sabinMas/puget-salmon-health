import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { SalmonMetricCard } from '@/components/dashboard/SalmonMetricCard';
import { getWatershedBySlug } from '@/lib/data/watersheds';

interface BasinPageProps {
  params: Promise<{
    basin: string;
  }>;
}

export default async function BasinPage(props: BasinPageProps) {
  const params = await props.params;
  const watershed = await getWatershedBySlug(params.basin);

  if (!watershed) {
    notFound();
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title={`${watershed.name} Basin`}
          description={`Salmon health indicators and environmental conditions for the ${watershed.name} watershed in ${watershed.region}.`}
        />

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <a href="/dashboard" className="text-primary hover:underline">
            Dashboard
          </a>
          <span className="mx-2 text-gray-500">→</span>
          <span className="text-gray-700">{watershed.name}</span>
        </nav>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SalmonMetricCard
            label="Chinook Returns (2024)"
            value="2,847"
            unit="fish"
            trend="up"
          />
          <SalmonMetricCard
            label="Water Temperature"
            value="58.2"
            unit="°F"
            trend="stable"
          />
          <SalmonMetricCard
            label="Watershed Area"
            value={watershed.areaSqKm.toLocaleString()}
            unit="km²"
          />
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Salmon Returns Over Time</h2>
          <div className="h-96 flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-300">
            <p className="text-gray-500">Basin-specific chart for {watershed.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
