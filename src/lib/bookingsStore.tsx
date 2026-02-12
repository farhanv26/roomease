"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Room } from "@/types/booking";
import { formatDuration, formatTimeSlot } from "@/types/booking";
import { formatFurniture } from "@/lib/furniture";
import {
  roomHasDocumentCamera,
  roomIsElectronicClassroom,
  roomIsStreamingRecordingCapable,
} from "@/types/booking";

export type BookingStatus = "Confirmed";

export interface Booking {
  id: string;
  status: BookingStatus;
  confirmationNumber: string;
  createdAtIso: string;
  // Event
  eventName: string;
  organizerName: string;
  eventType: string;
  preferredDate: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM
  durationMinutes: number;
  groupSize: number;
  // Room
  roomId: string;
  roomName: string;
  building: string;
  capacity: number;
  furnitureLabels: string; // display-only, no codes
  avBadges: string[]; // display-only, no codes
}

const STORAGE_KEY = "roomease.bookings.v1";
const SEQ_KEY = "roomease.confirmationSeq.v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function getAvBadges(room: Room): string[] {
  const out: string[] = [];
  if (roomIsStreamingRecordingCapable(room)) out.push("Streaming & Recording Ready");
  if (roomIsElectronicClassroom(room)) out.push("Electronic Classroom");
  if (roomHasDocumentCamera(room)) out.push("Document Camera Available");
  return out;
}

function getFurnitureLabelsLine(room: Room): string {
  const short = formatFurniture(room.furniture).short;
  return short ? short.split("; ").join(" • ") : "";
}

function nextConfirmationNumber(seq: number): { confirmationNumber: string; nextSeq: number } {
  const num = String(seq).padStart(3, "0");
  return { confirmationNumber: `CONF-2026-${num}`, nextSeq: seq + 1 };
}

export type BookingUpdate = Partial<
  Pick<
    Booking,
    | "eventName"
    | "organizerName"
    | "preferredDate"
    | "timeSlot"
    | "durationMinutes"
    | "groupSize"
  >
>;

interface BookingsContextValue {
  bookings: Booking[];
  addBooking: (args: { form: any; room: Room }) => Booking;
  updateBooking: (bookingId: string, updates: BookingUpdate) => void;
  cancelBooking: (bookingId: string) => void;
}

const BookingsContext = createContext<BookingsContextValue | null>(null);

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [seq, setSeq] = useState<number>(1);

  // Hydrate
  useEffect(() => {
    const stored = safeParse<Booking[]>(localStorage.getItem(STORAGE_KEY), []);
    const storedSeq = safeParse<number>(localStorage.getItem(SEQ_KEY), 1);
    setBookings(Array.isArray(stored) ? stored : []);
    setSeq(typeof storedSeq === "number" && storedSeq > 0 ? storedSeq : 1);
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);
  useEffect(() => {
    localStorage.setItem(SEQ_KEY, JSON.stringify(seq));
  }, [seq]);

  const addBooking = useCallback(
    ({ form, room }: { form: any; room: Room }) => {
      const { confirmationNumber, nextSeq: n } = nextConfirmationNumber(seq);
      setSeq(n);
      const createdAtIso = new Date().toISOString();
      const booking: Booking = {
        id: `${confirmationNumber}-${String(room.id)}`,
        status: "Confirmed",
        confirmationNumber,
        createdAtIso,
        eventName: String(form.eventName ?? ""),
        organizerName: String(form.organizerName ?? ""),
        eventType: String(form.eventType ?? ""),
        preferredDate: String(form.preferredDate ?? ""),
        timeSlot: String(form.timeSlot ?? ""),
        durationMinutes: Number(form.durationMinutes ?? 60),
        groupSize: Number(form.groupSize ?? 0),
        roomId: String(room.id),
        roomName: room.name,
        building: room.building,
        capacity: room.capacity,
        furnitureLabels: getFurnitureLabelsLine(room),
        avBadges: getAvBadges(room),
      };
      setBookings((prev) => [booking, ...prev]);
      return booking;
    },
    [seq]
  );

  const updateBooking = useCallback((bookingId: string, updates: BookingUpdate) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              ...updates,
              id: b.id,
              confirmationNumber: b.confirmationNumber,
              status: b.status,
              createdAtIso: b.createdAtIso,
              roomId: b.roomId,
              roomName: b.roomName,
              building: b.building,
              capacity: b.capacity,
              furnitureLabels: b.furnitureLabels,
              avBadges: b.avBadges,
            }
          : b
      )
    );
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  }, []);

  const value = useMemo(
    () => ({ bookings, addBooking, updateBooking, cancelBooking }),
    [bookings, addBooking, updateBooking, cancelBooking]
  );

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used within BookingsProvider");
  return ctx;
}

export function formatBookingTime(b: Booking): string {
  return `${formatTimeSlot(b.timeSlot)} • ${formatDuration(b.durationMinutes)}`;
}

