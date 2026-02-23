// Server component — data is fetched at request time and passed directly to
// client chart components. No useEffect / useState needed here.

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHeader }       from '@/components/ui/PageHeader';
import { SalmonMetricCard } from '@/components/dashboard/SalmonMetricCard';
import StatusBadge          from '@/components/ui/StatusBadge';
import { IndicatorChart }   from '@/components/dashboard/IndicatorChart';
import type { ChartDataPoint } from '@/components/dashboard/IndicatorChart';
import { getWatershedBySlug }                     from '@/lib/data/watersheds';
import { getSalmonReturns, salmonDataFetchedAt }  from '@/lib/data/salmon-returns';

// ── Types ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ basin: string }>;
}

// ── Constants ─────────────────────────────────────────────────────────────────

// Species IDs correspond to lib/data/salmon-returns.ts
const SPECIES = [
  { id: '1', name: 'Chinook',   color: '#1b5e5e' },
  { id: '2', name: 'Coho',      color: '#16a34a' },
  { id: '3', name: 'Chum',      color: '#0284c7' },
  { id: '4', name: 'Pink',      color: '#db2777' },
  { id: '5', name: 'Sockeye',   color: '#ea580c' },
  { id: '6', name: 'Steelhead', color: '#7c3aed' },
] as const;

// Synthetic env data — replaced by USGS real data in M5
const TEMP_DATA: ChartDataPoint[] = [
  { year: 2015, value: 11.8 }, { year: 2016, value: 12.3 },
  { year: 2017, value: 11.6 }, { year: 2018, value: 12.9 },
  { year: 2019, value: 13.4 }, { year: 2020, value: 12.7 },
  { year: 2021, value: 13.8 }, { year: 2022, value: 14.2 },
  { year: 2023, value: 13.9 }, { year: 2024, value: 14.5 },
];

