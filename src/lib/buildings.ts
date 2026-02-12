/**
 * Building labels from verified UW building names.
 * Uses centralized mapping from src/data/buildings.ts.
 * Display format: "CODE — Full Name" (e.g. "CPH — Carl A. Pollock Hall")
 */
import { BUILDINGS } from "@/data/buildings";

export function getBuildingDisplayName(code: string): string {
  const trimmed = (code || "").trim();
  if (!trimmed) return "";
  const entry = BUILDINGS[trimmed];
  return entry ? entry.full : trimmed;
}

/** For UI: "CODE — Full Name" or code only if no mapping. */
export function getBuildingTicketLabel(code: string): string {
  const trimmed = (code || "").trim();
  if (!trimmed) return "—";
  const entry = BUILDINGS[trimmed];
  if (entry && entry.full !== trimmed) return `${entry.short} — ${entry.full}`;
  return trimmed;
}
