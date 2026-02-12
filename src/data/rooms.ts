import type { Room } from "@/types/booking";
import roomsJson from "./rooms.json";

const typed = roomsJson as Room[];
export const ROOMS: Room[] = typed;

const KNOWN_KEYS = new Set([
  "id",
  "name",
  "building",
  "roomNumber",
  "capacity",
  "furniture",
  "avCapable",
  "docCamera",
  "rawFeatureCode",
  "accessible",
  "hasAV",
]);

/** Unique buildings from room data, sorted; for building picker */
export function getBuildingsFromRooms(rooms: Room[]): { value: string; label: string }[] {
  const set = new Set<string>();
  for (const r of rooms) {
    const b = (r.building || "").trim();
    if (b) set.add(b);
  }
  const list = Array.from(set).sort((a, b) => a.localeCompare(b));
  return [{ value: "", label: "Any building" }, ...list.map((b) => ({ value: b, label: b }))];
}

/** Extra room fields for details view (excluding known keys) */
export function getRoomDetailEntries(room: Room): { key: string; value: string }[] {
  const out: { key: string; value: string }[] = [];
  for (const [k, v] of Object.entries(room)) {
    if (KNOWN_KEYS.has(k)) continue;
    if (v === undefined || v === null) continue;
    out.push({ key: k, value: String(v) });
  }
  return out;
}
