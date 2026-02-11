"use client";

import type { EventFormData } from "@/types/booking";
import { DURATION_OPTIONS, PRIORITY_LEVELS } from "@/types/booking";
import { EventTypeSelector } from "./EventTypeSelector";
import { TimeSlotButton } from "./TimeSlotButton";

interface EventFormProps {
  data: EventFormData;
  onChange: (data: EventFormData) => void;
  onSubmit: () => void;
  buildings: { value: string; label: string }[];
}

const defaultFormData: Partial<EventFormData> = {
  eventName: "",
  organizerName: "",
  preferredDate: "",
  timeSlot: "",
  groupSize: 0,
  eventType: "",
  durationMinutes: 60,
  avRequired: false,
  accessibilityRequired: false,
  preferredBuilding: "",
  priorityLevel: "Medium",
};

export function EventForm({ data, onChange, onSubmit, buildings }: EventFormProps) {
  const formData = { ...defaultFormData, ...data };

  const set = (key: keyof EventFormData, value: string | number | boolean | undefined) => {
    onChange({ ...formData, [key]: value });
  };

  const isEventTypeValid =
    formData.eventType !== "" && (formData.eventType !== "Other" || (formData.eventTypeCustom ?? "").trim() !== "");
  const isValid =
    formData.eventName?.trim() !== "" &&
    formData.organizerName?.trim() !== "" &&
    formData.preferredDate !== "" &&
    formData.timeSlot !== "" &&
    (formData.groupSize ?? 0) > 0 &&
    isEventTypeValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onSubmit();
  };

  const inputClass =
    "w-full rounded-xl border border-[#2A2A2A] bg-[#111111] px-4 py-3 text-white placeholder-gray-500 focus:border-[#FFD100] focus:outline-none focus:ring-1 focus:ring-[#FFD100] transition-all duration-150";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-400";
  const textareaClass =
    "w-full rounded-xl border border-[#2A2A2A] bg-[#111111] px-4 py-3 text-white placeholder-gray-500 focus:border-[#FFD100] focus:outline-none focus:ring-1 focus:ring-[#FFD100] transition-all duration-150 resize-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="eventName" className={labelClass}>
            Event Name <span className="text-[#FFD100]">*</span>
          </label>
          <input
            id="eventName"
            type="text"
            value={formData.eventName ?? ""}
            onChange={(e) => set("eventName", e.target.value)}
            className={inputClass}
            placeholder="e.g. Club Meetup"
            required
          />
        </div>
        <div>
          <label htmlFor="organizerName" className={labelClass}>
            Organizer / Club Name <span className="text-[#FFD100]">*</span>
          </label>
          <input
            id="organizerName"
            type="text"
            value={formData.organizerName ?? ""}
            onChange={(e) => set("organizerName", e.target.value)}
            className={inputClass}
            placeholder="e.g. CS Student Society"
            required
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="relative z-[1]">
          <label htmlFor="preferredDate" className={labelClass}>
            Preferred Date <span className="text-[#FFD100]">*</span>
          </label>
          <input
            id="preferredDate"
            type="date"
            value={formData.preferredDate ?? ""}
            onChange={(e) => set("preferredDate", e.target.value)}
            className={inputClass}
            required
            aria-label="Preferred date (YYYY-MM-DD)"
          />
        </div>
        <div className="sm:col-span-2 sm:max-w-full">
          <TimeSlotButton
            id="timeSlot"
            label="Preferred Time Slot"
            value={formData.timeSlot ?? ""}
            onChange={(v) => set("timeSlot", v)}
            required
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="groupSize" className={labelClass}>
            Group Size <span className="text-[#FFD100]">*</span>
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
          <p className={labelClass}>
            Event Duration <span className="text-[#FFD100]">*</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {DURATION_OPTIONS.map((opt) => {
              const isSelected = (formData.durationMinutes ?? 60) === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set("durationMinutes", opt.value)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-[#1A1A1A] ${
                    isSelected
                      ? "border-2 border-[#FFD100] bg-[#FFD100] text-black"
                      : "border border-[#2A2A2A] bg-[#111111] text-gray-400 hover:border-[#FFD100]/50 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="sm:col-span-2">
          <EventTypeSelector
            id="eventType"
            label="Event Type"
            value={formData.eventType ?? ""}
            customValue={formData.eventTypeCustom ?? ""}
            onChange={(v, custom) => {
              set("eventType", v);
              if (custom !== undefined) set("eventTypeCustom", custom);
            }}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={formData.avRequired ?? false}
            onChange={(e) => set("avRequired", e.target.checked)}
            className="h-4 w-4 rounded border-[#2A2A2A] bg-[#111111] text-[#FFD100] focus:ring-[#FFD100]"
          />
          <span className="text-sm font-medium text-gray-400">AV Required</span>
        </label>
        <div
          className="overflow-hidden transition-[max-height] duration-200 ease-out"
          style={{ maxHeight: formData.avRequired ? "140px" : "0" }}
        >
          <div className="pt-2">
            <label htmlFor="avNotes" className="mb-1.5 block text-sm font-medium text-gray-500">
              AV Notes <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              id="avNotes"
              rows={2}
              value={formData.avNotes ?? ""}
              onChange={(e) => set("avNotes", e.target.value)}
              className={textareaClass}
              placeholder="e.g., microphones, HDMI, projector, recording..."
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={formData.accessibilityRequired ?? false}
            onChange={(e) => set("accessibilityRequired", e.target.checked)}
            className="h-4 w-4 rounded border-[#2A2A2A] bg-[#111111] text-[#FFD100] focus:ring-[#FFD100]"
          />
          <span className="text-sm font-medium text-gray-400">Accessibility Required</span>
        </label>
        <div
          className="overflow-hidden transition-[max-height] duration-200 ease-out"
          style={{ maxHeight: formData.accessibilityRequired ? "140px" : "0" }}
        >
          <div className="pt-2">
            <label htmlFor="accessibilityNotes" className="mb-1.5 block text-sm font-medium text-gray-500">
              Accessibility Notes <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              id="accessibilityNotes"
              rows={2}
              value={formData.accessibilityNotes ?? ""}
              onChange={(e) => set("accessibilityNotes", e.target.value)}
              className={textareaClass}
              placeholder="e.g., step-free access, seating needs, proximity to elevator..."
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 border-t border-[#2A2A2A] pt-6 sm:grid-cols-2">
        <div>
          <label htmlFor="preferredBuilding" className={labelClass}>
            Preferred Building <span className="text-gray-500">(optional)</span>
          </label>
          <select
            id="preferredBuilding"
            value={formData.preferredBuilding ?? ""}
            onChange={(e) => set("preferredBuilding", e.target.value)}
            className={inputClass}
          >
            {buildings.map((b) => (
              <option key={b.value || "any"} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="priorityLevel" className={labelClass}>
            Priority Level <span className="text-gray-500">(optional)</span>
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
          className="w-full rounded-xl bg-[#FFD100] px-6 py-4 text-lg font-semibold text-black shadow-lg transition-all duration-150 hover:bg-[#e6bc00] hover:shadow-[#FFD100]/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#FFD100] sm:w-auto sm:min-w-[220px]"
        >
          Find Available Rooms
        </button>
      </div>
    </form>
  );
}
