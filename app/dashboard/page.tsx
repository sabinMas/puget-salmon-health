'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader }        from '@/components/ui/PageHeader';
import { SalmonMetricCard }  from '@/components/dashboard/SalmonMetricCard';
import { WatershedSelector } from '@/components/dashboard/WatershedSelector';
import { SpeciesFilter }     from '@/components/dashboard/SpeciesFilter';
import { IndicatorChart }    from '@/components/dashboard/IndicatorChart';
import type { ChartDataPoint } from '@/components/dashboard/IndicatorChart';
import { getWatersheds }                        from '@/lib/data/watersheds';
import { getSalmonReturns, salmonDataFetchedAt } from '@/lib/data/salmon-returns';
import type { Watershed }                        from '@/lib/data/watersheds';

// ── Leaflet map (window-dependent — ssr:false) ────────────────────────────────
const WatershedMap = dynamic(
  () => import('@/components/dashboard/WatershedMap').then((m) => m.WatershedMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full mb-8 bg-gray-100 animate-pulse rounded-lg border border-gray-200 h-[280px] sm:h-[380px]"
        aria-label="Loading watershed map…"
      />
    ),
  },
);

// ── USGS types + watershed bounding boxes ─────────────────────────────────────

interface UsgsStation {
  siteCode: string;
  siteName: string;
  latitude: number;
  longitude: number;
  temperature: number;
  dateTime: string;
}

// Approximate lat/lon bounding boxes for each watershed slug (used to filter
// nearby USGS stations when a specific watershed is selected).
const WATERSHED_BOUNDS: Record<string, { minLat: number; maxLat: number; minLon: number; maxLon: number }> = {
  'skagit':          { minLat: 48.2, maxLat: 48.9, minLon: -122.2, maxLon: -121.2 },
  'snohomish':       { minLat: 47.8, maxLat: 48.2, minLon: -122.2, maxLon: -121.7 },
  'lake-washington': { minLat: 47.4, maxLat: 47.8, minLon: -122.3, maxLon: -121.9 },
  'green-duwamish':  { minLat: 47.1, maxLat: 47.6, minLon: -122.2, maxLon: -121.8 },
  'puyallup-white':  { minLat: 46.9, maxLat: 47.3, minLon: -122.4, maxLon: -121.5 },
  'nisqually':       { minLat: 46.8, maxLat: 47.2, minLon: -123.0, maxLon: -122.0 },
  'skokomish':       { minLat: 47.3, maxLat: 47.6, minLon: -123.4, maxLon: -123.0 },
  'stillaguamish':   { minLat: 48.0, maxLat: 48.4, minLon: -122.3, maxLon: -121.7 },
  'nooksack':        { minLat: 48.5, maxLat: 49.0, minLon: -122.6, maxLon: -122.0 },
};

function medianTemp(stations: UsgsStation[]): number {
  const sorted = [...stations].sort((a, b) => a.temperature - b.temperature);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1].temperature + sorted[mid].temperature) / 2
    : sorted[mid].temperature;
}

function fmtDate(iso: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch { return ''; }
}

function fmtDateTime(iso: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    });
  } catch { return ''; }
}

// ── Static data ───────────────────────────────────────────────────────────────

interface Species { id: string; commonName: string; slug: string; }

const SPECIES: Species[] = [
  { id: '1', commonName: 'Chinook',   slug: 'chinook'   },
  { id: '2', commonName: 'Coho',      slug: 'coho'      },
  { id: '3', commonName: 'Chum',      slug: 'chum'      },
  { id: '4', commonName: 'Pink',      slug: 'pink'      },
  { id: '5', commonName: 'Sockeye',   slug: 'sockeye'   },
  { id: '6', commonName: 'Steelhead', slug: 'steelhead' },
];

// Synthetic environmental time-series (replaced by USGS real data in M5)
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

