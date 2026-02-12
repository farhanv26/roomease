"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBuildingTicketLabel } from "@/lib/buildings";
import { AVAndFurnitureSections } from "@/components/AVAndFurnitureSections";
import { useCompare } from "@/lib/compareStore";
import type { Room } from "@/types/booking";

interface RoomDashboardCardProps {
  room: Room;
  onViewDetails: () => void;
  /** When set to this room's id, show quick-view overlay (desktop hover). */
  hoveredRoomId?: string | number | null;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export function RoomDashboardCard({
  room,
  onViewDetails,
  hoveredRoomId,
  onHoverStart,
  onHoverEnd,
}: RoomDashboardCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { isInCompare, toggleCompare } = useCompare();

  const isHovered = hoveredRoomId !== undefined && String(hoveredRoomId) === String(room.id);
  const showOverlay = isHovered || quickViewOpen;
  const inCompare = isInCompare(room.id);

  const handleMouseEnter = useCallback(() => onHoverStart?.(), [onHoverStart]);
  const handleMouseLeave = useCallback(() => onHoverEnd?.(), [onHoverEnd]);

  const [shouldPulseCompareIcon, setShouldPulseCompareIcon] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const key = "roomease.comparePulseSeen";
      if (window.localStorage.getItem(key)) return;
      setShouldPulseCompareIcon(true);
      window.localStorage.setItem(key, "1");
      const timeout = window.setTimeout(() => setShouldPulseCompareIcon(false), 2000);
      return () => window.clearTimeout(timeout);
    } catch {
      // ignore storage errors
    }
  }, []);

  const ActionsPanel = ({ variant }: { variant: "overlay" | "mobile" }) => {
    if (variant === "overlay") {
      return (
        <div className="mt-4 flex gap-2 border-t border-[#2A2A2A] pt-4">
          <Link
            href={`/book?roomId=${encodeURIComponent(String(room.id))}`}
            className="flex h-10 flex-1 items-center justify-center rounded-xl bg-[#FFD100] px-4 text-sm font-semibold tracking-[0.01em] text-black shadow-lg transition duration-200 hover:bg-[#e6bc00] hover:shadow-[0_0_18px_rgba(255,209,0,0.35)] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-black"
          >
            Book this room
          </Link>
          <button
            type="button"
            onClick={() => {
              onViewDetails();
              setQuickViewOpen(false);
            }}
            className="flex h-10 flex-1 items-center justify-center rounded-xl border border-[#FFD100]/60 bg-transparent px-4 text-sm font-semibold text-[#FFD100] transition duration-200 hover:bg-[#FFD100]/12 focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-black"
          >
            View details
          </button>
        </div>
      );
    }

    // Mobile bottom sheet: full-width stacked actions including compare + close
    return (
      <div className="mt-5 flex flex-col gap-4 border-t border-[#2A2A2A] pt-4">
        <Link
          href={`/book?roomId=${encodeURIComponent(String(room.id))}`}
          className="flex w-full items-center justify-center rounded-2xl bg-[#FFD100] px-6 py-3 text-sm font-semibold tracking-[0.01em] text-black shadow-lg transition duration-200 hover:bg-[#e6bc00] hover:shadow-[0_0_25px_rgba(255,209,0,0.35)] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-black"
        >
          Book this room
        </Link>
        <button
          type="button"
          onClick={() => {
            onViewDetails();
            setQuickViewOpen(false);
          }}
          className="flex w-full items-center justify-center rounded-2xl border border-[#FFD100]/60 bg-transparent px-6 py-3 text-sm font-semibold text-[#FFD100] transition duration-200 hover:bg-[#FFD100]/12 focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-black"
        >
          View details
        </button>
        <button
          type="button"
          onClick={() => toggleCompare(room.id)}
          className="flex w-full items-center justify-center rounded-2xl border border-[#2A2A2A] bg-transparent px-6 py-3 text-sm font-medium text-gray-300 transition duration-200 hover:border-[#FFD100]/50 hover:text-[#FFD100] focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-black"
        >
          {inCompare ? "Remove from compare" : "Add to compare"}
        </button>
        {quickViewOpen && (
          <button
            type="button"
            onClick={() => setQuickViewOpen(false)}
            className="flex w-full items-center justify-center rounded-2xl border border-[#2A2A2A] px-6 py-3 text-sm text-gray-400 hover:text-white sm:hidden"
          >
            Close
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <motion.article
        className="relative flex flex-col rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-5 shadow-lg hover:shadow-xl min-h-[20rem] transition-all duration-200 ease-out hover:min-h-[22rem] focus-within:ring-2 focus-within:ring-[#FFD100]/50 focus-within:ring-offset-2 focus-within:ring-offset-black"
        data-room-id={room.id}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={false}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        transition={{ duration: 0.2 }}
        style={{
          boxShadow: showOverlay ? "0 20px 40px -12px rgba(255, 209, 0, 0.15)" : undefined,
        }}
      >
        {/* Base card: minimal, no buttons */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-white">{room.name}</h3>
            <span className="mt-1 inline-block rounded-md border border-[#2A2A2A] bg-[#111111] px-2.5 py-0.5 text-xs font-medium text-gray-400">
              {getBuildingTicketLabel(room.building)}
            </span>
          </div>
          <div className="shrink-0 text-right">
            <span className="text-2xl font-bold text-[#FFD100]">{room.capacity}</span>
            <span className="ml-1 text-sm text-gray-500">capacity</span>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <AVAndFurnitureSections room={room} animatedBadges />
        </div>

        {/* Desktop: hover overlay. Container pointer-events-none so clicks pass through when not on panel. */}
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              className="absolute inset-0 z-10 rounded-xl bg-black/90 p-6 backdrop-blur-md pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="pointer-events-auto flex h-full flex-col justify-between">
                {/* Meta + badges */}
                <div>
                  <p className="text-lg font-semibold text-white pr-10">{room.name}</p>
                  <p className="mt-1 text-sm text-gray-400">
                    {getBuildingTicketLabel(room.building)} · Capacity {room.capacity}
                  </p>
                  <div className="mt-4 space-y-2">
                    <AVAndFurnitureSections
                      room={room}
                      animatedBadges={false}
                      compact
                      maxFurnitureBadges={3}
                    />
                  </div>
                </div>

                <ActionsPanel variant="overlay" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compare icon + tooltip – anchored to card top-right, independent of layout */}
        {showOverlay && (
          <div className="absolute right-3 top-3 z-20 relative inline-flex group">
            <button
              type="button"
              onClick={() => toggleCompare(room.id)}
              aria-label={inCompare ? "Remove from compare" : "Add to compare"}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-black ${
                inCompare
                  ? "border-[#FFD100] bg-[#FFD100]/15 text-[#FFD100] shadow-[0_0_15px_rgba(255,209,0,0.35)]"
                  : "border-[#2A2A2A] bg-black/60 text-gray-300 hover:border-[#FFD100] hover:text-[#FFD100]"
              } ${shouldPulseCompareIcon ? "animate-pulse" : ""}`}
            >
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <rect x="4" y="7" width="8" height="8" rx="1.5" />
                <rect x="8" y="3" width="8" height="8" rx="1.5" />
              </svg>
            </button>
            <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 translate-y-1 scale-95 opacity-0 transition duration-150 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:translate-y-0">
              <div className="whitespace-nowrap rounded-lg border border-neutral-700/60 bg-neutral-900/95 px-2.5 py-1.5 text-xs text-gray-200 shadow-lg backdrop-blur-sm">
                {inCompare ? "Remove from compare" : "Add to compare"}
              </div>
              <div className="mx-auto mt-1 h-2 w-3 text-neutral-700/70">
                <svg viewBox="0 0 16 8" fill="currentColor" aria-hidden="true">
                  <path d="M0 0h16L8 8 0 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Mobile only: Quick view pill — no other buttons on base card */}
        <div className="mt-4 pt-4 border-t border-[#2A2A2A] sm:hidden">
          <button
            type="button"
            onClick={() => setQuickViewOpen(true)}
            className="rounded-full border border-[#FFD100]/50 bg-[#FFD100]/10 px-4 py-2 text-sm font-medium text-[#FFD100] transition hover:bg-[#FFD100]/20 focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
          >
            Quick view
          </button>
        </div>
      </motion.article>

      {/* Mobile quick-view modal (bottom sheet style) */}
      <AnimatePresence>
        {quickViewOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewOpen(false)}
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="quick-view-title"
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-[#2A2A2A] bg-[#1A1A1A] p-6 pb-8 sm:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <h2 id="quick-view-title" className="text-lg font-semibold text-white">
                {room.name}
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                {getBuildingTicketLabel(room.building)} · Capacity {room.capacity}
              </p>
              <div className="mt-4 space-y-2">
                <AVAndFurnitureSections room={room} animatedBadges={false} compact />
              </div>
              <ActionsPanel variant="mobile" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
