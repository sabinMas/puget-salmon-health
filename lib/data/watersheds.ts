export type WatershedStatus = 'healthy' | 'caution' | 'concern';

export interface Watershed {
  id: string;
  name: string;
  slug: string;
  region: string;
  areaSqKm: number;
  status: WatershedStatus;
  /** Exact string used in GeoJSON properties.name — only needed when it differs from `name`. */
  geoJsonName?: string;
}

// Load real salmon returns to derive data-driven watershed status
const returnsFile = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./real/salmon-returns.json') as {
      returns: Array<{ watershedId: string; speciesId: string; year: number; countEstimate: number }>;
    };
  } catch {
    return { returns: [] };
  }
})();

/**
 * Derive watershed status from Chinook (speciesId='1') return trends.
 * Compares recent 3-year average (2022–2024) against 5-year baseline (2017–2021).
 * Falls back to 'concern' when Chinook data is absent.
 */
function computeStatus(watershedId: string): WatershedStatus {
  const chinook = returnsFile.returns.filter(
    (r) => r.watershedId === watershedId && r.speciesId === '1',
  );
  if (chinook.length === 0) return 'concern';

  const byYear = new Map<number, number>();
  for (const r of chinook) {
    byYear.set(r.year, (byYear.get(r.year) ?? 0) + r.countEstimate);
  }

  const recent   = [2022, 2023, 2024].flatMap((y) => (byYear.has(y) ? [byYear.get(y)!] : []));
  const baseline = [2017, 2018, 2019, 2020, 2021].flatMap((y) => (byYear.has(y) ? [byYear.get(y)!] : []));

  if (recent.length === 0 || baseline.length === 0) return 'caution';

  const recentAvg   = recent.reduce((s, v) => s + v, 0) / recent.length;
  const baselineAvg = baseline.reduce((s, v) => s + v, 0) / baseline.length;
  if (baselineAvg === 0) return 'concern';

  const ratio = recentAvg / baselineAvg;
  if (ratio >= 1.15) return 'healthy';
  if (ratio >= 0.70) return 'caution';
  return 'concern';
}

const WATERSHEDS: Watershed[] = [
  { id: '1', name: 'Skagit River',                    slug: 'skagit',          region: 'North Sound',   areaSqKm: 8134, status: computeStatus('1') },
  { id: '2', name: 'Snohomish River',                 slug: 'snohomish',       region: 'Central Sound', areaSqKm: 4851, status: computeStatus('2') },
  { id: '3', name: 'Lake Washington/Cedar/Sammamish', slug: 'lake-washington', region: 'Central Sound', areaSqKm: 1265, status: computeStatus('3'), geoJsonName: 'Cedar-Sammamish River' },
  { id: '4', name: 'Green/Duwamish River',            slug: 'green-duwamish',  region: 'Central Sound', areaSqKm: 1945, status: computeStatus('4'), geoJsonName: 'Duwamish River'        },
  { id: '5', name: 'Puyallup/White River',            slug: 'puyallup-white',  region: 'South Sound',   areaSqKm: 2406, status: computeStatus('5'), geoJsonName: 'Puyallup-White River'  },
  { id: '6', name: 'Nisqually River',                 slug: 'nisqually',       region: 'South Sound',   areaSqKm: 1979, status: computeStatus('6') },
  { id: '7', name: 'Skokomish River',                 slug: 'skokomish',       region: 'Hood Canal',    areaSqKm: 623,  status: computeStatus('7') },
  { id: '8', name: 'Stillaguamish River',             slug: 'stillaguamish',   region: 'North Sound',   areaSqKm: 1791, status: computeStatus('8') },
  { id: '9', name: 'Nooksack River',                  slug: 'nooksack',        region: 'North Sound',   areaSqKm: 2145, status: computeStatus('9') },
];

export async function getWatersheds(): Promise<Watershed[]> {
  return WATERSHEDS;
}

export async function getWatershedBySlug(slug: string): Promise<Watershed | undefined> {
  return WATERSHEDS.find((w) => w.slug === slug);
}
