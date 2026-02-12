"use client";

import { useState } from "react";
import type { EventFormData } from "@/types/booking";
import type { Room } from "@/types/booking";
import { RoomCard } from "./RoomCard";
import { RoomDetailsModal } from "./RoomDetailsModal";

interface RoomRecommendationProps {
  formData: EventFormData;
  matchingRooms: Room[];
  onSelectRoom: (room: Room) => void;
  onBack: () => void;
  doubleBookingError: string | null;
}

export function RoomRecommendation({
  formData,
  matchingRooms,
  onSelectRoom,
  onBack,
  doubleBookingError,
}: RoomRecommendationProps) {
  const [detailsRoom, setDetailsRoom] = useState<Room | null>(null);

  if (matchingRooms.length === 0) {
    return (
      <div className="rounded-xl border-2 border-[#FFD100]/50 bg-[#1A1A1A] p-8 shadow-xl">
        <p className="text-gray-300">
          No rooms match your constraints. Try increasing flexibility (AV/Accessibility/Building) or adjusting group size.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 rounded-xl border border-[#2A2A2A] bg-transparent px-6 py-3 font-medium text-gray-400 transition hover:border-[#FFD100] hover:text-[#FFD100]"
        >
          Back
        </button>
      </div>
    );
  }

  const [bestMatch, ...otherRooms] = matchingRooms;

  return (
    <div className="space-y-6">
      {doubleBookingError && (
        <div
          className="rounded-xl border-2 border-[#FFD100]/60 bg-[#FFD100]/10 p-4 text-sm font-medium text-[#FFD100]"
          role="alert"
        >
          {doubleBookingError}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-[#2A2A2A] bg-transparent px-4 py-2.5 font-medium text-gray-400 transition hover:border-[#FFD100]/50 hover:text-[#FFD100]"
        >
          Back
        </button>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#FFD100]">Best Match</h3>
        <RoomCard
          room={bestMatch}
          groupSize={formData.groupSize}
          avNeedsEnabled={formData.avNeedsEnabled ?? false}
          avNeeds={formData.avNeeds ?? []}
          accessibilityRequired={formData.accessibilityRequired ?? false}
          onSelect={() => onSelectRoom(bestMatch)}
          onViewDetails={() => setDetailsRoom(bestMatch)}
          isBestMatch
        />
      </div>

      {otherRooms.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Other Available Rooms
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {otherRooms.map((room) => (
              <RoomCard
                key={String(room.id)}
                room={room}
                groupSize={formData.groupSize}
                avNeedsEnabled={formData.avNeedsEnabled ?? false}
                avNeeds={formData.avNeeds ?? []}
                accessibilityRequired={formData.accessibilityRequired ?? false}
                onSelect={() => onSelectRoom(room)}
                onViewDetails={() => setDetailsRoom(room)}
              />
            ))}
          </div>
        </div>
      )}

      {detailsRoom && (
        <RoomDetailsModal
          room={detailsRoom}
          isOpen={!!detailsRoom}
          onClose={() => setDetailsRoom(null)}
          onSelectRoom={() => {
            onSelectRoom(detailsRoom);
            setDetailsRoom(null);
          }}
        />
      )}
    </div>
  );
}
