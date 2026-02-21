// Mock adapter — Phase 1 (PLANNING.md §7)
// Returns placeholder environmental readings.
// Swap for USGS NWIS / PSP data in M5.

import type { EnvReading } from "@/types";

const MOCK_READINGS: EnvReading[] = [
  { watershedId: "skagit",        type: "water_temp", value: 12.4, unit: "°C",  date: "2024-08-01", source: "USGS_MOCK" },
  { watershedId: "stillaguamish", type: "water_temp", value: 14.1, unit: "°C",  date: "2024-08-01", source: "USGS_MOCK" },
  { watershedId: "snohomish",     type: "water_temp", value: 15.8, unit: "°C",  date: "2024-08-01", source: "USGS_MOCK" },
  { watershedId: "cedar",         type: "water_temp", value: 17.2, unit: "°C",  date: "2024-08-01", source: "USGS_MOCK" },
  { watershedId: "sammamish",     type: "water_temp", value: 18.9, unit: "°C",  date: "2024-08-01", source: "USGS_MOCK" },
  { watershedId: "green",         type: "water_temp", value: 16.3, unit: "°C",  date: "2024-08-01", source: "USGS_MOCK" },
  { watershedId: "puyallup",      type: "water_temp", value: 13.7, unit: "°C",  date: "2024-08-01", source: "USGS_MOCK" },
  { watershedId: "nisqually",     type: "water_temp", value: 11.9, unit: "°C",  date: "2024-08-01", source: "USGS_MOCK" },
];

export function getIndicators(options?: {
  watershedId?: string;
  type?: string;
}): EnvReading[] {
  let results = MOCK_READINGS;
  if (options?.watershedId)
    results = results.filter((r) => r.watershedId === options.watershedId);
  if (options?.type)
    results = results.filter((r) => r.type === options.type);
  return results;
}
