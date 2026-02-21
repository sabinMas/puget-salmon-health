// Mock adapter — Phase 1 (PLANNING.md §7)
// Swap for DB/CMS query in M5/M6; UI never changes.

import type { Project } from "@/types";

const PROJECTS: Project[] = [
  {
    id: "skagit-floodplain",
    title: "Skagit River Floodplain Reconnection",
    slug: "skagit-floodplain",
    tribeIds: ["upper-skagit", "sauk-suiattle"],
    watershedId: "skagit",
    type: "habitat_restoration",
    status: "active",
    excerpt:
      "Restoring side-channel connectivity to 12 miles of the Skagit River to provide salmon rearing habitat and reduce downstream flood risk.",
  },
  {
    id: "nisqually-delta-monitoring",
    title: "Nisqually Delta Habitat Monitoring",
    slug: "nisqually-delta-monitoring",
    tribeIds: ["nisqually"],
    watershedId: "nisqually",
    type: "monitoring",
    status: "active",
    excerpt:
      "Long-term monitoring of estuary habitat health and juvenile Chinook use across the Nisqually River delta restoration area.",
  },
  {
    id: "muckleshoot-youth-stewards",
    title: "Muckleshoot Youth Salmon Stewards",
    slug: "muckleshoot-youth-stewards",
    tribeIds: ["muckleshoot"],
    watershedId: "green",
    type: "youth_education",
    status: "active",
    excerpt:
      "A year-round program connecting Muckleshoot youth to traditional salmon knowledge, habitat restoration fieldwork, and water quality science.",
  },
  {
    id: "puyallup-climate-adaptation",
    title: "Puyallup River Climate Adaptation Plan",
    slug: "puyallup-climate-adaptation",
    tribeIds: ["puyallup"],
    watershedId: "puyallup",
    type: "climate_adaptation",
    status: "active",
    excerpt:
      "Developing watershed-scale strategies to maintain cold-water refugia and preserve spawning gravel as summer stream temperatures rise.",
  },
  {
    id: "tulalip-hatchery-enhancement",
    title: "Tulalip Hatchery Enhancement Program",
    slug: "tulalip-hatchery-enhancement",
    tribeIds: ["tulalip"],
    watershedId: "snohomish",
    type: "hatchery",
    status: "active",
    excerpt:
      "Integrating traditional ecological knowledge into hatchery management to improve Chinook survival rates and increase natural-origin spawning.",
  },
];

export function getProjects(options?: {
  tribeId?: string;
  type?: string;
  watershedId?: string;
}): Project[] {
  let results = PROJECTS;
  if (options?.tribeId)
    results = results.filter((p) => p.tribeIds.includes(options.tribeId!));
  if (options?.type)
    results = results.filter((p) => p.type === options.type);
  if (options?.watershedId)
    results = results.filter((p) => p.watershedId === options.watershedId);
  return results;
}
