// Mock adapter — Phase 1 (PLANNING.md §7)
// Synthesizes a 10-year trend per watershed for dashboard charts.
// Swap for real WDFW/StreamNet data in M5.

import type { SalmonReturn } from "@/types";
import { getWatersheds } from "./watersheds";

/** Generate a plausible 10-year trend ending at the watershed's current population */
function syntheticTrend(
  watershedId: string,
  currentPop: number,
  endYear: number
): SalmonReturn[] {
  const years = Array.from({ length: 10 }, (_, i) => endYear - 9 + i);
  return years.map((year) => {
    // Add noise ±20% and slight upward trend in last 3 years
    const noise = 0.8 + Math.random() * 0.4;
    const trend = year >= endYear - 2 ? 1.05 : 1.0;
    const estimate = Math.round((currentPop / trend) * noise);
    return {
      watershedId,
      species: "chinook",
      year,
      countEstimate: Math.max(estimate, 50),
      source: "FALLBACK_MOCK",
      confidence: "low",
    };
  });
}

let _cache: SalmonReturn[] | null = null;

export function getSalmonReturns(options?: {
  watershedId?: string;
  species?: string;
  startYear?: number;
  endYear?: number;
}): SalmonReturn[] {
  if (!_cache) {
    _cache = getWatersheds().flatMap((w) =>
      syntheticTrend(w.id, w.population, w.latestYear)
    );
  }

  let results = _cache;
  if (options?.watershedId)
    results = results.filter((r) => r.watershedId === options.watershedId);
  if (options?.species)
    results = results.filter((r) => r.species === options.species);
  if (options?.startYear)
    results = results.filter((r) => r.year >= options.startYear!);
  if (options?.endYear)
    results = results.filter((r) => r.year <= options.endYear!);

  return results;
}