// ── Aggregation helper ────────────────────────────────────────────────────────

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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [selectedWatershed, setSelectedWatershed] = useState('all');
  const [selectedSpecies,   setSelectedSpecies]   = useState('all');
  const [watersheds,  setWatersheds]  = useState<Watershed[]>([]);
  const [chartData,   setChartData]   = useState<ChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [pageLoading,  setPageLoading]  = useState(true);

  // USGS live temperature state
  const [usgsStations,    setUsgsStations]    = useState<UsgsStation[]>([]);
  const [usgsTempLoading, setUsgsTempLoading] = useState(true);
  const [usgsTempError,   setUsgsTempError]   = useState(false);

  // Load watershed list once
  useEffect(() => {
    getWatersheds().then((data) => {
      setWatersheds(data);
      setPageLoading(false);
    });
  }, []);

  // Fetch USGS temperature stations once on mount
  useEffect(() => {
    fetch('/api/usgs')
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          setUsgsStations(data as UsgsStation[]);
        } else {
          setUsgsTempError(true);
        }
      })
      .catch(() => setUsgsTempError(true))
      .finally(() => setUsgsTempLoading(false));
  }, []);

  // Re-fetch + aggregate salmon return data whenever filters change
  useEffect(() => {
    if (!watersheds.length) return;

    async function loadChart() {
      setChartLoading(true);

      const ws = selectedWatershed === 'all'
        ? undefined
        : watersheds.find((w) => w.slug === selectedWatershed)?.id;

      const sp = selectedSpecies === 'all'
        ? undefined
        : SPECIES.find((s) => s.slug === selectedSpecies)?.id;

      const returns = await getSalmonReturns(ws, sp);
      setChartData(aggregateByYear(returns));
      setChartLoading(false);
    }

    loadChart();
  }, [selectedWatershed, selectedSpecies, watersheds]);

  // Derive current temperature from USGS stations for the selected watershed
  const currentTempInfo = useMemo(() => {
    if (usgsStations.length === 0) return null;
    let relevant = usgsStations;
    if (selectedWatershed !== 'all') {
      const bounds = WATERSHED_BOUNDS[selectedWatershed];
      if (bounds) {
        const nearby = usgsStations.filter(
          (s) =>
            s.latitude  >= bounds.minLat && s.latitude  <= bounds.maxLat &&
            s.longitude >= bounds.minLon && s.longitude <= bounds.maxLon,
        );
        if (nearby.length > 0) relevant = nearby;
      }
    }
    const temp = medianTemp(relevant);
    const dateTime = relevant[0]?.dateTime ?? '';
    return { temp, stationCount: relevant.length, dateTime };
  }, [usgsStations, selectedWatershed]);

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard…</div>
      </div>
    );
  }

  // ── Derived display values ──
  const selectedWatershedName = selectedWatershed === 'all'
    ? 'All Puget Sound'
    : (watersheds.find((w) => w.slug === selectedWatershed)?.name ?? selectedWatershed);

  const selectedSpeciesName = selectedSpecies === 'all'
    ? 'All Species'
    : (SPECIES.find((s) => s.slug === selectedSpecies)?.commonName ?? selectedSpecies);

  const chartTitle = `${selectedSpeciesName} Returns — ${selectedWatershedName}`;

  const latestReturn = chartData.at(-1);
  const prevReturn   = chartData.at(-2);
  const trend: 'up' | 'down' | 'stable' =
    !latestReturn || !prevReturn ? 'stable'
    : latestReturn.value > prevReturn.value ? 'up'
    : latestReturn.value < prevReturn.value ? 'down'
    : 'stable';

  const fiveYearPct = (() => {
    const five = chartData.find((d) => d.year === 2019);
    if (!latestReturn || !five) return null;
    const pct = ((latestReturn.value - five.value) / five.value) * 100;
    return `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%`;
  })();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Salmon Health Dashboard"
          description="Current conditions and trends across Puget Sound watersheds."
        />

        {/* Interactive watershed map */}
        <WatershedMap
          watersheds={watersheds}
          selected={selectedWatershed}
          onChange={setSelectedWatershed}
        />
        <p className="text-xs text-gray-400 -mt-6 mb-8 pl-1">
          Click a watershed polygon to filter the dashboard. Use the dropdown below to select by name.
        </p>

        {/* Filter bar — syncs with map; accessible keyboard fallback */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 sticky top-20 z-10 shadow-sm">
          <div className="grid md:grid-cols-2 gap-6">
            <WatershedSelector
              watersheds={watersheds}
              selected={selectedWatershed}
              onChange={setSelectedWatershed}
            />
            <SpeciesFilter
              species={SPECIES}
              selected={selectedSpecies}
              onChange={setSelectedSpecies}
            />
          </div>
          {/* Basin detail link — appears only when a specific watershed is selected */}
          {selectedWatershed !== 'all' && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Viewing: <strong className="text-primary">{selectedWatershedName}</strong>
              </span>
              <a
                href={`/dashboard/${selectedWatershed}`}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Explore {selectedWatershedName} basin in detail →
              </a>
            </div>
          )}
        </div>

        {/* At-a-Glance Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">
            Current Status
            <span className="text-base font-normal text-gray-500 ml-3">
              {selectedWatershedName} · {selectedSpeciesName}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SalmonMetricCard
              label="Latest Return Estimate (2024)"
              value={latestReturn ? `${(latestReturn.value / 1000).toFixed(1)}k` : '—'}
              unit="fish"
              trend={trend}
              tooltipText="Estimated number of salmon returning to spawn (2024). Aggregated across selected watershed and species."
            />
            <SalmonMetricCard
              label="5-Year Change (2019–2024)"
              value={fiveYearPct ?? '—'}
              trend={fiveYearPct?.startsWith('+') ? 'up' : fiveYearPct?.startsWith('-') ? 'down' : 'stable'}
              tooltipText="Percentage change in estimated returns compared to 5 years ago."
            />
            <SalmonMetricCard
              label={`Current Stream Temperature${currentTempInfo ? ` (${currentTempInfo.stationCount} station${currentTempInfo.stationCount !== 1 ? 's' : ''})` : ''}`}
              value={
                usgsTempLoading ? '…'
                : usgsTempError  ? '—'
                : currentTempInfo ? currentTempInfo.temp.toFixed(1)
                : '—'
              }
              unit="°C"
              trend={
                currentTempInfo && currentTempInfo.temp > 14 ? 'up'
                : currentTempInfo && currentTempInfo.temp < 10 ? 'down'
                : 'stable'
              }
              tooltipText={
                usgsTempError
                  ? 'Stream temperature data could not be loaded from USGS.'
                  : `Median stream temperature across ${currentTempInfo?.stationCount ?? '…'} active USGS monitoring stations${selectedWatershed !== 'all' ? ' in this watershed' : ' across Puget Sound'}. Above 18°C causes physiological stress for salmon.${currentTempInfo?.dateTime ? ` As of ${fmtDateTime(currentTempInfo.dateTime)}.` : ''} Source: USGS NWIS — live data.`
              }
            />
          </div>
        </div>

        {/* Screen-reader announcement for chart updates */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {chartLoading ? 'Loading chart data…' : `Chart updated: ${chartTitle}`}
        </div>

        {/* Primary chart — salmon returns */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-primary">{chartTitle}</h2>
          <IndicatorChart
            data={chartData}
            title={chartTitle}
            unit="fish"
            color="#1b5e5e"
            height={340}
            loading={chartLoading}
            variant="area"
            interpretation="This chart shows estimated annual salmon returns based on WDFW spawner surveys. Upward trends suggest improving habitat or ocean conditions. Downward trends may reflect climate impacts, habitat loss, or reduced hatchery output."
            source={`WDFW Salmonid Population Indicators (SPI) — data.wa.gov${salmonDataFetchedAt ? ` · Refreshed ${fmtDate(salmonDataFetchedAt)}` : ''}`}
          />
        </div>

        {/* Environmental indicators */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Environmental Indicators</h2>
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
                height={220}
                variant="line"
                interpretation="Temperatures above 18°C are physiologically stressful for salmon. Rising late-summer temperatures are a primary climate impact on salmon survival."
                source="Synthetic historical data — USGS NWIS annual summaries planned"
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Annual Streamflow
              </h3>
              <IndicatorChart
                data={FLOW_DATA}
                title="Annual Streamflow"
                unit="kcfs"
                color="#0ea5e9"
                height={220}
                variant="line"
                interpretation="Lower flows reduce the amount of habitat available to spawning and rearing salmon, and increase water temperatures. Drought years show sharp declines."
                source="Synthetic historical data — USGS NWIS annual summaries planned"
              />
            </div>

          </div>
        </div>

        {/* Data Sources */}
        <details className="bg-surface border border-gray-200 rounded-lg p-6">
          <summary className="cursor-pointer font-semibold text-lg text-primary hover:underline">
            Data Sources & Methods
          </summary>
          <div className="mt-4 space-y-2 text-gray-700 text-sm">
            <p>
              <strong>Salmon Returns:</strong> WDFW Salmonid Population Indicators (SPI) — data.wa.gov
              {salmonDataFetchedAt && <span className="text-gray-400"> · Refreshed {fmtDate(salmonDataFetchedAt)}</span>}
            </p>
            <p>
              <strong>Stream Temperature (current):</strong> USGS NWIS — live instantaneous values
              {usgsTempLoading ? ', loading…' : usgsTempError ? ', unavailable' : (
                <span className="text-gray-400">
                  {` · ${usgsStations.length} stations`}
                  {currentTempInfo?.dateTime && ` · As of ${fmtDateTime(currentTempInfo.dateTime)}`}
                </span>
              )}
            </p>
            <p><strong>Stream Temperature (trend chart):</strong> Synthetic historical series — will be replaced with USGS annual summaries in M5.5</p>
            <p><strong>Streamflow:</strong> USGS NWIS — synthetic data (real integration in M5.5)</p>
            <p><strong>Watershed Boundaries:</strong> USGS Watershed Boundary Dataset</p>
          </div>
        </details>

      </div>
    </div>
  );
}
