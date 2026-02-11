import type { EventFormData } from "@/types/booking";
import type { Room } from "@/types/booking";
import { formatDuration, formatTimeSlot } from "@/types/booking";

interface BookingSummaryProps {
  formData: EventFormData;
  room: Room;
  confirmationNumber: string;
}

export function BookingSummary({
  formData,
  room,
  confirmationNumber,
}: BookingSummaryProps) {
  const timeLabel = formatTimeSlot(formData.timeSlot);
  const durationLabel = formatDuration(formData.durationMinutes ?? 60);
  const eventTypeLabel =
    formData.eventType === "Other" && formData.eventTypeCustom?.trim()
      ? formData.eventTypeCustom.trim()
      : formData.eventType;

  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-8">
      <p className="mb-4 text-sm font-medium uppercase tracking-wide text-[#FFD100]">
        Confirmation #{confirmationNumber}
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Event Details
          </h3>
          <ul className="space-y-2 text-white">
            <li>
              <span className="font-medium text-gray-400">Event:</span> {formData.eventName}
            </li>
            <li>
              <span className="font-medium text-gray-400">Organizer:</span> {formData.organizerName}
            </li>
            <li>
              <span className="font-medium text-gray-400">Date:</span> {formData.preferredDate}
            </li>
            <li>
              <span className="font-medium text-gray-400">Time:</span> {timeLabel}
            </li>
            <li>
              <span className="font-medium text-gray-400">Duration:</span> {durationLabel}
            </li>
            <li>
              <span className="font-medium text-gray-400">Event type:</span> {eventTypeLabel}
            </li>
            <li>
              <span className="font-medium text-gray-400">Group size:</span> {formData.groupSize}
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Room Details
          </h3>
          <ul className="space-y-2 text-white">
            <li>
              <span className="font-medium text-gray-400">Room:</span> {room.name}
            </li>
            <li>
              <span className="font-medium text-gray-400">Building:</span> {room.building}
            </li>
            <li>
              <span className="font-medium text-gray-400">Capacity:</span> {room.capacity}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
