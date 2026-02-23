'use client';

// This component must only be loaded client-side (no SSR) because Leaflet
// references `window` at import time. Use next/dynamic with ssr:false in the
// parent — see app/dashboard/page.tsx.

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { GeoJsonObject, Feature } from 'geojson';
import type { Layer, Path, LeafletMouseEvent, PathOptions } from 'leaflet';
import type { Watershed, WatershedStatus } from '@/lib/data/watersheds';

// Matches the health colour scale from PLANNING.md §9
const STATUS_COLORS: Record<WatershedStatus, string> = {
  healthy: '#22c55e',
  caution: '#ca8a04',
  concern: '#dc2626',
};

const STATUS_LABELS: Record<WatershedStatus, string> = {
  healthy: 'Stable',
  caution: 'Threatened',
  concern: 'Critical',
};

function featureStyle(ws: Watershed | undefined, isSelected: boolean): PathOptions {
  return {
    fillColor: STATUS_COLORS[ws?.status ?? 'caution'],
    fillOpacity: isSelected ? 0.65 : 0.3,
    color: isSelected ? '#1b5e5e' : '#94a3b8',
    weight: isSelected ? 3 : 1,
  };
}

interface WatershedMapProps {
  watersheds: Watershed[];
  selected: string;        // slug or 'all'
  onChange: (slug: string) => void;
}

export function WatershedMap({ watersheds, selected, onChange }: WatershedMapProps) {
  const [geoJson, setGeoJson] = useState<GeoJsonObject | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch('/data/puget-sound-watersheds.geojson')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setGeoJson)
      .catch(() => setLoadError(true));
  }, []);

  // onEachFeature is recreated when selected changes (because key={selected}
  // remounts the GeoJSON layer), so the closure always captures current state.
  const onEachFeature = useCallback(
    (feature: Feature, layer: Layer) => {
      const ws = watersheds.find(
        (w) => (w.geoJsonName ?? w.name) === feature.properties?.name,
      );
      const isSelected = selected !== 'all' && ws?.slug === selected;
      const path = layer as Path;

      path.bindTooltip(feature.properties?.name ?? 'Watershed', {
        sticky: true,
        direction: 'top',
        className: 'text-sm font-medium',
      });

      layer.on({
        mouseover(e: LeafletMouseEvent) {
          (e.target as Path).setStyle({
            fillOpacity: 0.75,
            weight: 2.5,
            color: '#1b5e5e',
          });
        },
        mouseout(e: LeafletMouseEvent) {
          (e.target as Path).setStyle(featureStyle(ws, isSelected));
        },
        click() {
          if (ws) onChange(ws.slug);
        },
      });
    },
    [watersheds, selected, onChange],
  );

  const selectedWatershed = watersheds.find((w) => w.slug === selected);

  return (
    <div
      className="relative w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-8 h-[280px] sm:h-[380px]"
      aria-label="Interactive map of Puget Sound watersheds. Click a watershed to filter the dashboard."
    >
      {/* Loading / error states */}
      {!geoJson && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <p className="text-gray-500 text-sm">Loading map…</p>
        </div>
      )}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <p className="text-gray-500 text-sm">Map unavailable — use the dropdown below to select a watershed.</p>
        </div>
      )}

      <MapContainer
        center={[47.6, -122.1]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJson && (
          <GeoJSON
            key={selected}
            data={geoJson}
            style={(feature) => {
              const ws = watersheds.find(
                (w) => (w.geoJsonName ?? w.name) === feature?.properties?.name,
              );
              const isSelected = selected !== 'all' && ws?.slug === selected;
              return featureStyle(ws, isSelected);
            }}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      {/* Selected watershed label */}
      {selectedWatershed && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-2 z-[1000] text-sm border border-gray-200">
          <span className="font-semibold text-primary">{selectedWatershed.name}</span>
          <span className="ml-2 text-gray-500">{selectedWatershed.region}</span>
        </div>
      )}

      {/* Reset button */}
      {selected !== 'all' && (
        <button
          onClick={() => onChange('all')}
          className="absolute top-4 right-4 bg-white rounded-lg shadow-md px-3 py-1.5 text-xs font-semibold text-primary hover:bg-gray-50 z-[1000] border border-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          aria-label="Show all watersheds"
        >
          Show all ×
        </button>
      )}

      {/* Legend */}
      <div className="absolute bottom-6 right-4 bg-white rounded-lg shadow-md p-3 z-[1000] text-xs border border-gray-100">
        <p className="font-semibold text-gray-700 mb-2">Chinook Health</p>
        <div className="space-y-1.5">
          {(Object.entries(STATUS_LABELS) as [WatershedStatus, string][]).map(([status, label]) => (
            <div key={status} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-sm border border-gray-200 shrink-0"
                style={{ backgroundColor: STATUS_COLORS[status] }}
              />
              <span className="text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
