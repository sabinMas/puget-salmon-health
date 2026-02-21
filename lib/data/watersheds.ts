// Mock adapter — Phase 1 (PLANNING.md §7)
// Data matches FALLBACK_WATERSHED_DATA in script.js
// Swap internals for DB/API calls in M5; UI never changes.

import type { Watershed } from "@/types";

const WATERSHEDS: Watershed[] = [
  { id: "skagit",        name: "Skagit",           slug: "skagit",        region: "North Puget Sound",   population: 8500,  recoveryTarget: 35000, latestYear: 2023, targetYear: 2050 },
  { id: "stillaguamish", name: "Stillaguamish",     slug: "stillaguamish", region: "North Puget Sound",   population: 1200,  recoveryTarget: 17800, latestYear: 2023, targetYear: 2050 },
  { id: "snohomish",     name: "Snohomish",         slug: "snohomish",     region: "Central Puget Sound", population: 2100,  recoveryTarget: 22400, latestYear: 2023, targetYear: 2050 },
  { id: "cedar",         name: "Cedar",             slug: "cedar",         region: "Central Puget Sound", population: 890,   recoveryTarget: 14200, latestYear: 2023, targetYear: 2050 },
  { id: "sammamish",     name: "Sammamish",         slug: "sammamish",     region: "Central Puget Sound", population: 340,   recoveryTarget: 8900,  latestYear: 2023, targetYear: 2050 },
  { id: "green",         name: "Green / Duwamish",  slug: "green",         region: "South Puget Sound",   population: 1650,  recoveryTarget: 19500, latestYear: 2023, targetYear: 2050 },
  { id: "puyallup",      name: "Puyallup",          slug: "puyallup",      region: "South Puget Sound",   population: 2800,  recoveryTarget: 24100, latestYear: 2023, targetYear: 2050 },
  { id: "nisqually",     name: "Nisqually",         slug: "nisqually",     region: "South Puget Sound",   population: 3200,  recoveryTarget: 21000, latestYear: 2023, targetYear: 2050 },
];

export function getWatersheds(): Watershed[] {
  return WATERSHEDS;
}

export function getWatershedBySlug(slug: string): Watershed | undefined {
  return WATERSHEDS.find((w) => w.slug === slug);
}
