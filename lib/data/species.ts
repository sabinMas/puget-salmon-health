// Mock adapter — Phase 1 (PLANNING.md §7)
// Static — species list does not change between data phases.

import type { Species } from "@/types";

const SPECIES: Species[] = [
  { id: "chinook",   commonName: "Chinook",   slug: "chinook",   scientificName: "Oncorhynchus tshawytscha" },
  { id: "coho",      commonName: "Coho",      slug: "coho",      scientificName: "Oncorhynchus kisutch"     },
  { id: "chum",      commonName: "Chum",      slug: "chum",      scientificName: "Oncorhynchus keta"        },
  { id: "pink",      commonName: "Pink",      slug: "pink",      scientificName: "Oncorhynchus gorbuscha"   },
  { id: "sockeye",   commonName: "Sockeye",   slug: "sockeye",   scientificName: "Oncorhynchus nerka"       },
  { id: "steelhead", commonName: "Steelhead", slug: "steelhead", scientificName: "Oncorhynchus mykiss"      },
];

export function getSpecies(): Species[] {
  return SPECIES;
}

export function getSpeciesById(id: string): Species | undefined {
  return SPECIES.find((s) => s.id === id);
}
