"use client";

import { useCallback, useEffect } from "react";
import { TIME_SLOTS_30MIN } from "@/types/booking";

interface TimeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onSelect: (value: string) => void;
}

export function TimeSlotModal({
  isOpen,
  onClose,
  value,
  onSelect,
}: TimeSlotModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="time-slot-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] p-4">
          <h2 id="time-slot-modal-title" className="text-lg font-semibold text-white">
            Select a Time Slot
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-[#2A2A2A] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-wrap gap-2">
            {TIME_SLOTS_30MIN.map((slot) => {
              const isSelected = value === slot.value;
              return (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => {
                    onSelect(slot.value);
                    onClose();
                  }}
                  className={`min-w-[5rem] rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-[#1A1A1A] ${
                    isSelected
                      ? "border-2 border-[#FFD100] bg-[#FFD100] text-black"
                      : "border border-[#2A2A2A] bg-[#111111] text-gray-400 hover:border-[#FFD100]/50 hover:text-white"
                  }`}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="border-t border-[#2A2A2A] p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111] py-3 font-medium text-gray-400 transition hover:border-[#FFD100]/50 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
