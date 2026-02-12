"use client";

import { formatFurniture } from "@/lib/furniture";
import type { AvNeedKey } from "@/types/booking";
import type { Room } from "@/types/booking";
import { roomAvCapable } from "@/types/booking";

interface RoomCardProps {
  room: Room;
  groupSize: number;
  avNeedsEnabled: boolean;
  avNeeds: AvNeedKey[];
  accessibilityRequired: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
  isBestMatch?: boolean;
}

export function RoomCard({
  room,
  groupSize,
  avNeedsEnabled,
  avNeeds,
  accessibilityRequired,
  onSelect,
  onViewDetails,
  isBestMatch = false,
}: RoomCardProps) {
  const fitsGroup = room.capacity >= groupSize;
  const hasAV = roomAvCapable(room);
  const hasDocCamera = room.docCamera === true;
  const hasAccessible = room.accessible === true;
  const accessibilityUnknown = room.accessible !== true && room.accessible !== false;
  const needsProjectorOrHdmi = avNeeds.includes("projector") || avNeeds.includes("hdmi");
  const needsDocCamera = avNeeds.includes("docCamera");
  const meetsAV = !avNeedsEnabled || !needsProjectorOrHdmi || hasAV;
  const meetsDocCam = !avNeedsEnabled || !needsDocCamera || hasDocCamera;
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
      <p className="mb-2 text-gray-400">
        Capacity: <span className="text-white font-medium">{room.capacity}</span>
      </p>
      {room.furniture && (() => {
        const { short } = formatFurniture(room.furniture);
        return short ? <p className="mb-4 text-sm text-gray-500">Furniture: {short}</p> : null;
      })()}
      <div className="mb-4 flex flex-wrap gap-2">
        {hasAV && (
          <span className="inline-flex rounded-full border border-[#FFD100]/50 bg-[#FFD100]/10 px-2.5 py-1 text-xs font-medium text-[#FFD100]">
            AV (SR)
          </span>
        )}
        {hasDocCamera && (
          <span className="inline-flex rounded-full border border-[#FFD100]/50 bg-[#FFD100]/10 px-2.5 py-1 text-xs font-medium text-[#FFD100]">
            Doc Cam (D)
          </span>
        )}
        {hasAccessible && (
          <span className="inline-flex rounded-full border border-[#FFD100]/50 bg-[#FFD100]/10 px-2.5 py-1 text-xs font-medium text-[#FFD100]">
            Accessible
          </span>
        )}
        {accessibilityUnknown && (
          <span className="inline-flex rounded-full border border-[#2A2A2A] bg-[#2A2A2A] px-2.5 py-1 text-xs font-medium text-gray-400">
            Accessibility unknown
          </span>
        )}
      </div>
      <div className="mb-6 rounded-lg border border-[#2A2A2A] bg-[#111111] p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Why this room</p>
        <ul className="space-y-1 text-sm text-gray-300">
          <li>• Fits your group size</li>
          {avNeedsEnabled && needsProjectorOrHdmi && <li>• {meetsAV ? "Meets AV (display) requirement" : "AV (SR) not available"}</li>}
          {avNeedsEnabled && needsDocCamera && <li>• {meetsDocCam ? "Has document camera" : "Document camera not available"}</li>}
          {accessibilityRequired && <li>• {meetsAccessible ? "Meets accessibility requirement" : "Accessibility unknown or not available"}</li>}
        </ul>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onSelect}
          className="flex-1 rounded-xl bg-[#FFD100] px-4 py-3 font-semibold text-black shadow-lg transition hover:bg-[#e6bc00] focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
        >
          Select this room
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
