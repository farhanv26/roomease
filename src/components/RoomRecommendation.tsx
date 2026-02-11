"use client";

import { MOCK_ROOMS } from "@/data/rooms";
import type { EventFormData } from "@/types/booking";
import type { Room } from "@/types/booking";
import { RoomCard } from "./RoomCard";

interface RoomRecommendationProps {
  formData: EventFormData;
  recommendedRoom: Room | null;
  onSelectRoom: () => void;
  onBack: () => void;
  doubleBookingError: string | null;
}

function getRecommendedRoom(formData: EventFormData, rooms: Room[]): Room | null {
  const { groupSize, avRequired, accessibilityRequired } = formData;
  const filtered = rooms.filter((room) => {
    if (room.capacity < groupSize) return false;
    if (avRequired && !room.hasAV) return false;
    if (accessibilityRequired && !room.accessible) return false;
    return true;
  });
  return filtered[0] ?? null;
}

export function RoomRecommendation({
  formData,
  recommendedRoom: recommendedRoomProp,
  onSelectRoom,
  onBack,
  doubleBookingError,
}: RoomRecommendationProps) {
  const recommendedRoom =
    recommendedRoomProp ?? getRecommendedRoom(formData, MOCK_ROOMS);

  if (!recommendedRoom) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-gray-600">
          No room matches your criteria. Try adjusting group size or requirements.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {doubleBookingError && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
          role="alert"
        >
          {doubleBookingError}
        </div>
      )}
      <RoomCard
        room={recommendedRoom}
        groupSize={formData.groupSize}
        avRequired={formData.avRequired}
        accessibilityRequired={formData.accessibilityRequired}
        onSelect={onSelectRoom}
        onBack={onBack}
      />
    </div>
  );
}
