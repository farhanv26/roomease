"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ROOMS } from "@/data/rooms";
import { getBuildingTicketLabel } from "@/lib/buildings";
import { useCompare } from "@/lib/compareStore";
import { useBookings } from "@/lib/bookingsStore";
import { AVAndFurnitureSections } from "@/components/AVAndFurnitureSections";
import { RoomDetailsModal } from "@/components/RoomDetailsModal";
import type { Room } from "@/types/booking";
import {
  roomHasDocumentCamera,
  roomIsElectronicClassroom,
  roomIsStreamingRecordingCapable,
} from "@/types/booking";
import { timeToMinutes, formatTimeSlot, formatDuration } from "@/types/booking";

function getQuickNotes(room: Room): string[] {
  const notes: string[] = [];
  if (room.capacity > 150) notes.push("Large capacity");
  else if (room.capacity >= 51) notes.push("Medium capacity");
  else notes.push("Small capacity");
  if (roomIsStreamingRecordingCapable(room)) notes.push("Streaming & recording");
  if (roomHasDocumentCamera(room)) notes.push("Document camera");
  if (roomIsElectronicClassroom(room)) notes.push("Electronic classroom");
  return notes;
}

function MiniAvailability({ room, date }: { room: Room; date: string }) {
  const { bookings } = useBookings();
  const dayBookings = useMemo(
    () =>
      bookings.filter(
        (b) => String(b.roomId) === String(room.id) && b.preferredDate === date
      ),
    [bookings, room.id, date]
  );
  const start = 9 * 60;
  const total = 13 * 60;

  if (dayBookings.length === 0) {
    return (
      <p className="text-xs text-gray-500">No bookings on this date.</p>
    );
  }
  return (
    <div className="relative h-8 w-full rounded border border-[#2A2A2A] bg-[#111111]">
      {dayBookings.map((b) => {
        const left = ((timeToMinutes(b.timeSlot) - start) / total) * 100;
        const w = ((b.durationMinutes ?? 60) / total) * 100;
        return (
          <div
            key={b.id}
            className="absolute top-1 bottom-1 rounded bg-[#FFD100]/30 border border-[#FFD100]/50"
            style={{ left: `${Math.max(0, left)}%`, width: `${Math.min(w, 100 - left)}%` }}
            title={`${formatTimeSlot(b.timeSlot)} – ${formatDuration(b.durationMinutes ?? 60)}`}
          />
        );
      })}
    </div>
  );
}

