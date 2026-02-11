"use client";

import { useCallback, useMemo, useState } from "react";
import { ROOMS, getBuildingsFromRooms } from "@/data/rooms";
import type { BookedSlot, EventFormData, Room } from "@/types/booking";
import { timeRangesOverlap, timeToMinutes } from "@/types/booking";
import { ConfirmationPage } from "@/components/ConfirmationPage";
import { EventForm } from "@/components/EventForm";
import { ProgressStepper } from "@/components/ProgressStepper";
import { RoomRecommendation } from "@/components/RoomRecommendation";

const TOTAL_STEPS = 3;

function getMatchingRooms(formData: EventFormData): Room[] {
  const { groupSize, avRequired, accessibilityRequired, preferredBuilding } = formData;
  return ROOMS.filter((room) => {
    if (room.capacity < groupSize) return false;
    if (avRequired && !room.hasAV) return false;
    if (accessibilityRequired && !room.accessible) return false;
    if (preferredBuilding && preferredBuilding.trim() !== "" && room.building !== preferredBuilding) return false;
    return true;
  });
}

let confirmationCounter = 1;
function generateConfirmationNumber(): string {
  const seq = String(confirmationCounter++).padStart(3, "0");
  return `CONF-2026-${seq}`;
}

const initialFormData: EventFormData = {
  eventName: "",
  organizerName: "",
  preferredDate: "",
  timeSlot: "",
  groupSize: 0,
  eventType: "",
  durationMinutes: 60,
  avRequired: false,
  accessibilityRequired: false,
  preferredBuilding: "",
  priorityLevel: "Medium",
};

const buildingsList = getBuildingsFromRooms(ROOMS);

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [doubleBookingError, setDoubleBookingError] = useState<string | null>(null);

  const matchingRooms = useMemo(() => getMatchingRooms(formData), [formData]);

  const handleFormSubmit = useCallback(() => {
    setDoubleBookingError(null);
    setStep(2);
  }, []);

  const handleSelectRoom = useCallback(
    (room: Room) => {
      const startM = timeToMinutes(formData.timeSlot);
      const durationM = formData.durationMinutes ?? 60;
      const isOverlap = bookedSlots.some((s) => {
        if (s.roomId !== room.id || s.date !== formData.preferredDate) return false;
        const existingStart = timeToMinutes(s.timeSlot);
        const existingDuration = s.durationMinutes ?? 60;
        return timeRangesOverlap(existingStart, existingDuration, startM, durationM);
      });
      if (isOverlap) {
        setDoubleBookingError("This room is already booked for that time.");
        return;
      }
      setBookedSlots((prev) => [
        ...prev,
        {
          roomId: room.id,
          roomName: room.name,
          date: formData.preferredDate,
          timeSlot: formData.timeSlot,
          durationMinutes: formData.durationMinutes ?? 60,
        },
      ]);
      setSelectedRoom(room);
      setConfirmationNumber(generateConfirmationNumber());
      setDoubleBookingError(null);
      setStep(3);
    },
    [formData.preferredDate, formData.timeSlot, formData.durationMinutes, bookedSlots]
  );

  const handleBack = useCallback(() => {
    setDoubleBookingError(null);
    setStep(1);
  }, []);

  const handleBookAnother = useCallback(() => {
    setFormData(initialFormData);
    setSelectedRoom(null);
    setConfirmationNumber("");
    setStep(1);
  }, []);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <ProgressStepper currentStep={step} totalSteps={TOTAL_STEPS} />

        {step === 1 && (
          <div className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-6 shadow-xl sm:p-8">
            <h2 className="mb-6 text-xl font-semibold text-white">
              Event Information
            </h2>
            <EventForm
              data={formData}
              onChange={setFormData}
              onSubmit={handleFormSubmit}
              buildings={buildingsList}
            />
          </div>
        )}

        {step === 2 && (
          <>
            <h2 className="mb-6 text-xl font-semibold text-white">
              Room Results
            </h2>
            <RoomRecommendation
              formData={formData}
              matchingRooms={matchingRooms}
              onSelectRoom={handleSelectRoom}
              onBack={handleBack}
              doubleBookingError={doubleBookingError}
            />
          </>
        )}

        {step === 3 && selectedRoom && (
          <div className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-6 shadow-xl sm:p-8">
            <ConfirmationPage
              formData={formData}
              room={selectedRoom}
              confirmationNumber={confirmationNumber}
              onBookAnother={handleBookAnother}
            />
          </div>
        )}
      </div>
    </div>
  );
}
