/** Room with required fields; may have extra keys from JSON */
export interface Room {
  id: number | string;
  name: string;
  building: string;
  capacity: number;
  hasAV: boolean;
  accessible: boolean;
  [key: string]: unknown;
}

export interface EventFormData {
  eventName: string;
  organizerName: string;
  preferredDate: string;
  timeSlot: string;
  groupSize: number;
  eventType: string;
  eventTypeCustom?: string;
  durationMinutes: number;
  avRequired: boolean;
  accessibilityRequired: boolean;
  avNotes?: string;
  accessibilityNotes?: string;
  preferredBuilding?: string;
  priorityLevel?: string;
}

export interface BookedSlot {
  roomId: number | string;
  roomName: string;
  date: string;
  timeSlot: string;
  durationMinutes: number;
}

/** 30-min slots from 9:00 AM to 10:00 PM. value = "09:00" .. "22:00" (HH:MM 24h) */
export const TIME_SLOTS_30MIN: { value: string; label: string }[] = (() => {
  const out: { value: string; label: string }[] = [];
  for (let h = 9; h <= 22; h++) {
    for (const m of [0, 30]) {
      if (h === 22 && m === 30) break;
      const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const period = h < 12 ? "AM" : "PM";
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const label = `${h12}:${String(m).padStart(2, "0")} ${period}`;
      out.push({ value, label });
    }
  }
  return out;
})();

export const DURATION_OPTIONS = [
  { value: 30, label: "30m" },
  { value: 60, label: "1h" },
  { value: 90, label: "1.5h" },
  { value: 120, label: "2h" },
  { value: 180, label: "3h" },
] as const;

export const EVENT_TYPES = [
  { value: "Study Session", label: "Study Session" },
  { value: "Interview", label: "Interview" },
  { value: "Workshop", label: "Workshop" },
  { value: "Tutorial / Review", label: "Tutorial / Review" },
  { value: "Club Meeting", label: "Club Meeting" },
  { value: "Team Meeting", label: "Team Meeting" },
  { value: "Presentation", label: "Presentation" },
  { value: "Social / Networking", label: "Social / Networking" },
  { value: "Other", label: "Other" },
] as const;

export const PRIORITY_LEVELS = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
] as const;

/** Format "09:00" -> "9:00 AM" for display */
export function formatTimeSlot(value: string): string {
  const found = TIME_SLOTS_30MIN.find((s) => s.value === value);
  return found ? found.label : value;
}

/** Format duration minutes to display string */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** Convert "HH:MM" to minutes from midnight */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** Check if two time ranges overlap (same day). All in minutes from midnight. */
export function timeRangesOverlap(
  startA: number,
  durationA: number,
  startB: number,
  durationB: number
): boolean {
  const endA = startA + durationA;
  const endB = startB + durationB;
  return startA < endB && startB < endA;
}
