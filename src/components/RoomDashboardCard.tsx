"use client";

import { formatFurniture } from "@/lib/furniture";
import type { Room } from "@/types/booking";
import { roomAvCapable } from "@/types/booking";

interface RoomDashboardCardProps {
  room: Room;
  onViewDetails: () => void;
}

export function RoomDashboardCard({ room, onViewDetails }: RoomDashboardCardProps) {
  const avCapable = roomAvCapable(room);
  const docCamera = room.docCamera === true;

  return (
    <article
      className="flex flex-col rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-5 shadow-lg transition-all duration-200 hover:border-[#FFD100]/40 hover:shadow-[#FFD100]/5"
      data-room-id={room.id}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-white">{room.name}</h3>
          <span className="mt-1 inline-block rounded-md border border-[#2A2A2A] bg-[#111111] px-2.5 py-0.5 text-xs font-medium text-gray-400">
            {room.building}
          </span>
        </div>
        <div className="shrink-0 text-right">
          <span className="text-2xl font-bold text-[#FFD100]">{room.capacity}</span>
          <span className="ml-1 text-sm text-gray-500">capacity</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {avCapable && (
          <span className="inline-flex rounded-full border border-[#FFD100]/50 bg-[#FFD100]/10 px-2.5 py-1 text-xs font-medium text-[#FFD100]">
            AV (SR)
          </span>
        )}
        {docCamera && (
          <span className="inline-flex rounded-full border border-[#FFD100]/50 bg-[#FFD100]/10 px-2.5 py-1 text-xs font-medium text-[#FFD100]">
            Doc Cam (D)
          </span>
        )}
      </div>

      {room.furniture && (() => {
        const { short } = formatFurniture(room.furniture);
        return short ? <p className="mt-3 text-sm text-gray-500">Furniture: {short}</p> : null;
      })()}

      <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
        <button
          type="button"
          onClick={onViewDetails}
          className="w-full rounded-xl border border-[#FFD100]/50 bg-transparent py-2.5 text-sm font-semibold text-[#FFD100] transition-all duration-150 hover:bg-[#FFD100]/10 focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
        >
          View details
        </button>
      </div>
    </article>
  );
}
