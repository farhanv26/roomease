/**
 * Verified University of Waterloo building codes and official full names.
 * Source: UW Plant Operations Floor Plans, UW Accessibility building directory.
 * Display format: "CODE — Full Name" (e.g. "CPH — Carl A. Pollock Hall")
 */
export interface BuildingEntry {
  short: string;
  full: string;
}

export const BUILDINGS: Record<string, BuildingEntry> = {
  AL: { short: "AL", full: "Arts Lecture Hall" },
  B1: { short: "B1", full: "Biology 1" },
  B2: { short: "B2", full: "Biology 2" },
  CPH: { short: "CPH", full: "Carl A. Pollock Hall" },
  DC: { short: "DC", full: "William G. Davis Computer Research Centre" },
  DWE: { short: "DWE", full: "Douglas Wright Engineering Building" },
  E2: { short: "E2", full: "Engineering 2" },
  EIT: { short: "EIT", full: "Centre for Environmental and Information Technology" },
  EV1: { short: "EV1", full: "Environment 1" },
  EV2: { short: "EV2", full: "Environment 2" },
  EV3: { short: "EV3", full: "Environment 3" },
  HH: { short: "HH", full: "J.G. Hagey Hall of the Humanities" },
  M3: { short: "M3", full: "Mathematics 3" },
  MC: { short: "MC", full: "Mathematics & Computer" },
  ML: { short: "ML", full: "Modern Languages" },
  OPT: { short: "OPT", full: "Optometry" },
  PAS: { short: "PAS", full: "Psychology, Anthropology & Sociology" },
  PHY: { short: "PHY", full: "Physics" },
  QNC: { short: "QNC", full: "Quantum Nano Centre" },
  RCH: { short: "RCH", full: "J.R. Coutts Engineering Lecture Hall" },
  STC: { short: "STC", full: "Science Teaching Complex" },
  STP: { short: "STP", full: "Science Teaching Pavilion" },
};
