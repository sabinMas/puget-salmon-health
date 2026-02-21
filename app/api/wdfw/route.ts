// Replaces GET /api/wdfw in app.js
// Proxies WDFW SPI Socrata API; response cached 15 min via ISR

export const revalidate = 900;

export async function GET() {
  try {
    const res = await fetch(
      "https://data.wa.gov/api/views/x25s-cxg8/rows.json?$limit=50000",
      { next: { revalidate: 900 } }
    );
    if (!res.ok)
      throw new Error(`WDFW API error: ${res.status} ${res.statusText}`);

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error("[/api/wdfw]", err);
    return Response.json({ error: String(err) }, { status: 502 });
  }
}
