'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/ui/PageHeader';
import { SalmonMetricCard } from '@/components/dashboard/SalmonMetricCard';
import { WatershedSelector } from '@/components/dashboard/WatershedSelector';
import { SpeciesFilter } from '@/components/dashboard/SpeciesFilter';
import { getWatersheds } from '@/lib/data/watersheds';
import type { Watershed } from '@/lib/data/watersheds';

// Leaflet uses window — must be dynamically imported with ssr:false
const WatershedMap = dynamic(
  () => import('@/components/dashboard/WatershedMap').then((m) => m.WatershedMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full mb-8 bg-gray-100 animate-pulse rounded-lg border border-gray-200" style={{ height: '380px' }} />
    ),
  },
);

interface Species {
  id: string;
  commonName: string;
  slug: string;
}

const SPECIES: Species[] = [
  { id: '1', commonName: 'Chinook',  slug: 'chinook'  },
  { id: '2', commonName: 'Coho',     slug: 'coho'     },
  { id: '3', commonName: 'Chum',     slug: 'chum'     },
  { id: '4', commonName: 'Pink',     slug: 'pink'     },
  { id: '5', commonName: 'Sockeye',  slug: 'sockeye'  },
];

export default function DashboardPage() {
  const [selectedWatershed, setSelectedWatershed] = useState('all');
  const [selectedSpecies, setSelectedSpecies]     = useState('all');
  const [watersheds, setWatersheds]               = useState<Watershed[]>([]);
  const [loading, setLoading]                     = useState(true);

  useEffect(() => {
    getWatersheds().then((data) => {
      setWatersheds(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard…</div>
      </div>
    );
  }

  const selectedWatershedName =
    selectedWatershed === 'all'
      ? 'All Puget Sound'
      : (watersheds.find((w) => w.slug === selectedWatershed)?.name ?? selectedWatershed);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Salmon Health Dashboard"
          description="Current conditions and trends across Puget Sound watersheds."
        />

        {/* Interactive watershed map — click a polygon to filter */}
        <WatershedMap
          watersheds={watersheds}
          selected={selectedWatershed}
          onChange={setSelectedWatershed}
        />

        {/* Filter Bar — stays in sync with map selection; accessible fallback */}
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
        </div>

        {/* At-a-Glance Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Current Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SalmonMetricCard
              label="Latest Return Estimate"
              value="2,847"
              unit="fish"
              trend="up"
              tooltipText="Most recent population count for selected watershed and species"
            />
            <SalmonMetricCard
              label="5-Year Trend"
              value="+12%"
              trend="up"
              tooltipText="Change in average population over the past 5 years"
            />
            <SalmonMetricCard
              label="Water Temperature"
              value="58.2"
              unit="°F"
              trend="stable"
              tooltipText="Average stream temperature — within suitable range for salmon"
            />
          </div>
        </div>

        {/* Primary Chart Placeholder */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Salmon Returns Over Time</h2>
          <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <p className="text-gray-600 text-lg mb-2">Chart coming in M1.2</p>
              <p className="text-gray-500 text-sm">
                Watershed: <strong>{selectedWatershedName}</strong>
              </p>
              <p className="text-gray-500 text-sm">
                Species: <strong>{selectedSpecies === 'all' ? 'All Species' : selectedSpecies}</strong>
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-primary rounded">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>What does this mean?</strong> This chart shows the estimated number of salmon
              returning to spawn each year. Upward trends indicate improving conditions; downward
              trends may signal habitat degradation, climate impacts, or ocean survival challenges.
            </p>
          </div>
        </div>

        {/* Environmental Indicators */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Environmental Indicators</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Stream Temperature Trends</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">Chart coming in M1.2</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Streamflow Patterns</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">Chart coming in M1.2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <details className="bg-surface border border-gray-200 rounded-lg p-6">
          <summary className="cursor-pointer font-semibold text-lg text-primary hover:underline">
            Data Sources & Methods
          </summary>
          <div className="mt-4 space-y-2 text-gray-700">
            <p><strong>Salmon Returns:</strong> WDFW Salmonid Population Indicators (SPI) Database (Mock Data)</p>
            <p><strong>Water Temperature:</strong> USGS National Water Information System</p>
            <p><strong>Streamflow:</strong> USGS NWIS Real-time Data</p>
            <p><strong>Watershed Boundaries:</strong> USGS Watershed Boundary Dataset</p>
            <p className="text-sm text-gray-600 mt-4">
              <strong>Note:</strong> This dashboard currently displays mock data. Live data integration is planned for Phase 2 (M5).
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
