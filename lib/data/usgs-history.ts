/**
 * Fetches annual water temperature and streamflow trends from USGS NWIS
 * for representative Puget Sound monitoring stations.
 *
 * Temperature: USGS Daily Values service (parameterCd=00010, statCd=00003 mean)
 *   Stations: White River/Auburn · N. Fork Tolt/Carnation · Canyon Ck · Taylor Ck · Skykomish
 *
 * Streamflow:  USGS Statistics service (parameterCd=00060, statReportType=annual)
 *   Stations: Skokomish · Nisqually · Green/Cedar · Cedar · Snohomish · Stillaguamish
 *
 * Note on USGS Stats API constraints:
 *   - The stats service (/nwis/stat/) does NOT support bBox or stateCd — only site IDs.
 *   - The DV service (/nwis/dv/) DOES support bBox, but we use specific sites for reliability.
 */

export interface EnvDataPoint {
  year: number;
  value: number;
}

export interface UsgsHistoryData {
  tempTrend: EnvDataPoint[];       // annual mean temp (°C), 2015–2024
  flowTrend: EnvDataPoint[];       // annual mean discharge (cfs), 2015–2024
  tempStationCount: number;
  flowStationCount: number;
  fetchedAt: string;
}

const START_YEAR = 2015;
const END_YEAR   = 2024;

// ── Station sets (verified to have data for 2015–2024 range) ─────────────────

// Temperature: daily values stations with confirmed multi-year records
const TEMP_SITES = [
  '12100490', // White River at R St near Auburn (2015–2024)
  '12147500', // N Fork Tolt River near Carnation (2015–2024)
  '12116100', // Canyon Creek near Cedar Falls (2018–2024)
  '12113415', // Taylor Creek near Selleck (2018–2024)
  '12117000', // Skykomish River near Gold Bar (2022–2024)
].join(',');

// Streamflow: annual-stats stations with confirmed 2015–2024 records
const FLOW_SITES = [
  '12048000', // Skokomish River nr Potlatch
  '12079000', // Goldsborough Creek nr Shelton (S. Puget Sound)
  '12092000', // Green River nr Auburn
  '12116500', // Cedar River nr Renton
  '12134500', // Snohomish River nr Monroe
  '12161500', // Stillaguamish River nr Arlington
].join(',');

// ── Helpers ───────────────────────────────────────────────────────────────────

function median(vals: number[]): number {
  const sorted = [...vals].sort((a, b) => a - b);
  const mid    = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// ── Temperature: parse USGS DV JSON response ──────────────────────────────────

function parseUsgsTemperature(json: unknown): { trend: EnvDataPoint[]; stationCount: number } {
  const timeSeries = (json as { value: { timeSeries: unknown[] } }).value?.timeSeries ?? [];

  // Collect daily values grouped by year, across all stations
  const byYear = new Map<number, number[]>();
  const sites  = new Set<string>();

  for (const ts of timeSeries) {
    const record = ts as {
      sourceInfo: { siteCode: Array<{ value: string }> };
      values: Array<{ value: Array<{ value: string; dateTime: string }> }>;
    };
    const siteCode = record.sourceInfo?.siteCode?.[0]?.value ?? '';
    const values   = record.values?.[0]?.value ?? [];

    for (const v of values) {
      const num  = parseFloat(v.value);
      const year = parseInt(v.dateTime?.slice(0, 4) ?? '', 10);
      if (isNaN(num) || num <= -999 || isNaN(year)) continue;
      if (year < START_YEAR || year > END_YEAR) continue;
      if (!byYear.has(year)) byYear.set(year, []);
      byYear.get(year)!.push(num);
      if (siteCode) sites.add(siteCode);
    }
  }

  const trend: EnvDataPoint[] = [];
  for (let yr = START_YEAR; yr <= END_YEAR; yr++) {
    const vals = byYear.get(yr);
    if (!vals || vals.length === 0) continue;
    trend.push({ year: yr, value: Math.round(median(vals) * 10) / 10 });
  }

  return { trend, stationCount: sites.size };
}

// ── Streamflow: parse USGS Stats RDB response ─────────────────────────────────

function parseUsgsFlow(text: string): { trend: EnvDataPoint[]; stationCount: number } {
  const lines = text
    .split('\n')
    .filter((l) => !l.startsWith('#') && l.trim() !== '');

  if (lines.length < 3) return { trend: [], stationCount: 0 };

  const headers   = lines[0].split('\t').map((h) => h.trim());
  const dataLines = lines.slice(2); // skip header row + format specifier row

  const byYear = new Map<number, number[]>();
  const sites  = new Set<string>();

  for (const line of dataLines) {
    if (!line.trim()) continue;
    const cols: Record<string, string> = {};
    line.split('\t').forEach((v, i) => { cols[headers[i] ?? ''] = v.trim(); });

    const year = parseInt(cols['year_nu'] ?? '', 10);
    const val  = parseFloat(cols['mean_va'] ?? '');
    const site = cols['site_no'] ?? '';

    if (isNaN(year) || isNaN(val) || val < 0) continue;
    if (year < START_YEAR || year > END_YEAR) continue;

    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push(val);
    if (site) sites.add(site);
  }

  const trend: EnvDataPoint[] = [];
  for (let yr = START_YEAR; yr <= END_YEAR; yr++) {
    const vals = byYear.get(yr);
    if (!vals || vals.length === 0) continue;
    trend.push({ year: yr, value: Math.round(median(vals)) });
  }

  return { trend, stationCount: sites.size };
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function fetchUsgsHistory(): Promise<UsgsHistoryData> {
  const [tempRes, flowRes] = await Promise.all([
    // Daily mean temperature for 2015–2024
    fetch(
      `https://waterservices.usgs.gov/nwis/dv/?format=json&sites=${TEMP_SITES}` +
      `&parameterCd=00010&startDT=${START_YEAR}-01-01&endDT=${END_YEAR}-12-31&statCd=00003`,
      { next: { revalidate: 86400 } },
    ),
    // Annual mean discharge via stats service
    fetch(
      `https://waterservices.usgs.gov/nwis/stat/?format=rdb` +
      `&sites=${FLOW_SITES}&parameterCd=00060&statReportType=annual`,
      { next: { revalidate: 86400 } },
    ),
  ]);

  if (!tempRes.ok) throw new Error(`USGS temp DV: ${tempRes.status} ${tempRes.statusText}`);
  if (!flowRes.ok) throw new Error(`USGS flow stats: ${flowRes.status} ${flowRes.statusText}`);

  const [tempJson, flowText] = await Promise.all([tempRes.json(), flowRes.text()]);

  const { trend: tempTrend, stationCount: tempStationCount } = parseUsgsTemperature(tempJson);
  const { trend: flowTrend, stationCount: flowStationCount } = parseUsgsFlow(flowText);

  return {
    tempTrend,
    flowTrend,
    tempStationCount,
    flowStationCount,
    fetchedAt: new Date().toISOString(),
  };
}
