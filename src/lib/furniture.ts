/**
 * Furniture code → friendly label mapping.
 * Used on room cards (short) and room details modal (code — label).
 */

export const FURNITURE_LABELS: Record<string, string> = {
  FTLC: "Fixed tables with loose chairs",
  FTSC: "Fixed tables with swivel chairs",
  STC: "Standard tables and chairs",
  FTA: "Fixed table with armchair",
  LTA: "Loose table with armchair",
  THA: "Theater armchairs",
  MM: "Multimedia",
  SEM: "Seminar",
};

/**
 * Format furniture string for display.
 * - short: friendly label(s) only, e.g. "Standard tables & chairs" or "Fixed tables with loose chairs; Seminar"
 * - full: code + label per part, e.g. "STC — Standard tables and chairs" or "FTLC — Fixed tables with loose chairs; SEM — Seminar"
 * Unknown codes show as "CODE (Unknown)".
 */
export function formatFurniture(
  furniture: string | undefined
): { short: string; full: string } {
  if (!furniture || !String(furniture).trim()) {
    return { short: "", full: "" };
  }
  const raw = String(furniture).trim();
  const codes = raw.split("/").map((c) => c.trim()).filter(Boolean);
  const parts: { code: string; label: string }[] = codes.map((code) => {
    const label = FURNITURE_LABELS[code] ?? `${code} (Unknown)`;
    return { code, label };
  });
  const short = parts.map((p) => p.label.replace(/\s+and\s+/g, " & ")).join("; ");
  const full = parts.map((p) => `${p.code} — ${p.label}`).join("; ");
  return { short, full };
}
