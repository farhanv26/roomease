import type { EventFormData } from "@/types/booking";
import type { Room } from "@/types/booking";

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
  const timeLabel =
    formData.timeSlot === "9-11am"
      ? "9–11am"
      : formData.timeSlot === "12-2pm"
        ? "12–2pm"
        : formData.timeSlot === "3-5pm"
          ? "3–5pm"
          : formData.timeSlot;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <p className="mb-4 text-sm font-medium uppercase tracking-wide text-gray-500">
        Confirmation #{confirmationNumber}
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Event Details
          </h3>
          <ul className="space-y-2 text-gray-900">
            <li>
              <span className="font-medium">Event:</span> {formData.eventName}
            </li>
            <li>
              <span className="font-medium">Organizer:</span> {formData.organizerName}
            </li>
            <li>
              <span className="font-medium">Date:</span> {formData.preferredDate}
            </li>
            <li>
              <span className="font-medium">Time:</span> {timeLabel}
            </li>
            <li>
              <span className="font-medium">Group size:</span> {formData.groupSize}
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Room Details
          </h3>
          <ul className="space-y-2 text-gray-900">
            <li>
              <span className="font-medium">Room:</span> {room.name}
            </li>
            <li>
              <span className="font-medium">Building:</span> {room.building}
            </li>
            <li>
              <span className="font-medium">Capacity:</span> {room.capacity}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
