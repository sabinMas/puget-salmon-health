// Mock adapter — Phase 1 (PLANNING.md §7)
// All content is placeholder; no tribal knowledge is assumed here.
// Swap for CMS API in M6.

import type { Tribe } from "@/types";

const TRIBES: Tribe[] = [
  {
    id: "tulalip",
    name: "Tulalip Tribes",
    slug: "tulalip",
    tagline: "[Awaiting content from Tulalip Tribes]",
    watershedIds: ["snohomish", "stillaguamish"],
    approvalStatus: "draft",
  },
  {
    id: "muckleshoot",
    name: "Muckleshoot Indian Tribe",
    slug: "muckleshoot",
    tagline: "[Awaiting content from Muckleshoot Indian Tribe]",
    watershedIds: ["green", "cedar", "sammamish"],
    approvalStatus: "draft",
  },
  {
    id: "puyallup",
    name: "Puyallup Tribe",
    slug: "puyallup",
    tagline: "[Awaiting content from Puyallup Tribe]",
    watershedIds: ["puyallup"],
    approvalStatus: "draft",
  },
  {
    id: "nisqually",
    name: "Nisqually Indian Tribe",
    slug: "nisqually",
    tagline: "[Awaiting content from Nisqually Indian Tribe]",
    watershedIds: ["nisqually"],
    approvalStatus: "draft",
  },
  {
    id: "upper-skagit",
    name: "Upper Skagit Indian Tribe",
    slug: "upper-skagit",
    tagline: "[Awaiting content from Upper Skagit Indian Tribe]",
    watershedIds: ["skagit"],
    approvalStatus: "draft",
  },
  {
    id: "sauk-suiattle",
    name: "Sauk-Suiattle Indian Tribe",
    slug: "sauk-suiattle",
    tagline: "[Awaiting content from Sauk-Suiattle Indian Tribe]",
    watershedIds: ["skagit", "stillaguamish"],
    approvalStatus: "draft",
  },
  {
    id: "skokomish",
    name: "Skokomish Tribe",
    slug: "skokomish",
    tagline: "[Awaiting content from Skokomish Tribe]",
    watershedIds: [],
    approvalStatus: "draft",
  },
  {
    id: "suquamish",
    name: "Suquamish Tribe",
    slug: "suquamish",
    tagline: "[Awaiting content from Suquamish Tribe]",
    watershedIds: ["cedar", "sammamish"],
    approvalStatus: "draft",
  },
  {
    id: "stillaguamish",
    name: "Stillaguamish Tribe",
    slug: "stillaguamish",
    tagline: "[Awaiting content from Stillaguamish Tribe]",
    watershedIds: ["stillaguamish"],
    approvalStatus: "draft",
  },
];

export function getTribes(): Tribe[] {
  return TRIBES;
}

export function getTribeBySlug(slug: string): Tribe | undefined {
  return TRIBES.find((t) => t.slug === slug);
}
