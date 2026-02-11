"use client";

import type { EventFormData } from "@/types/booking";
import {
  BUILDINGS,
  EVENT_TYPES,
  PRIORITY_LEVELS,
  TIME_SLOTS,
} from "@/types/booking";

interface EventFormProps {
  data: EventFormData;
  onChange: (data: EventFormData) => void;
  onSubmit: () => void;
}

const defaultFormData: EventFormData = {
  eventName: "",
  organizerName: "",
  preferredDate: "",
  timeSlot: "",
  groupSize: 0,
  eventType: "",
  avRequired: false,
  accessibilityRequired: false,
  preferredBuilding: "",
  priorityLevel: "Medium",
};

export function EventForm({ data, onChange, onSubmit }: EventFormProps) {
  const formData = { ...defaultFormData, ...data };

  const set = (key: keyof EventFormData, value: string | number | boolean) => {
    onChange({ ...formData, [key]: value });
  };

  const isValid =
    formData.eventName.trim() !== "" &&
    formData.organizerName.trim() !== "" &&
    formData.preferredDate !== "" &&
    formData.timeSlot !== "" &&
    formData.groupSize > 0 &&
    formData.eventType !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onSubmit();
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="eventName" className={labelClass}>
            Event Name <span className="text-red-500">*</span>
          </label>
          <input
            id="eventName"
            type="text"
            value={formData.eventName}
            onChange={(e) => set("eventName", e.target.value)}
            className={inputClass}
            placeholder="e.g. Club Meetup"
            required
          />
        </div>
        <div>
          <label htmlFor="organizerName" className={labelClass}>
            Organizer / Club Name <span className="text-red-500">*</span>
          </label>
          <input
            id="organizerName"
            type="text"
            value={formData.organizerName}
            onChange={(e) => set("organizerName", e.target.value)}
            className={inputClass}
            placeholder="e.g. CS Student Society"
            required
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="preferredDate" className={labelClass}>
            Preferred Date <span className="text-red-500">*</span>
          </label>
          <input
            id="preferredDate"
            type="date"
            value={formData.preferredDate}
            onChange={(e) => set("preferredDate", e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label htmlFor="timeSlot" className={labelClass}>
            Preferred Time Slot <span className="text-red-500">*</span>
          </label>
          <select
            id="timeSlot"
            value={formData.timeSlot}
            onChange={(e) => set("timeSlot", e.target.value)}
            className={inputClass}
            required
          >
            <option value="">Select time</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="groupSize" className={labelClass}>
            Group Size <span className="text-red-500">*</span>
          </label>
          <input
            id="groupSize"
            type="number"
            min={1}
            value={formData.groupSize || ""}
            onChange={(e) => set("groupSize", parseInt(e.target.value, 10) || 0)}
            className={inputClass}
            placeholder="e.g. 20"
            required
          />
        </div>
        <div>
          <label htmlFor="eventType" className={labelClass}>
            Event Type <span className="text-red-500">*</span>
          </label>
          <select
            id="eventType"
            value={formData.eventType}
            onChange={(e) => set("eventType", e.target.value)}
            className={inputClass}
            required
          >
            <option value="">Select type</option>
            {EVENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={formData.avRequired}
            onChange={(e) => set("avRequired", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm font-medium text-gray-700">AV Required</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={formData.accessibilityRequired}
            onChange={(e) => set("accessibilityRequired", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Accessibility Required
          </span>
        </label>
      </div>

      <div className="grid gap-6 border-t border-gray-100 pt-6 sm:grid-cols-2">
        <div>
          <label htmlFor="preferredBuilding" className={labelClass}>
            Preferred Building <span className="text-gray-400">(optional)</span>
          </label>
          <select
            id="preferredBuilding"
            value={formData.preferredBuilding ?? ""}
            onChange={(e) => set("preferredBuilding", e.target.value)}
            className={inputClass}
          >
            {BUILDINGS.map((b) => (
              <option key={b.value || "any"} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="priorityLevel" className={labelClass}>
            Priority Level <span className="text-gray-400">(optional)</span>
          </label>
          <select
            id="priorityLevel"
            value={formData.priorityLevel ?? "Medium"}
            onChange={(e) => set("priorityLevel", e.target.value)}
            className={inputClass}
          >
            {PRIORITY_LEVELS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={!isValid}
          className="w-full rounded-xl bg-emerald-600 px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto sm:min-w-[220px]"
        >
          Find Available Rooms
        </button>
      </div>
    </form>
  );
}
