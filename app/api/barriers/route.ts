// Replaces GET /api/barriers in app.js
// Proxies WSDOT ArcGIS REST fish passage barriers layer

export const revalidate = 900;

export async function GET() {
  try {
    const params = new URLSearchParams({
      where: "1=1",
      outFields:
        "Stream_Name,Road_Name,Barrier_Status_Desc,Source_Name," +
        "LinealGain_Meas,Species,FUCriteria_Desc",
      outSR: "4326",
      f: "json",
      returnGeometry: "true",
    });

    const res = await fetch(
      `https://data.wsdot.wa.gov/arcgis/rest/services/Shared/FishPassageData/MapServer/8/query?${params}`,
      { next: { revalidate: 900 } }
    );
    if (!res.ok)
      throw new Error(`WSDOT API error: ${res.status} ${res.statusText}`);

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error("[/api/barriers]", err);
    return Response.json({ error: String(err) }, { status: 502 });
  }
}
