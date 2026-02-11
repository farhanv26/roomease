"use client";

import { EVENT_TYPES } from "@/types/booking";

interface EventTypeSelectorProps {
  value: string;
  customValue: string;
  onChange: (value: string, customValue?: string) => void;
  id?: string;
  label?: string;
  required?: boolean;
}

export function EventTypeSelector({
  value,
  customValue,
  onChange,
  id = "eventType",
  label = "Event Type",
  required = true,
}: EventTypeSelectorProps) {
  const isOther = value === "Other";

  return (
    <div>
      <p className="mb-1.5 block text-sm font-medium text-gray-400">
        {label} {required && <span className="text-[#FFD100]">*</span>}
      </p>
      <div
        className="flex flex-wrap gap-2 rounded-xl border border-[#2A2A2A] bg-[#111111] p-3 focus-within:ring-1 focus-within:ring-[#FFD100]"
        role="group"
        aria-label={label}
      >
        {EVENT_TYPES.map((type) => {
          const isSelected = value === type.value;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange(type.value)}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-[#111111] ${
                isSelected
                  ? "border-2 border-[#FFD100] bg-[#FFD100] text-black"
                  : "border border-[#2A2A2A] bg-[#1A1A1A] text-gray-400 hover:border-[#FFD100]/50 hover:text-white"
              }`}
            >
              {type.label}
            </button>
          );
        })}
      </div>
      {isOther && (
        <div className="mt-3 overflow-hidden transition-[max-height] duration-200 ease-out" style={{ maxHeight: "80px" }}>
          <label htmlFor={`${id}-custom`} className="mb-1.5 block text-sm font-medium text-gray-500">
            Specify event type <span className="text-[#FFD100]">*</span>
          </label>
          <input
            id={`${id}-custom`}
            type="text"
            value={customValue}
            onChange={(e) => onChange("Other", e.target.value)}
            className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111] px-4 py-3 text-white placeholder-gray-500 focus:border-[#FFD100] focus:outline-none focus:ring-1 focus:ring-[#FFD100]"
            placeholder="e.g., Office hours, thesis defense..."
          />
        </div>
      )}
    </div>
  );
}
