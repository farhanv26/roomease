"use client";

import { useState } from "react";
import { DatePickerModal } from "./DatePickerModal";

interface DatePickerButtonProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

function formatDisplayDate(yyyyMmDd: string): string {
  if (!yyyyMmDd || yyyyMmDd.length < 10) return "Select date";
  const [y, m, d] = yyyyMmDd.split("-");
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = monthNames[parseInt(m ?? "1", 10) - 1];
  return `${month} ${d}, ${y}`;
}

export function DatePickerButton({
  value,
  onChange,
  label = "Preferred Date",
  required = true,
}: DatePickerButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <p className="mb-1.5 block text-sm font-medium text-gray-400">
        {label} {required && <span className="text-[#FFD100]">*</span>}
      </p>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111] px-4 py-3 text-left text-white transition-all duration-150 hover:border-[#FFD100]/50 focus:border-[#FFD100] focus:outline-none focus:ring-1 focus:ring-[#FFD100]"
      >
        {formatDisplayDate(value)}
      </button>
      <DatePickerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        value={value}
        onSelect={(v) => {
          onChange(v);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
