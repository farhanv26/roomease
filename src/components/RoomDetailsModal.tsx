"use client";

import Link from "next/link";
import { useEffect } from "react";
import { getRoomDetailEntries } from "@/data/rooms";
import { formatFurniture } from "@/lib/furniture";
import type { Room } from "@/types/booking";
import { roomAvCapable } from "@/types/booking";

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
  const avCapable = roomAvCapable(room);
  const docCamera = room.docCamera === true;

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
            <p className="text-white font-medium">{room.building}</p>
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
          {room.furniture && (() => {
            const { full } = formatFurniture(room.furniture);
            return full ? (
              <div>
                <p className="text-sm text-gray-500">Furniture</p>
                <p className="text-white font-medium">{full}</p>
              </div>
            ) : null;
          })()}

          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">AV & equipment</h3>
            <p className="mb-2 text-xs text-gray-500">
              SR = AV-compatible (display/projector support). D = document camera available. Asterisks (*) in source data are ignored.
            </p>
            <ul className="space-y-1.5 text-sm">
              {avCapable && (
                <li className="text-[#FFD100]">AV (SR) — display/projector support</li>
              )}
              {docCamera && (
                <li className="text-[#FFD100]">Doc Cam (D) — document camera available</li>
              )}
              {!avCapable && !docCamera && (
                <li className="text-gray-500">No AV features listed</li>
              )}
            </ul>
          </div>

          <div>
            <p className="text-sm text-gray-500">Accessible</p>
            <p className="text-white font-medium">{room.accessible ? "Yes" : "No"}</p>
          </div>

          {room.rawFeatureCode && (
            <div>
              <p className="text-sm text-gray-500">Raw feature code</p>
              <p className="font-mono text-xs text-gray-500">{room.rawFeatureCode}</p>
            </div>
          )}

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
              href={`/book?building=${encodeURIComponent(room.building || "")}`}
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
