"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getRoomDetailEntries } from "@/data/rooms";
import { getBuildingTicketLabel } from "@/lib/buildings";
import { AVAndFurnitureSections } from "@/components/AVAndFurnitureSections";
import { useBookings } from "@/lib/bookingsStore";
import type { Room } from "@/types/booking";
import { timeToMinutes, formatTimeSlot, formatDuration } from "@/types/booking";

interface RoomDetailsModalProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
  /** When true, show "Start booking with this room" linking to /book?building=... */
  showStartBooking?: boolean;
  /** When showStartBooking is false, used for "Select this room" */
  onSelectRoom?: () => void;
}

export function RoomDetailsModal({
  room,
  isOpen,
  onClose,
  showStartBooking,
  onSelectRoom,
}: RoomDetailsModalProps) {
  const { bookings } = useBookings();
  const [availabilityDate, setAvailabilityDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const details = getRoomDetailEntries(room);
  const availabilityBookings = useMemo(() => {
    return bookings.filter(
      (b) => String(b.roomId) === String(room.id) && b.preferredDate === availabilityDate
    );
  }, [bookings, room.id, availabilityDate]);

  const timelineStart = 9 * 60;
  const timelineEnd = 22 * 60;
  const timelineTotal = timelineEnd - timelineStart;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="room-details-title"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        className="relative z-10 w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#2A2A2A] p-4">
          <h2 id="room-details-title" className="text-lg font-semibold text-white">
            {room.name}
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Building</p>
            <p className="text-white font-medium">
              {getBuildingTicketLabel(room.building)}
            </p>
          </div>
          {room.roomNumber && (
            <div>
              <p className="text-sm text-gray-500">Room number</p>
              <p className="text-white font-medium">{room.roomNumber}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Capacity</p>
            <p className="text-white font-medium">{room.capacity}</p>
          </div>

          <div className="space-y-3">
            <AVAndFurnitureSections room={room} animatedBadges={false} />
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Availability</h3>
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setShowDatePicker((v) => !v)}
                className="rounded-lg border border-[#2A2A2A] bg-[#111111] px-3 py-2 text-sm text-[#FFD100] hover:border-[#FFD100]/50"
              >
                Pick a different date
              </button>
              {showDatePicker && (
                <input
                  type="date"
                  value={availabilityDate}
                  onChange={(e) => {
                    setAvailabilityDate(e.target.value);
                    setShowDatePicker(false);
                  }}
                  className="rounded-lg border border-[#2A2A2A] bg-[#111111] px-3 py-2 text-sm text-white"
                />
              )}
            </div>
            <p className="text-xs text-gray-500 mb-2">Showing {availabilityDate} (9:00 – 22:00)</p>
            {availabilityBookings.length === 0 ? (
              <p className="rounded-lg border border-[#2A2A2A] bg-[#111111] p-4 text-sm text-gray-500">
                No bookings for this room on this date.
              </p>
            ) : (
              <div className="relative h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]">
                {availabilityBookings.map((b) => {
                  const startM = timeToMinutes(b.timeSlot);
                  const endM = startM + (b.durationMinutes ?? 60);
                  const left = Math.max(0, ((startM - timelineStart) / timelineTotal) * 100);
                  const width = Math.min(
                    100 - left,
                    ((endM - startM) / timelineTotal) * 100
                  );
                  return (
                    <div
                      key={b.id}
                      className="absolute inset-y-1 rounded flex items-center justify-center overflow-hidden mx-0.5"
                      style={{
                        left: `${left}%`,
                        width: `${Math.max(width, 6)}%`,
                        minWidth: "2rem",
                      }}
                      title={`${formatTimeSlot(b.timeSlot)} – ${formatDuration(b.durationMinutes)}`}
                    >
                      <span className="rounded bg-[#FFD100]/30 border border-[#FFD100]/50 px-1.5 py-0.5 text-[10px] font-medium text-[#FFD100] truncate max-w-full">
                        {formatTimeSlot(b.timeSlot)}–{formatDuration(b.durationMinutes)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {details.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Other Details</h3>
              <ul className="space-y-1.5 text-sm">
                {details.map(({ key, value }) => (
                  <li key={key} className="flex justify-between gap-2">
                    <span className="text-gray-400">{key}</span>
                    <span className="text-white">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="border-t border-[#2A2A2A] p-4 flex gap-3">
          {showStartBooking ? (
            <Link
              href={`/book?roomId=${encodeURIComponent(String(room.id))}`}
              className="flex-1 rounded-xl bg-[#FFD100] py-3 text-center font-semibold text-black shadow-lg transition hover:bg-[#e6bc00] focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
            >
              Start booking with this room
            </Link>
          ) : (
            <button
              type="button"
              onClick={onSelectRoom}
              className="flex-1 rounded-xl bg-[#FFD100] py-3 font-semibold text-black shadow-lg transition hover:bg-[#e6bc00] focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
            >
              Select this room
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#2A2A2A] bg-transparent px-4 py-3 font-medium text-gray-400 hover:border-gray-500 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
