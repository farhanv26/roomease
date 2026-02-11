"use client";

import type { Room } from "@/types/booking";

interface RoomCardProps {
  room: Room;
  groupSize: number;
  avRequired: boolean;
  accessibilityRequired: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
  isBestMatch?: boolean;
}

export function RoomCard({
  room,
  groupSize,
  avRequired,
  accessibilityRequired,
  onSelect,
  onViewDetails,
  isBestMatch = false,
}: RoomCardProps) {
  const fitsGroup = room.capacity >= groupSize;
  const hasAV = room.hasAV;
  const hasAccessible = room.accessible;
  const meetsAV = !avRequired || hasAV;
  const meetsAccessible = !accessibilityRequired || hasAccessible;

  return (
    <div
      className={`rounded-xl border-2 bg-[#1A1A1A] p-6 shadow-xl transition-all duration-200 hover:shadow-2xl ${
        isBestMatch ? "border-[#FFD100]/60" : "border-[#2A2A2A] hover:border-[#FFD100]/40"
      }`}
    >
      {isBestMatch && (
        <div className="mb-4 inline-flex rounded-full bg-[#FFD100]/20 px-3 py-1 text-sm font-semibold text-[#FFD100]">
          Best Match
        </div>
      )}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">{room.name}</h2>
        <p className="mt-1 text-gray-400">{room.building}</p>
      </div>
      <p className="mb-4 text-gray-400">
        Capacity: <span className="text-white font-medium">{room.capacity}</span>
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {hasAV && (
          <span className="inline-flex rounded-full border border-[#FFD100]/50 bg-[#FFD100]/10 px-2.5 py-1 text-xs font-medium text-[#FFD100]">
            AV
          </span>
        )}
        {hasAccessible && (
          <span className="inline-flex rounded-full border border-[#FFD100]/50 bg-[#FFD100]/10 px-2.5 py-1 text-xs font-medium text-[#FFD100]">
            Accessible
          </span>
        )}
      </div>
      <div className="mb-6 rounded-lg border border-[#2A2A2A] bg-[#111111] p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Why this room</p>
        <ul className="space-y-1 text-sm text-gray-300">
          <li>• Fits your group size</li>
          {avRequired && <li>• {meetsAV ? "Meets AV requirement" : "AV not available"}</li>}
          {accessibilityRequired && <li>• {meetsAccessible ? "Meets accessibility requirement" : "Not accessible"}</li>}
        </ul>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onSelect}
          className="flex-1 rounded-xl bg-[#FFD100] px-4 py-3 font-semibold text-black shadow-lg transition hover:bg-[#e6bc00] focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
        >
          Select This Room
        </button>
        <button
          type="button"
          onClick={onViewDetails}
          className="rounded-xl border border-[#2A2A2A] bg-transparent px-4 py-3 font-medium text-gray-400 transition hover:border-[#FFD100]/50 hover:text-[#FFD100] focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
        >
          View details
        </button>
      </div>
    </div>
  );
}
