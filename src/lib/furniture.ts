/**
 * Furniture code → full label mapping (internal only).
 * UI must NEVER display codes (STC, FTSC, etc.) — only these labels.
 */
export const FURNITURE_LABELS: Record<string, string> = {
  FTLC: "Fixed Tables with Loose Chairs",
  FTSC: "Fixed Tables with Swivel Chairs",
  STC: "Standard Tables and Chairs",
  FTA: "Fixed Table with Armchairs",
  LTA: "Loose Tables with Armchairs",
  THA: "Theatre Armchairs",
  MM: "Multimedia Room",
  SEM: "Seminar Layout",
};

/**
 * Returns display text only — no codes, no rawFeatureCode, no abbreviations.
 * - short: labels joined with " • " for one line (e.g. "Standard Tables and Chairs" or "Fixed Tables with Loose Chairs • Seminar Layout")
 * - full: same as short (labels only)
 * Unknown codes render as "(Unknown)" only (code never shown).
 */
export function formatFurniture(
  furniture: string | undefined
): { short: string; full: string } {
  if (!furniture || !String(furniture).trim()) {
    return { short: "", full: "" };
  }
  const raw = String(furniture).trim();
  const codes = raw.split("/").map((c) => c.trim()).filter(Boolean);
  const labels = codes.map((code) =>
    FURNITURE_LABELS[code] ? FURNITURE_LABELS[code] : "(Unknown)"
  );
  const line = Array.from(new Set(labels)).join(" • ");
  return { short: line, full: line };
}

/** For matching: returns list of label strings (no codes in output). */
export function furnitureLabelsFromCodes(furniture: string | undefined): string[] {
  if (!furniture || !String(furniture).trim()) return [];
  const raw = String(furniture).trim();
  const codes = raw.split("/").map((c) => c.trim()).filter(Boolean);
  const labels = codes.map((code) =>
    FURNITURE_LABELS[code] ? FURNITURE_LABELS[code] : "(Unknown)"
  );
  return Array.from(new Set(labels));
}
