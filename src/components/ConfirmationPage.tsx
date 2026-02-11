import type { EventFormData } from "@/types/booking";
import type { Room } from "@/types/booking";
import { BookingSummary } from "./BookingSummary";

interface ConfirmationPageProps {
  formData: EventFormData;
  room: Room;
  confirmationNumber: string;
  onBookAnother: () => void;
}

export function ConfirmationPage({
  formData,
  room,
  confirmationNumber,
  onBookAnother,
}: ConfirmationPageProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg
            className="h-10 w-10 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
          Room Successfully Booked
        </h1>
        <p className="mt-2 text-gray-500">
          Your booking has been confirmed.
        </p>
      </div>

      <BookingSummary
        formData={formData}
        room={room}
        confirmationNumber={confirmationNumber}
      />

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onBookAnother}
          className="rounded-xl bg-emerald-600 px-8 py-3.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Book Another Event
        </button>
      </div>
    </div>
  );
}
