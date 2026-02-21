export type WatershedStatus = 'healthy' | 'caution' | 'concern';

export interface Watershed {
  id: string;
  name: string;
  slug: string;
  region: string;
  areaSqKm: number;
  status: WatershedStatus;
}

// Mock health statuses — swapped for real WDFW data in M5
const mockWatersheds: Watershed[] = [
  { id: '1', name: 'Skagit River',                      slug: 'skagit',        region: 'North Sound',   areaSqKm: 8134, status: 'caution'  },
  { id: '2', name: 'Snohomish River',                   slug: 'snohomish',     region: 'Central Sound', areaSqKm: 4851, status: 'concern'  },
  { id: '3', name: 'Lake Washington/Cedar/Sammamish',   slug: 'lake-washington',region: 'Central Sound', areaSqKm: 1265, status: 'concern'  },
  { id: '4', name: 'Green/Duwamish River',              slug: 'green-duwamish',region: 'Central Sound', areaSqKm: 1945, status: 'concern'  },
  { id: '5', name: 'Puyallup/White River',              slug: 'puyallup-white',region: 'South Sound',   areaSqKm: 2406, status: 'caution'  },
  { id: '6', name: 'Nisqually River',                   slug: 'nisqually',     region: 'South Sound',   areaSqKm: 1979, status: 'healthy'  },
  { id: '7', name: 'Skokomish River',                   slug: 'skokomish',     region: 'Hood Canal',    areaSqKm: 623,  status: 'concern'  },
  { id: '8', name: 'Stillaguamish River',               slug: 'stillaguamish', region: 'North Sound',   areaSqKm: 1791, status: 'caution'  },
  { id: '9', name: 'Nooksack River',                    slug: 'nooksack',      region: 'North Sound',   areaSqKm: 2145, status: 'caution'  },
];

export async function getWatersheds(): Promise<Watershed[]> {
  return mockWatersheds;
}

export async function getWatershedBySlug(slug: string): Promise<Watershed | undefined> {
  return mockWatersheds.find((w) => w.slug === slug);
}