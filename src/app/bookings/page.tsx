"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useBookings, type Booking, formatBookingTime } from "@/lib/bookingsStore";
import { EditBookingModal } from "@/components/EditBookingModal";
import { getBuildingTicketLabel } from "@/lib/buildings";
import { formatTimeSlot } from "@/types/booking";

type ViewMode = "list" | "calendar";

function getMonthGrid(year: number, month: number): (number | null)[] {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const firstWeekday = first.getDay();
  const daysInMonth = last.getDate();
  const pad = firstWeekday;
  const total = pad + daysInMonth;
  const cells: (number | null)[] = [];
  for (let i = 0; i < pad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function dateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function DayBookingsModal({
  dateLabel,
  dateStr: targetDate,
  bookings,
  onClose,
  onViewDetails,
  onEdit,
}: {
  dateLabel: string;
  dateStr: string;
  bookings: Booking[];
  onClose: () => void;
  onViewDetails: (b: Booking) => void;
  onEdit: (b: Booking) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="day-bookings-title"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        className="relative z-10 w-full max-w-md max-h-[80vh] flex flex-col rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#2A2A2A] p-4">
          <h2 id="day-bookings-title" className="text-lg font-semibold text-white">
            Bookings on {dateLabel}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-[#2A2A2A] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {bookings.length === 0 ? (
            <p className="text-gray-500 text-sm">No bookings on this day.</p>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-3 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">{b.eventName}</p>
                  <p className="text-sm text-gray-500">
                    {b.roomName} • {formatBookingTime(b)}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => { onViewDetails(b); onClose(); }}
                    className="rounded-lg border border-[#FFD100]/50 bg-transparent px-3 py-1.5 text-xs font-medium text-[#FFD100] hover:bg-[#FFD100]/10"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => { onEdit(b); onClose(); }}
                    className="rounded-lg border border-[#2A2A2A] bg-transparent px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function BookingDetailsModal({
  booking,
  isOpen,
  onClose,
}: {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-details-title"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        className="relative z-10 w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#2A2A2A] p-4">
          <div className="min-w-0">
            <h2 id="booking-details-title" className="truncate text-lg font-semibold text-white">
              {booking.eventName}
            </h2>
            <p className="mt-1 text-sm text-gray-500">Confirmation #{booking.confirmationNumber}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-[#2A2A2A] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Organizer</p>
              <p className="text-white font-medium">{booking.organizerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="inline-flex rounded-full border border-[#FFD100]/50 bg-[#FFD100]/10 px-2.5 py-1 text-xs font-medium text-[#FFD100]">
                {booking.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-white font-medium">{booking.preferredDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="text-white font-medium">{formatBookingTime(booking)}</p>
            </div>
          </div>

          <div className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-4">
            <p className="text-sm font-semibold text-white">Room</p>
            <p className="mt-1 text-gray-400">
              {booking.roomName} • {getBuildingTicketLabel(booking.building)} • Capacity {booking.capacity}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {booking.avBadges.map((b) => (
                <span
                  key={b}
                  className="inline-flex rounded-full border border-[#FFD100]/50 bg-[#FFD100]/10 px-2.5 py-1 text-xs font-medium text-[#FFD100]"
                >
                  {b}
                </span>
              ))}
              {booking.furnitureLabels &&
                booking.furnitureLabels.split(" • ").map((label) => (
                  <span
                    key={label}
                    className="inline-flex rounded-full border border-[#FFD100]/50 bg-[#FFD100]/10 px-2.5 py-1 text-xs font-medium text-[#FFD100]"
                  >
                    {label}
                  </span>
                ))}
            </div>
          </div>
        </div>
        <div className="border-t border-[#2A2A2A] p-4 flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#2A2A2A] bg-transparent px-4 py-2.5 font-medium text-gray-400 transition hover:border-[#FFD100]/50 hover:text-[#FFD100] focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MyBookingsPage() {
  const { bookings, cancelBooking } = useBookings();
  const [details, setDetails] = useState<Booking | null>(null);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth() + 1);
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());
  const [dayModal, setDayModal] = useState<{ dateStr: string; dateLabel: string } | null>(null);

  const hasBookings = bookings.length > 0;
  const list = useMemo(() => bookings, [bookings]);

  const monthGrid = useMemo(
    () => getMonthGrid(calendarYear, calendarMonth),
    [calendarYear, calendarMonth]
  );
  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    for (const b of bookings) {
      const d = b.preferredDate;
      if (!map[d]) map[d] = [];
      map[d].push(b);
    }
    return map;
  }, [bookings]);
  const dayModalBookings = dayModal ? (bookingsByDate[dayModal.dateStr] ?? []) : [];

  const prevMonth = () => {
    if (calendarMonth === 1) {
      setCalendarMonth(12);
      setCalendarYear((y) => y - 1);
    } else setCalendarMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calendarMonth === 12) {
      setCalendarMonth(1);
      setCalendarYear((y) => y + 1);
    } else setCalendarMonth((m) => m + 1);
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">My Bookings</h1>
          <p className="mt-1 text-gray-400">Your scheduled room reservations.</p>
        </div>
        {hasBookings && (
          <div className="flex rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-1">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                viewMode === "list"
                  ? "bg-[#FFD100] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                viewMode === "calendar"
                  ? "bg-[#FFD100] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Calendar
            </button>
          </div>
        )}
      </div>

      {!hasBookings ? (
        <div className="rounded-xl border-2 border-dashed border-[#FFD100]/40 bg-[#1A1A1A]/50 py-16 text-center">
          <p className="text-lg font-medium text-gray-400">No bookings yet</p>
          <Link
            href="/book"
            className="mt-4 inline-flex rounded-xl bg-[#FFD100] px-6 py-3 font-semibold text-black shadow-lg transition hover:bg-[#e6bc00] focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
          >
            Book a Room
          </Link>
        </div>
      ) : viewMode === "calendar" ? (
        <div className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {MONTH_NAMES[calendarMonth - 1]} {calendarYear}
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prevMonth}
                className="rounded-lg border border-[#2A2A2A] bg-[#111111] px-3 py-2 text-sm font-medium text-[#FFD100] hover:border-[#FFD100]/50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="rounded-lg border border-[#2A2A2A] bg-[#111111] px-3 py-2 text-sm font-medium text-[#FFD100] hover:border-[#FFD100]/50"
              >
                Next
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-2">{w}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {monthGrid.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} className="min-h-[80px] rounded-lg bg-[#111111]/50" />;
              }
              const dStr = dateStr(calendarYear, calendarMonth, day);
              const dayBookings = bookingsByDate[dStr] ?? [];
              const label = `${MONTH_NAMES[calendarMonth - 1]} ${day}, ${calendarYear}`;
              return (
                <button
                  key={dStr}
                  type="button"
                  onClick={() => setDayModal({ dateStr: dStr, dateLabel: label })}
                  className="min-h-[80px] rounded-lg border border-[#2A2A2A] bg-[#111111] p-2 text-left transition hover:border-[#FFD100]/40 focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                >
                  <span className="text-sm font-medium text-white">{day}</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {dayBookings.slice(0, 2).map((b) => (
                      <span
                        key={b.id}
                        className="inline-block max-w-full truncate rounded bg-[#FFD100]/20 px-1.5 py-0.5 text-[10px] text-[#FFD100]"
                        title={`${b.roomName} ${formatTimeSlot(b.timeSlot)}`}
                      >
                        {b.roomName} {formatTimeSlot(b.timeSlot)}
                      </span>
                    ))}
                    {dayBookings.length > 2 && (
                      <span className="text-[10px] text-gray-500">+{dayBookings.length - 2}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((b) => (
            <article
              key={b.id}
              className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-5 shadow-lg transition hover:border-[#FFD100]/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold text-white">{b.eventName}</h3>
                  <p className="mt-1 text-sm text-gray-500">{b.organizerName}</p>
                </div>
                <span className="inline-flex rounded-full border border-[#FFD100]/50 bg-[#FFD100]/10 px-2.5 py-1 text-xs font-medium text-[#FFD100]">
                  Confirmed
                </span>
              </div>

              <div className="mt-4 space-y-1 text-sm text-gray-400">
                <p>
                  <span className="text-gray-500">Date:</span> {b.preferredDate}
                </p>
                <p>
                  <span className="text-gray-500">Time:</span> {formatBookingTime(b)}
                </p>
                <p>
                  <span className="text-gray-500">Room:</span> {b.roomName}
                </p>
                <p className="text-gray-500">Confirmation #{b.confirmationNumber}</p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {b.avBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex rounded-full border border-[#FFD100]/50 bg-[#FFD100]/10 px-2.5 py-1 text-xs font-medium text-[#FFD100]"
                  >
                    {badge}
                  </span>
                ))}
                {b.furnitureLabels &&
                  b.furnitureLabels.split(" • ").map((label) => (
                    <span
                      key={label}
                      className="inline-flex rounded-full border border-[#FFD100]/50 bg-[#FFD100]/10 px-2.5 py-1 text-xs font-medium text-[#FFD100]"
                    >
                      {label}
                    </span>
                  ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => setDetails(b)}
                  className="rounded-xl border border-[#FFD100]/50 bg-transparent px-4 py-2.5 text-sm font-semibold text-[#FFD100] transition hover:bg-[#FFD100]/10 focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                >
                  View details
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(b)}
                  className="rounded-xl border border-[#FFD100]/50 bg-transparent px-4 py-2.5 text-sm font-semibold text-[#FFD100] transition hover:bg-[#FFD100]/10 focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const ok = window.confirm("Cancel this booking?");
                    if (ok) cancelBooking(b.id);
                  }}
                  className="rounded-xl border border-[#2A2A2A] bg-transparent px-4 py-2.5 text-sm font-medium text-gray-400 transition hover:border-red-500/60 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Cancel
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {details && <BookingDetailsModal booking={details} isOpen={!!details} onClose={() => setDetails(null)} />}
      {editing && (
        <EditBookingModal
          booking={editing}
          isOpen={!!editing}
          onClose={() => setEditing(null)}
        />
      )}
      {dayModal && (
        <DayBookingsModal
          dateLabel={dayModal.dateLabel}
          dateStr={dayModal.dateStr}
          bookings={dayModalBookings}
          onClose={() => setDayModal(null)}
          onViewDetails={setDetails}
          onEdit={setEditing}
        />
      )}
    </div>
  );
}

