"use client";

import { useCallback, useMemo, useState } from "react";
import { MOCK_ROOMS } from "@/data/rooms";
import type { BookedSlot, EventFormData, Room } from "@/types/booking";
import { ConfirmationPage } from "@/components/ConfirmationPage";
import { EventForm } from "@/components/EventForm";
import { ProgressStepper } from "@/components/ProgressStepper";
import { RoomRecommendation } from "@/components/RoomRecommendation";

const TOTAL_STEPS = 3;

function getRecommendedRoom(formData: EventFormData): Room | null {
  const { groupSize, avRequired, accessibilityRequired } = formData;
  const filtered = MOCK_ROOMS.filter((room) => {
    if (room.capacity < groupSize) return false;
    if (avRequired && !room.hasAV) return false;
    if (accessibilityRequired && !room.accessible) return false;
    return true;
  });
  return filtered[0] ?? null;
}

let confirmationCounter = 1;
function generateConfirmationNumber(): string {
  const year = new Date().getFullYear();
  const seq = String(confirmationCounter++).padStart(3, "0");
  return `CONF-${year}-${seq}`;
}

const initialFormData: EventFormData = {
  eventName: "",
  organizerName: "",
  preferredDate: "",
  timeSlot: "",
  groupSize: 0,
  eventType: "",
  avRequired: false,
  accessibilityRequired: false,
  preferredBuilding: "",
  priorityLevel: "Medium",
};

export default function Home() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [doubleBookingError, setDoubleBookingError] = useState<string | null>(null);

  const recommendedRoom = useMemo(
    () => getRecommendedRoom(formData),
    [formData]
  );

  const handleFormSubmit = useCallback(() => {
    setDoubleBookingError(null);
    setStep(2);
  }, []);

  const handleSelectRoom = useCallback(() => {
    if (!recommendedRoom) return;
    const key = {
      roomId: recommendedRoom.id,
      date: formData.preferredDate,
      timeSlot: formData.timeSlot,
    };
    const isBooked = bookedSlots.some(
      (s) =>
        s.roomId === key.roomId &&
        s.date === key.date &&
        s.timeSlot === key.timeSlot
    );
    if (isBooked) {
      setDoubleBookingError(
        "This room is already booked for that time."
      );
      return;
    }
    setBookedSlots((prev) => [
      ...prev,
      {
        roomId: recommendedRoom.id,
        roomName: recommendedRoom.name,
        date: formData.preferredDate,
        timeSlot: formData.timeSlot,
      },
    ]);
    setSelectedRoom(recommendedRoom);
    setConfirmationNumber(generateConfirmationNumber());
    setDoubleBookingError(null);
    setStep(3);
  }, [recommendedRoom, formData.preferredDate, formData.timeSlot, bookedSlots]);

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
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            RoomEase
          </h1>
          <p className="mt-2 text-gray-500">
            University room booking
          </p>
        </header>

        <ProgressStepper currentStep={step} totalSteps={TOTAL_STEPS} />

        {step === 1 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Event Information
            </h2>
            <EventForm
              data={formData}
              onChange={setFormData}
              onSubmit={handleFormSubmit}
            />
          </div>
        )}

        {step === 2 && (
          <>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Recommended Room
            </h2>
            <RoomRecommendation
              formData={formData}
              recommendedRoom={recommendedRoom}
              onSelectRoom={handleSelectRoom}
              onBack={handleBack}
              doubleBookingError={doubleBookingError}
            />
          </>
        )}

        {step === 3 && selectedRoom && (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <ConfirmationPage
              formData={formData}
              room={selectedRoom}
              confirmationNumber={confirmationNumber}
              onBookAnother={handleBookAnother}
            />
          </div>
        )}
      </div>
    </main>
  );
}
