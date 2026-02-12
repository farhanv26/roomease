"use client";

import { useCallback, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onSelect: (yyyyMmDd: string) => void;
}

function toDate(str: string): Date | undefined {
  if (!str || str.length < 10) return undefined;
  const d = new Date(str + "T12:00:00");
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function toYyyyMmDd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DatePickerModal({
  isOpen,
  onClose,
  value,
  onSelect,
}: DatePickerModalProps) {
  const selected = toDate(value);
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
      aria-labelledby="date-picker-title"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3 mb-3">
          <h2 id="date-picker-title" className="text-lg font-semibold text-white">
            Select date
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
        <div
          className="rdp-root mx-auto [--rdp-accent-color:#FFD100] [--rdp-accent-background-color:rgba(255,209,0,0.2)] [--rdp-today-color:#FFD100]"
          style={{ color: "#e5e7eb" }}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(d) => {
              if (d) onSelect(toYyyyMmDd(d));
              onClose();
            }}
            required
          />
        </div>
      </div>
    </div>
  );
}
