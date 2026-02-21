// Replaces GET /api/usgs in app.js
// Proxies USGS NWIS; parses raw response into a flat station array
// Puget Sound bounding box: lon -123.2→-121.5, lat 46.8→48.5

export const revalidate = 900;

interface Station {
  siteCode: string;
  siteName: string;
  latitude: number;
  longitude: number;
  temperature: number;
  dateTime: string;
  streamName: string;
}

export async function GET() {
  try {
    const params = new URLSearchParams({
      format: "json",
      stateCd: "WA",
      parameterCd: "00010", // water temperature °C
      siteStatus: "active",
      bBox: "-123.2,46.8,-121.5,48.5",
    });

    const res = await fetch(
      `https://waterservices.usgs.gov/nwis/iv/?${params}`,
      { next: { revalidate: 900 } }
    );
    if (!res.ok)
      throw new Error(`USGS API error: ${res.status} ${res.statusText}`);

    const data = await res.json();

    const stations: Station[] = (data?.value?.timeSeries ?? [])
      .map((station: Record<string, unknown>) => {
        try {
          const site = station.sourceInfo as Record<string, unknown>;
          const valArr = station.values as Array<{ value: Array<{ value: string; dateTime: string }> }>;
          const values = valArr?.[0]?.value;
          if (!values || values.length === 0) return null;

          const latest = values[values.length - 1];
          const temperature = parseFloat(latest.value);
          if (isNaN(temperature)) return null;

          const siteCode = (site.siteCode as Array<{ value: string }>)[0].value;
          const geo = (site.geoLocation as { geogLocation: { latitude: string; longitude: string } }).geogLocation;

          return {
            siteCode,
            siteName: site.siteName as string,
            latitude: parseFloat(geo.latitude),
            longitude: parseFloat(geo.longitude),
            temperature,
            dateTime: latest.dateTime,
            streamName: site.siteName as string,
          } satisfies Station;
        } catch {
          return null;
        }
      })
      .filter((s: Station | null): s is Station => s !== null);

    return Response.json(stations);
  } catch (err) {
    console.error("[/api/usgs]", err);
    return Response.json({ error: String(err) }, { status: 502 });
  }
}
