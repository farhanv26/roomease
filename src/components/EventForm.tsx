"use client";

import { useState } from "react";
import type { AvNeedKey } from "@/types/booking";
import type { EventFormData } from "@/types/booking";
import {
  AV_NEED_OPTIONS,
  DURATION_CUSTOM_MAX,
  DURATION_CUSTOM_MIN,
  DURATION_PRESETS,
  PRIORITY_LEVELS,
  formatDuration,
} from "@/types/booking";
import { BuildingButton } from "./BuildingButton";
import { DatePickerButton } from "./DatePickerButton";
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
  avNeedsEnabled: false,
  avNeeds: [],
  accessibilityRequired: false,
  preferredBuilding: "",
  priorityLevel: "Medium",
};

const CUSTOM_HOURS = [0, 1, 2, 3, 4, 5, 6];
const CUSTOM_MINUTES = [0, 15, 30, 45];

export function EventForm({ data, onChange, onSubmit, buildings }: EventFormProps) {
  const formData = { ...defaultFormData, ...data };
  const durationMin = formData.durationMinutes ?? 60;
  const isPreset = DURATION_PRESETS.some((p) => p.value === durationMin);
  const [isCustomDuration, setIsCustomDuration] = useState(!isPreset);
  const customHours = Math.floor(durationMin / 60);
  const customMinutes = durationMin % 60;
  const avNeeds = formData.avNeeds ?? [];

  const set = (key: keyof EventFormData, value: string | number | boolean | AvNeedKey[] | undefined) => {
    onChange({ ...formData, [key]: value });
  };

  const toggleAvNeed = (key: AvNeedKey) => {
    if (key === "none") {
      set("avNeeds", []);
      return;
    }
    const next = avNeeds.includes(key) ? avNeeds.filter((n) => n !== key) : [...avNeeds.filter((n) => n !== "none"), key];
    set("avNeeds", next);
  };

  const setCustomDuration = (hours: number, minutes: number) => {
    const total = hours * 60 + minutes;
    const clamped = Math.max(DURATION_CUSTOM_MIN, Math.min(DURATION_CUSTOM_MAX, total));
    set("durationMinutes", clamped);
  };

  const isEventTypeValid =
    formData.eventType !== "" &&
    (formData.eventType !== "Other" || (formData.eventTypeCustom ?? "").trim() !== "");
  const durationValid =
    durationMin >= DURATION_CUSTOM_MIN && durationMin <= DURATION_CUSTOM_MAX;
  const isValid =
    (formData.eventName?.trim() ?? "") !== "" &&
    (formData.organizerName?.trim() ?? "") !== "" &&
    (formData.preferredDate ?? "") !== "" &&
    (formData.timeSlot ?? "") !== "" &&
    (formData.groupSize ?? 0) > 0 &&
    isEventTypeValid &&
    durationValid;

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
      {/* 1. Preferred Date */}
      <DatePickerButton
        value={formData.preferredDate ?? ""}
        onChange={(v) => set("preferredDate", v)}
        label="Preferred Date"
        required
      />

      {/* 2. Preferred Time Slot */}
      <TimeSlotButton
        id="timeSlot"
        label="Preferred Time Slot"
        value={formData.timeSlot ?? ""}
        onChange={(v) => set("timeSlot", v)}
        required
      />

      {/* 3. Event Duration */}
      <div>
        <p className={labelClass}>
          Event Duration <span className="text-[#FFD100]">*</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {DURATION_PRESETS.map((opt) => {
            const isSelected = !isCustomDuration && durationMin === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setIsCustomDuration(false);
                  set("durationMinutes", opt.value);
                }}
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
          <button
            type="button"
            onClick={() => setIsCustomDuration(true)}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-[#1A1A1A] ${
              isCustomDuration
                ? "border-2 border-[#FFD100] bg-[#FFD100] text-black"
                : "border border-[#2A2A2A] bg-[#111111] text-gray-400 hover:border-[#FFD100]/50 hover:text-white"
            }`}
          >
            Custom
          </button>
        </div>
        {isCustomDuration && (
          <div className="mt-4 overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#111111] p-4 transition-all duration-200">
            <p className="mb-3 text-sm text-gray-400">Custom duration (30 min – 6 h)</p>
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label htmlFor="durHours" className="mb-1 block text-xs text-gray-500">Hours</label>
                <select
                  id="durHours"
                  value={customHours}
                  onChange={(e) => setCustomDuration(Number(e.target.value), customMinutes)}
                  className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-white focus:border-[#FFD100] focus:outline-none focus:ring-1 focus:ring-[#FFD100]"
                >
                  {CUSTOM_HOURS.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="durMinutes" className="mb-1 block text-xs text-gray-500">Minutes</label>
                <select
                  id="durMinutes"
                  value={customMinutes}
                  onChange={(e) => setCustomDuration(customHours, Number(e.target.value))}
                  className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-white focus:border-[#FFD100] focus:outline-none focus:ring-1 focus:ring-[#FFD100]"
                >
                  {CUSTOM_MINUTES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-[#FFD100]">
                Custom duration: {formatDuration(durationMin)}
              </p>
            </div>
            {!durationValid && (
              <p className="mt-2 text-xs text-red-400">
                Duration must be between 30 min and 6 h.
              </p>
            )}
          </div>
        )}
      </div>

      {/* 4. Group Size */}
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

      {/* Event Name, Organizer, Event Type */}
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

      {/* AV section: toggle + chips + optional notes */}
      <div className="space-y-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={formData.avNeedsEnabled ?? false}
            onChange={(e) => set("avNeedsEnabled", e.target.checked)}
            className="h-4 w-4 rounded border-[#2A2A2A] bg-[#111111] text-[#FFD100] focus:ring-[#FFD100]"
          />
          <span className="text-sm font-medium text-gray-400">I need AV / equipment</span>
        </label>
        <div
          className="overflow-hidden transition-[max-height] duration-200 ease-out"
          style={{ maxHeight: formData.avNeedsEnabled ? "400px" : "0" }}
        >
          <div className="pt-3 space-y-3">
            <p className="text-sm text-gray-500">What do you need?</p>
            <div className="flex flex-wrap gap-2">
              {AV_NEED_OPTIONS.map((opt) => {
                const isSelected = avNeeds.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleAvNeed(opt.value)}
                    className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-[#1A1A1A] ${
                      isSelected
                        ? "border-2 border-[#FFD100] bg-[#FFD100]/20 text-[#FFD100]"
                        : "border border-[#2A2A2A] bg-[#111111] text-gray-400 hover:border-[#FFD100]/50 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <div>
              <label htmlFor="avNotes" className="mb-1.5 block text-sm font-medium text-gray-500">
                Additional AV notes <span className="text-gray-500">(optional)</span>
              </label>
              <textarea
                id="avNotes"
                rows={2}
                value={formData.avNotes ?? ""}
                onChange={(e) => set("avNotes", e.target.value)}
                className={textareaClass}
                placeholder="e.g., specific equipment, setup needs..."
              />
            </div>
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
        <BuildingButton
          value={formData.preferredBuilding ?? ""}
          onChange={(v) => set("preferredBuilding", v)}
          buildings={buildings}
          label="Preferred Building"
        />
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
