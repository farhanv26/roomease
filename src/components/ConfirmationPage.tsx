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
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFD100]/20 transition-transform duration-200">
          <svg
            className="h-12 w-12 text-[#FFD100]"
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
        <h1 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
          Room Successfully Booked
        </h1>
        <p className="mt-2 text-gray-400">
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
          className="rounded-xl bg-[#FFD100] px-8 py-3.5 font-semibold text-black shadow-lg transition-all duration-150 hover:bg-[#e6bc00] hover:shadow-[#FFD100]/25 focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-black"
        >
          Book Another Event
        </button>
      </div>
    </div>
  );
}
