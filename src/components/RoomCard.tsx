import type { Room } from "@/types/booking";

interface RoomCardProps {
  room: Room;
  groupSize: number;
  avRequired: boolean;
  accessibilityRequired: boolean;
  onSelect: () => void;
  onBack: () => void;
}

export function RoomCard({
  room,
  groupSize,
  avRequired,
  accessibilityRequired,
  onSelect,
  onBack,
}: RoomCardProps) {
  const fitsGroup = room.capacity >= groupSize;
  const showAV = avRequired && room.hasAV;
  const showAccessible = accessibilityRequired && room.accessible;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">{room.name}</h2>
        <p className="mt-1 text-gray-500">{room.building}</p>
      </div>

      <div className="mb-6">
        <p className="text-lg font-medium text-gray-700">
          Capacity: <span className="text-gray-900">{room.capacity}</span>
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {fitsGroup && (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            Fits Your Group Size
          </span>
        )}
        {showAV && (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            AV Compatible
          </span>
        )}
        {showAccessible && (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
            Accessible
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onSelect}
          className="flex-1 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Select This Room
        </button>
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-gray-300 bg-white px-6 py-3.5 font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
        >
          Back
        </button>
      </div>
    </div>
  );
}