function CompareColumn({
  room,
  isHighestCapacity,
  index,
}: {
  room: Room;
  isHighestCapacity: boolean;
  index: number;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [availDate] = useState(() => new Date().toISOString().slice(0, 10));
  const notes = useMemo(() => getQuickNotes(room), [room]);

  return (
    <motion.div
      layout
      className={`flex min-w-[280px] max-w-[320px] flex-shrink-0 flex-col rounded-2xl border bg-[#1A1A1A] overflow-hidden ${
        isHighestCapacity ? "border-[#FFD100]/40 shadow-[0_0_0_1px_rgba(255,209,0,0.2)]" : "border-[#2A2A2A]"
      }`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b border-[#2A2A2A] bg-[#1A1A1A] p-5">
        <div>
          <h3 className="text-lg font-semibold text-white">{room.name}</h3>
          <p className="mt-1 text-sm text-gray-400">{getBuildingTicketLabel(room.building)}</p>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-[#FFD100]">{room.capacity}</span>
          <span className="text-xs text-gray-500">capacity</span>
        </div>
        <Link
          href={`/book?roomId=${encodeURIComponent(String(room.id))}`}
          className="mt-4 block w-full rounded-xl bg-[#FFD100] py-3 text-center text-sm font-semibold text-black shadow-lg transition hover:bg-[#e6bc00] focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
        >
          Book this room
        </Link>
      </div>

      <div className="flex-1 space-y-6 p-5">
        <section className="space-y-3">
          <AVAndFurnitureSections room={room} animatedBadges={false} compact />
        </section>
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Availability</p>
          <p className="mb-1 text-[10px] text-gray-500">{availDate}</p>
          <MiniAvailability room={room} date={availDate} />
        </section>
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Highlights</p>
          <ul className="space-y-1">
            {notes.map((n) => (
              <li key={n} className="text-sm text-gray-400">· {n}</li>
            ))}
          </ul>
        </section>
        <button
          type="button"
          onClick={() => setDetailsOpen(true)}
          className="w-full rounded-xl border border-[#2A2A2A] py-2.5 text-sm font-medium text-gray-400 transition hover:border-[#FFD100]/50 hover:text-[#FFD100]"
        >
          View full details
        </button>
      </div>

      {detailsOpen && (
        <RoomDetailsModal
          room={room}
          isOpen
          onClose={() => setDetailsOpen(false)}
          showStartBooking
        />
      )}
    </motion.div>
  );
}

export default function ComparePage() {
  const { compareIds, clearCompare } = useCompare();
  const [mobileIndex, setMobileIndex] = useState(0);

  const { bookings } = useBookings();
  const compareRooms = useMemo(() => {
    return compareIds
      .map((id) => ROOMS.find((r) => String(r.id) === id))
      .filter((r): r is Room => r != null);
  }, [compareIds]);

  const mostBookedBuildings = useMemo(() => {
    const byBuilding: Record<string, number> = {};
    for (const b of bookings) {
      const code = (b.building || "").trim();
      if (code) byBuilding[code] = (byBuilding[code] ?? 0) + 1;
    }
    return Object.entries(byBuilding)
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [bookings]);

  const maxCapacity = useMemo(
    () => (compareRooms.length ? Math.max(...compareRooms.map((r) => r.capacity)) : 0),
    [compareRooms]
  );

  if (compareRooms.length < 2) {
    const isSingle = compareRooms.length === 1;
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Compare Rooms</h1>
        <p className="mt-1 text-gray-400">
          {isSingle
            ? "Add one more room to compare side-by-side."
            : "Select 2–4 rooms from the Rooms dashboard or booking flow to compare."}
        </p>
        <div className="mt-12 rounded-2xl border-2 border-dashed border-[#FFD100]/40 bg-[#1A1A1A]/50 py-16 text-center">
          <p className="text-lg font-medium text-gray-400">
            {isSingle ? "Add one more room to compare" : "Add rooms to compare"}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {isSingle
              ? "Use \"Add to compare\" on another room card, then open Compare in the bar below."
              : "Use \"Add to compare\" in the quick-view overlay on room cards, then click Compare in the bar below."}
          </p>
          <Link
            href="/rooms"
            className="mt-6 inline-flex rounded-xl bg-[#FFD100] px-6 py-3 font-semibold text-black transition hover:bg-[#e6bc00] focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
          >
            {isSingle ? "Browse rooms to add" : "Browse rooms"}
          </Link>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-12 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-6"
        >
          <h2 className="text-lg font-semibold text-white">Most booked buildings</h2>
          <p className="mt-1 text-sm text-gray-500">Based on your bookings.</p>
          {mostBookedBuildings.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {mostBookedBuildings.map(({ code, count }) => (
                <span
                  key={code}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#FFD100]/30 bg-[#FFD100]/5 px-4 py-2.5 text-sm"
                >
                  <span className="font-medium text-[#FFD100]">{getBuildingTicketLabel(code)}</span>
                  <span className="text-gray-400">{count} booking{count !== 1 ? "s" : ""}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">No bookings yet. Book a room to see your most used buildings here.</p>
          )}
        </motion.section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Compare Rooms</h1>
          <p className="mt-1 text-gray-400">Side-by-side comparison of selected rooms.</p>
        </div>
        <button
          type="button"
          onClick={clearCompare}
          className="rounded-xl border border-[#2A2A2A] px-4 py-2.5 text-sm font-medium text-gray-400 transition hover:text-white"
        >
          Clear all
        </button>
      </div>

      {/* Mobile: segmented control */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 sm:hidden">
        {compareRooms.map((room, i) => (
          <button
            key={room.id}
            type="button"
            onClick={() => setMobileIndex(i)}
            className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              mobileIndex === i
                ? "border-[#FFD100] bg-[#FFD100] text-black"
                : "border-[#2A2A2A] text-gray-400 hover:text-white"
            }`}
          >
            {room.name}
          </button>
        ))}
      </div>

      {/* Desktop: horizontal scroll carousel */}
      <div className="hidden overflow-x-auto pb-8 sm:block">
        <div className="flex gap-6" style={{ minWidth: "min-content" }}>
          {compareRooms.map((room, i) => (
            <CompareColumn
              key={room.id}
              room={room}
              isHighestCapacity={room.capacity === maxCapacity && maxCapacity > 0}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Mobile: single column */}
      <div className="sm:hidden">
        {compareRooms[mobileIndex] && (
          <div className="pb-24">
            <CompareColumn
              key={compareRooms[mobileIndex].id}
              room={compareRooms[mobileIndex]}
              isHighestCapacity={compareRooms[mobileIndex].capacity === maxCapacity && maxCapacity > 0}
              index={0}
            />
          </div>
        )}
      </div>
    </div>
  );
}
