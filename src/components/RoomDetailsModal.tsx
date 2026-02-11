"use client";

import { useEffect } from "react";
import { getRoomDetailEntries } from "@/data/rooms";
import type { Room } from "@/types/booking";

interface RoomDetailsModalProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
  onSelectRoom: () => void;
  groupSize: number;
  avRequired: boolean;
  accessibilityRequired: boolean;
}

export function RoomDetailsModal({
  room,
  isOpen,
  onClose,
  onSelectRoom,
  groupSize,
  avRequired,
  accessibilityRequired,
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
  const fitsGroup = room.capacity >= groupSize;
  const meetsAV = !avRequired || room.hasAV;
  const meetsAccessible = !accessibilityRequired || room.accessible;

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
          <div>
            <p className="text-sm text-gray-500">Capacity</p>
            <p className="text-white font-medium">{room.capacity}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {room.hasAV && (
              <span className="inline-flex rounded-full border border-[#FFD100]/50 bg-[#FFD100]/10 px-3 py-1 text-sm font-medium text-[#FFD100]">
                AV
              </span>
            )}
            {room.accessible && (
              <span className="inline-flex rounded-full border border-[#FFD100]/50 bg-[#FFD100]/10 px-3 py-1 text-sm font-medium text-[#FFD100]">
                Accessible
              </span>
            )}
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Details</h3>
            {details.length > 0 ? (
              <ul className="space-y-1.5 text-sm">
                {details.map(({ key, value }) => (
                  <li key={key} className="flex justify-between gap-2">
                    <span className="text-gray-400">{key}</span>
                    <span className="text-white">{value}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                More details will be available when integrated with UW inventory.
              </p>
            )}
          </div>
        </div>
        <div className="border-t border-[#2A2A2A] p-4 flex gap-3">
          <button
            type="button"
            onClick={onSelectRoom}
            className="flex-1 rounded-xl bg-[#FFD100] py-3 font-semibold text-black shadow-lg transition hover:bg-[#e6bc00] focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
          >
            Select this room
          </button>
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
