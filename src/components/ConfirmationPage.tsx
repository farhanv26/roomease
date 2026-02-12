"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import type { EventFormData } from "@/types/booking";
import type { Room } from "@/types/booking";
import { BookingSummary } from "./BookingSummary";

interface ConfirmationPageProps {
  formData: EventFormData;
  room: Room;
  confirmationNumber: string;
  onBookAnother: () => void;
}

export function ConfirmationPage({
  formData,
  room,
  confirmationNumber,
  onBookAnother,
}: ConfirmationPageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyConfirmation = useCallback(() => {
    navigator.clipboard.writeText(confirmationNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [confirmationNumber]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#FFD100]/20 ring-4 ring-[#FFD100]/30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <svg
            className="h-14 w-14 text-[#FFD100]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            />
          </svg>
        </motion.div>
        <h1 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
          Booking Confirmed
        </h1>
        <p className="mt-2 text-gray-400">
          Your confirmation ticket is below.
        </p>
      </div>

      <div className="mx-auto max-w-lg">
        <BookingSummary
          formData={formData}
          room={room}
          confirmationNumber={confirmationNumber}
          ticketStyle
        />
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/bookings"
          className="w-full rounded-xl bg-[#FFD100] px-8 py-3.5 text-center font-semibold text-black shadow-lg transition-all duration-150 hover:bg-[#e6bc00] hover:shadow-[#FFD100]/25 focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-black sm:w-auto"
        >
          View My Bookings
        </Link>
        <button
          type="button"
          onClick={onBookAnother}
          className="w-full rounded-xl border-2 border-[#FFD100]/50 bg-transparent px-8 py-3.5 font-semibold text-[#FFD100] transition hover:bg-[#FFD100]/10 focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-black sm:w-auto"
        >
          Book Another Room
        </button>
        <button
          type="button"
          onClick={handleCopyConfirmation}
          className="w-full rounded-xl border border-[#2A2A2A] bg-transparent px-6 py-3 font-medium text-gray-400 transition hover:border-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FFD100] sm:w-auto"
        >
          {copied ? "Copied!" : "Copy confirmation number"}
        </button>
      </div>
    </div>
  );
}
