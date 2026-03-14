// GET /api/usgs-history
// Returns annual median water temperature (°C) and stream discharge (cfs)
// from the USGS NWIS Statistics Service for the Puget Sound region.
// Revalidated every 24 hours — annual stats don't change day-to-day.

export const revalidate = 86400;

import { fetchUsgsHistory } from '@/lib/data/usgs-history';

export async function GET() {
  try {
    const data = await fetchUsgsHistory();
    return Response.json(data);
  } catch (err) {
    console.error('[/api/usgs-history]', err);
    return Response.json({ error: String(err) }, { status: 502 });
  }
}