const FLOW_DATA: ChartDataPoint[] = [
  { year: 2015, value: 8.4 }, { year: 2016, value: 9.1 },
  { year: 2017, value: 10.3 }, { year: 2018, value: 7.8 },
  { year: 2019, value: 8.9 }, { year: 2020, value: 9.6 },
  { year: 2021, value: 6.9 }, { year: 2022, value: 7.4 },
  { year: 2023, value: 8.3 }, { year: 2024, value: 7.9 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch { return ''; }
}

function aggregateByYear(
  returns: Awaited<ReturnType<typeof getSalmonReturns>>,
): ChartDataPoint[] {
  const byYear = new Map<number, number>();
  for (const r of returns) {
    byYear.set(r.year, (byYear.get(r.year) ?? 0) + r.countEstimate);
  }
  return Array.from(byYear.entries())
    .map(([year, value]) => ({ year, value }))
    .sort((a, b) => a.year - b.year);
}

function fmt(n: number) {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { basin } = await params;
  const watershed = await getWatershedBySlug(basin);
  if (!watershed) return { title: 'Basin Not Found' };
  return {
    title: `${watershed.name} | Dashboard | Puget Sound Salmon Health`,
    description: `Salmon return trends and environmental conditions for the ${watershed.name} watershed in ${watershed.region}.`,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BasinPage({ params }: PageProps) {
  const { basin } = await params;
  const watershed = await getWatershedBySlug(basin);
  if (!watershed) notFound();

  // Fetch all returns for this watershed, then split by species
  const allReturns = await getSalmonReturns(watershed.id);

  // Main chart: Chinook only
  const chinookReturns = allReturns.filter((r) => r.speciesId === '1');
  const chinookData    = aggregateByYear(chinookReturns);

  // Per-species data for the breakdown grid
  const speciesData = SPECIES.map((sp) => ({
    ...sp,
    data: aggregateByYear(allReturns.filter((r) => r.speciesId === sp.id)),
  }));

  // Metric values derived from the data
  const latest2024        = chinookData.find((d) => d.year === 2024);
  const prev2024          = chinookData.find((d) => d.year === 2023);
  const chinookTrend: 'up' | 'down' | 'stable' =
    latest2024 && prev2024
      ? latest2024.value > prev2024.value ? 'up'
      : latest2024.value < prev2024.value ? 'down'
      : 'stable'
    : 'stable';

  const allSpecies2024 = allReturns
    .filter((r) => r.year === 2024)
    .reduce((sum, r) => sum + r.countEstimate, 0);

  // Map watershed status → PopulationStatus (StatusBadge type)
  const badgeStatus = {
    healthy: 'stable',
    caution: 'threatened',
    concern: 'critical',
  }[watershed.status] as 'stable' | 'threatened' | 'critical';

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <nav className="mb-4 text-sm flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-primary hover:underline">
            Dashboard
          </Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">{watershed.name}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between mb-8 gap-4">
          <PageHeader
            title={`${watershed.name} Basin`}
            description={`Salmon health indicators and environmental conditions for the ${watershed.name} watershed in ${watershed.region}. Area: ${watershed.areaSqKm.toLocaleString()} km².`}
          />
          <StatusBadge status={badgeStatus} />
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SalmonMetricCard
            label="Chinook Returns (2024)"
            value={latest2024 ? fmt(latest2024.value) : '—'}
            unit="fish"
            trend={chinookTrend}
            tooltipText="Estimated Chinook salmon returning to spawn in 2024, based on WDFW spawner surveys."
            href={`/dashboard/${basin}`}
          />
          <SalmonMetricCard
            label="All Species (2024)"
            value={fmt(allSpecies2024)}
            unit="fish"
            tooltipText="Estimated total salmon returns across all 6 species in 2024."
          />
          <SalmonMetricCard
            label="Watershed Area"
            value={watershed.areaSqKm.toLocaleString()}
            unit="km²"
            tooltipText="Total drainage area of the watershed in square kilometres."
          />
        </div>

        {/* Primary chart — Chinook returns */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-1 text-primary">
            Chinook Returns — {watershed.name}
          </h2>
          <p className="text-sm text-gray-500 mb-6">2015 – 2024 · Annual estimated spawner counts</p>
          <IndicatorChart
            data={chinookData}
            title={`Chinook Returns — ${watershed.name}`}
            unit="fish"
            color="#1b5e5e"
            height={320}
            variant="area"
            interpretation="Estimated Chinook salmon returning to spawn each year based on WDFW spawner surveys. Chinook are the primary focus of recovery efforts and the species most important for tribal subsistence and cultural practices."
            source={`WDFW Salmonid Population Indicators (SPI) — data.wa.gov${salmonDataFetchedAt ? ` · Refreshed ${fmtDate(salmonDataFetchedAt)}` : ''}`}
          />
        </div>

        {/* Species breakdown grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Returns by Species</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {speciesData.map((sp) => (
              <div key={sp.id} className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="text-base font-semibold text-gray-800 mb-3">{sp.name}</h3>
                <IndicatorChart
                  data={sp.data}
                  title={`${sp.name} Returns`}
                  unit="fish"
                  color={sp.color}
                  height={160}
                  variant="line"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Indicators */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Environmental Conditions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Late-Summer Stream Temperature
              </h3>
              <IndicatorChart
                data={TEMP_DATA}
                title="Late-Summer Stream Temperature"
                unit="°C"
                color="#ea580c"
                height={200}
                variant="line"
                interpretation="Temperatures above 18°C cause physiological stress for adult salmon. A warming trend is visible over the monitoring period."
                source="Synthetic historical data — USGS NWIS annual summaries planned"
              />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Annual Streamflow</h3>
              <IndicatorChart
                data={FLOW_DATA}
                title="Annual Streamflow"
                unit="kcfs"
                color="#0ea5e9"
                height={200}
                variant="line"
                interpretation="Low flow years reduce spawning habitat availability and concentrate contaminants, increasing mortality risk for all life stages."
                source="Synthetic historical data — USGS NWIS annual summaries planned"
              />
            </div>
          </div>
        </div>

        {/* Stewardship link */}
        <div className="bg-surface border-l-4 border-secondary rounded-r-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-primary mb-2">Restoration & Stewardship</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            Habitat restoration, hatchery programs, and monitoring projects are active across the
            {' '}{watershed.name} watershed. Tribal nations hold treaty-protected fishing rights
            and co-manage salmon populations under the Boldt Decision.
          </p>
          <Link href="/stewardship" className="text-primary font-semibold hover:underline text-sm">
            View Stewardship Projects →
          </Link>
        </div>

        {/* Footer nav */}
        <div className="flex flex-wrap items-center justify-between gap-y-2">
          <Link href="/dashboard" className="text-primary hover:underline text-sm">
            ← Back to Dashboard
          </Link>
          <Link href="/learn/salmon-life-cycle" className="text-primary hover:underline text-sm">
            Learn about the salmon life cycle →
          </Link>
        </div>

      </div>
    </div>
  );
}
