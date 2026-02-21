// Replaces GET /api/scrape in app.js
// Aggregates salmon data from multiple public sources in parallel

export const revalidate = 900;

const WDFW_ENDPOINTS: Record<string, string> = {
  escapement:
    "https://data.wa.gov/api/views/fgyz-n3uk/rows.json?$limit=50000",
  populations:
    "https://data.wa.gov/api/views/ncqh-ypvf/rows.json?$limit=50000",
  recoveryGoals:
    "https://data.wa.gov/api/views/d8mu-pcf6/rows.json?$limit=50000",
};

async function safeFetch(url: string): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  try {
    const res = await fetch(url, { next: { revalidate: 900 } });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    return { ok: true, data: await res.json() };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function GET() {
  const results: {
    wdfw: Record<string, unknown>;
    noaa: unknown;
    pugetsoundPartnership: unknown;
    errors: string[];
  } = {
    wdfw: {},
    noaa: null,
    pugetsoundPartnership: null,
    errors: [],
  };

  // WDFW supplemental endpoints
  await Promise.all(
    Object.entries(WDFW_ENDPOINTS).map(async ([key, url]) => {
      const r = await safeFetch(url);
      if (r.ok) {
        results.wdfw[key] = r.data;
      } else {
        results.errors.push(`wdfw.${key}: ${r.error}`);
      }
    })
  );

  // NOAA Fisheries content API
  const noaa = await safeFetch(
    "https://www.fisheries.noaa.gov/api/v1/content?api_key=anonymous&q=chinook+puget+sound&type=data&size=10"
  );
  if (noaa.ok) {
    results.noaa = noaa.data;
  } else {
    results.errors.push(`noaa: ${noaa.error}`);
  }

  // Puget Sound Partnership Vital Signs (WA open data)
  const psp = await safeFetch(
    "https://data.wa.gov/api/views/rqgb-pnqn/rows.json?$limit=1000"
  );
  if (psp.ok) {
    results.pugetsoundPartnership = psp.data;
  } else {
    results.errors.push(`pugetsoundPartnership: ${psp.error}`);
  }

  return Response.json(results);
}
