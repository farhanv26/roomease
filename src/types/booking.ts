export interface Room {
  id: number;
  name: string;
  building: string;
  capacity: number;
  hasAV: boolean;
  accessible: boolean;
}

export interface EventFormData {
  eventName: string;
  organizerName: string;
  preferredDate: string;
  timeSlot: string;
  groupSize: number;
  eventType: string;
  avRequired: boolean;
  accessibilityRequired: boolean;
  preferredBuilding?: string;
  priorityLevel?: string;
}

export interface BookedSlot {
  roomId: number;
  roomName: string;
  date: string;
  timeSlot: string;
}

export const TIME_SLOTS = [
  { value: "9-11am", label: "9–11am" },
  { value: "12-2pm", label: "12–2pm" },
  { value: "3-5pm", label: "3–5pm" },
] as const;

export const EVENT_TYPES = [
  { value: "Meeting", label: "Meeting" },
  { value: "Workshop", label: "Workshop" },
  { value: "Social", label: "Social" },
] as const;

export const BUILDINGS = [
  { value: "", label: "Any" },
  { value: "SLC", label: "SLC" },
  { value: "E7", label: "E7" },
  { value: "DC", label: "DC" },
] as const;

export const PRIORITY_LEVELS = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
] as const;
