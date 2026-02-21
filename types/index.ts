// ─── Watershed / Basin ───────────────────────────────────────────────────────

export interface Watershed {
  id: string;
  name: string;
  slug: string;
  region: string;
  population: number;       // latest Chinook escapement estimate
  recoveryTarget: number;   // WDFW recovery target
  latestYear: number;
  targetYear: number;
}

// ─── Species ─────────────────────────────────────────────────────────────────

export type SalmonSpecies =
  | "chinook"
  | "coho"
  | "chum"
  | "pink"
  | "sockeye"
  | "steelhead";

export interface Species {
  id: SalmonSpecies;
  commonName: string;
  slug: string;
  scientificName: string;
}

// ─── Salmon Returns ───────────────────────────────────────────────────────────

export interface SalmonReturn {
  watershedId: string;
  species: SalmonSpecies;
  year: number;
  countEstimate: number;
  source: string;
  confidence?: "high" | "medium" | "low";
}

// ─── Environmental Indicators ─────────────────────────────────────────────────

export type IndicatorType =
  | "water_temp"
  | "streamflow"
  | "dissolved_oxygen"
  | "habitat_quality";

export interface EnvReading {
  watershedId: string;
  type: IndicatorType;
  value: number;
  unit: string;
  date: string;
  source: string;
}

// ─── Tribes ───────────────────────────────────────────────────────────────────

export type ApprovalStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "revision_requested"
  | "removed";

export interface Tribe {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  watershedIds: string[];   // watersheds within or near territory
  approvalStatus: ApprovalStatus;
  lastReviewed?: string;    // ISO date
}

// ─── Projects ────────────────────────────────────────────────────────────────

export type ProjectType =
  | "habitat_restoration"
  | "monitoring"
  | "climate_adaptation"
  | "youth_education"
  | "hatchery"
  | "research";

export interface Project {
  id: string;
  title: string;
  slug: string;
  tribeIds: string[];
  watershedId: string;
  type: ProjectType;
  status: "active" | "completed";
  excerpt: string;
}

// ─── Population health helpers ────────────────────────────────────────────────

export type PopulationStatus = "critical" | "endangered" | "threatened" | "stable";

export function populationStatus(population: number, target: number): PopulationStatus {
  const pct = population / target;
  if (pct < 0.05) return "critical";
  if (pct < 0.10) return "endangered";
  if (pct < 0.25) return "threatened";
  return "stable";
}
