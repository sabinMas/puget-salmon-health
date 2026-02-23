'use client';

import { useId } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Line,
} from 'recharts';
import type { TooltipProps as RechartsTooltipProps } from 'recharts';

// ── Public types ──────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  year: number;
  value: number;
}

interface IndicatorChartProps {
  data: ChartDataPoint[];
  title: string;
  unit?: string;           // appended in tooltip and summary (e.g. "fish", "°C", "kcfs")
  color?: string;          // hex — defaults to project primary teal
  interpretation?: string; // plain-language paragraph shown below the chart
  source?: string;         // data source attribution
  height?: number;         // px — defaults to 300
  loading?: boolean;
  variant?: 'area' | 'line';
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatValue(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}k`;
  return v.toLocaleString();
}

function buildSummary(data: ChartDataPoint[], unit: string): string {
  if (!data.length) return 'No data available for this selection.';
  const values = data.map((d) => d.value);
  const min    = Math.min(...values);
  const max    = Math.max(...values);
  const first  = data[0];
  const last   = data[data.length - 1];
  const pctChange = ((last.value - first.value) / first.value) * 100;
  const direction = pctChange >= 0 ? 'increased' : 'decreased';
  return (
    `From ${first.year} to ${last.year}, estimates ${direction} by ` +
    `${Math.abs(pctChange).toFixed(0)}%. ` +
    `Most recent (${last.year}): ${formatValue(last.value)} ${unit}. ` +
    `Range across period: ${formatValue(min)}–${formatValue(max)} ${unit}.`
  );
}

// ── Custom tooltip ────────────────────────────────────────────────────────────

type ChartTooltipProps = RechartsTooltipProps<number, string> & { unit: string };

function ChartTooltip({ active, payload, label, unit }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const raw = payload[0]?.value;
  const display = raw !== undefined ? formatValue(Number(raw)) : '—';
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-sm">
      <p className="font-semibold text-gray-600 mb-0.5">{label}</p>
      <p className="font-bold text-primary">
        {display}{unit ? ` ${unit}` : ''}
      </p>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function IndicatorChart({
  data,
  title,
  unit = '',
  color = '#1b5e5e',
  interpretation,
  source,
  height = 300,
  loading = false,
  variant = 'area',
}: IndicatorChartProps) {
  // Stable unique ID for the SVG gradient — avoids conflicts when multiple
  // charts appear on the same page.
  const uid        = useId();
  const gradientId = `grad-${uid}`.replace(/:/g, '');

  const summary = buildSummary(data, unit);

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div style={{ height }} className="flex flex-col gap-3 justify-end px-2 pb-2">
        {[0.6, 0.8, 0.5, 0.9, 0.7, 0.85, 0.65, 0.75, 0.9, 0.8].map((h, i) => (
          <div
            key={i}
            className="bg-gray-200 animate-pulse rounded-sm w-full"
            style={{ height: `${h * 60}%` }}
          />
        ))}
      </div>
    );
  }

  // ── No data ──
  if (!data.length) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
      >
        <p className="text-gray-500 text-sm">No data available for this selection.</p>
      </div>
    );
  }

  // ── Shared axis / grid props ──
  const gridProps   = { strokeDasharray: '3 3', stroke: '#e5e7eb', vertical: false };
  const xAxisProps  = { dataKey: 'year' as const, tick: { fontSize: 11, fill: '#6b7280' }, tickLine: false, axisLine: false };
  const yAxisProps  = { tickFormatter: formatValue, tick: { fontSize: 11, fill: '#6b7280' }, tickLine: false, axisLine: false, width: 40 };
  const tooltipEl   = (
    <Tooltip<number, string>
      content={(props) => <ChartTooltip {...props} unit={unit} />}
      cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
    />
  );

  return (
    <figure aria-label={`${title}: ${summary}`} className="w-full">
      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        {variant === 'area' ? (
          <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            {tooltipEl}
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              dot={{ r: 3, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: color }}
            />
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            {tooltipEl}
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              dot={{ r: 3, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: color }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>

      {/* Accessible screen-reader summary */}
      <figcaption className="sr-only">{summary}</figcaption>

      {/* Visible interpretation + source */}
      {(interpretation || source) && (
        <div className="mt-4 space-y-2">
          {interpretation && (
            <p className="text-sm text-gray-700 leading-relaxed">{interpretation}</p>
          )}
          {source && (
            <p className="text-xs text-gray-400">Source: {source}</p>
          )}
        </div>
      )}

      {/* Accessible data table — keyboard / screen-reader alternative to the chart */}
      <details className="mt-3">
        <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary rounded">
          View data as table
        </summary>
        <div className="mt-2 overflow-x-auto">
          <table className="text-xs w-full border-collapse">
            <caption className="sr-only">{title} — tabular data</caption>
            <thead>
              <tr>
                <th scope="col" className="text-left py-1 pr-6 font-semibold text-gray-600 border-b border-gray-200">Year</th>
                <th scope="col" className="text-right py-1 font-semibold text-gray-600 border-b border-gray-200">
                  {unit ? `Value (${unit})` : 'Value'}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.year} className="border-b border-gray-100">
                  <td className="py-1 pr-6 text-gray-700">{d.year}</td>
                  <td className="py-1 text-right text-gray-700">{formatValue(d.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
