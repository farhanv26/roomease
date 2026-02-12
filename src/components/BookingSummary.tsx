import { furnitureLabelsFromCodes } from "@/lib/furniture";
import { getBuildingTicketLabel } from "@/lib/buildings";
import type { EventFormData } from "@/types/booking";
import type { Room } from "@/types/booking";
import { formatDuration, formatTimeSlot } from "@/types/booking";
import {
  roomHasDocumentCamera,
  roomIsElectronicClassroom,
  roomIsStreamingRecordingCapable,
} from "@/types/booking";
import { FeatureBadge } from "./FeatureBadge";

interface BookingSummaryProps {
  formData: EventFormData;
  room: Room;
  confirmationNumber: string;
  /** If true, render as compact ticket sections (for confirmation page). */
  ticketStyle?: boolean;
}

export function BookingSummary({
  formData,
  room,
  confirmationNumber,
  ticketStyle = false,
}: BookingSummaryProps) {
  const timeLabel = formatTimeSlot(formData.timeSlot);
  const durationLabel = formatDuration(formData.durationMinutes ?? 60);
  const buildingLabel = getBuildingTicketLabel(room.building);
  const furnitureLabels = furnitureLabelsFromCodes(room.furniture).filter((l) => l !== "(Unknown)");
  const avBadges: string[] = [];
  if (roomIsStreamingRecordingCapable(room)) avBadges.push("Streaming & Recording");
  if (roomIsElectronicClassroom(room)) avBadges.push("Electronic Classroom");
  if (roomHasDocumentCamera(room)) avBadges.push("Document Camera");

  if (ticketStyle) {
    return (
      <div className="rounded-xl border-2 border-[#FFD100]/30 bg-[#111111] p-6 sm:p-8 shadow-xl">
        <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-[#FFD100]">
          Confirmation #{confirmationNumber}
        </p>

        <div className="space-y-5">
          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Event</p>
            <p className="mt-1 text-white font-medium">{formData.eventName}</p>
            <p className="mt-0.5 text-sm text-gray-400">Organizer: {formData.organizerName}</p>
          </section>

          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Time</p>
            <p className="mt-1 text-white">{formData.preferredDate} • {timeLabel}</p>
            <p className="mt-0.5 text-sm text-gray-400">Duration: {durationLabel}</p>
          </section>

          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Room</p>
            <p className="mt-1 text-white font-medium">{room.name}</p>
            <p className="mt-0.5 text-sm text-gray-400">Capacity {room.capacity}</p>
          </section>

          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Building</p>
            <p className="mt-1 text-white">{buildingLabel}</p>
          </section>

          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Group size</p>
            <p className="mt-1 text-white">{formData.groupSize}</p>
          </section>

          {(avBadges.length > 0 || furnitureLabels.length > 0) && (
            <>
              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">AV Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {avBadges.map((b) => (
                    <FeatureBadge key={b} animated={false}>{b}</FeatureBadge>
                  ))}
                </div>
              </section>
              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Furniture Layout</p>
                <div className="flex flex-wrap gap-2">
                  {furnitureLabels.map((label) => (
                    <FeatureBadge key={label} animated={false}>{label}</FeatureBadge>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    );
  }

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
              <span className="font-medium text-gray-400">Building:</span> {buildingLabel}
            </li>
            <li>
              <span className="font-medium text-gray-400">Capacity:</span> {room.capacity}
            </li>
          </ul>
          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">AV Capabilities</p>
            <div className="flex flex-wrap gap-2">
              {avBadges.map((b) => (
                <FeatureBadge key={b} animated={false}>{b}</FeatureBadge>
              ))}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Furniture Layout</p>
            <div className="flex flex-wrap gap-2">
              {furnitureLabels.map((label) => (
                <FeatureBadge key={label} animated={false}>{label}</FeatureBadge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
