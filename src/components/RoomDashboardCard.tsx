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
  const handleMouseLeave = useCallback(() => {
    onHoverEnd?.();
    setQuickViewOpen(false);
  }, [onHoverEnd]);

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
        <div className="mt-4 flex gap-3 border-t border-[rgba(255,255,255,0.06)] pt-4">
          <Link
            href={`/book?roomId=${encodeURIComponent(String(room.id))}`}
            className="flex h-10 flex-1 items-center justify-center rounded-full bg-[#FFD54A] px-4 text-sm font-semibold text-black shadow-lg transition-all duration-200 hover:bg-[#F6C445] hover:shadow-[#FFD54A]/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#FFD54A]/30"
          >
            Book this room
          </Link>
          <button
            type="button"
            onClick={() => {
              onViewDetails();
              setQuickViewOpen(false);
            }}
            className="flex h-10 flex-1 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-transparent px-4 text-sm font-semibold text-[rgba(255,255,255,0.92)] transition-all duration-200 hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.06)] focus:outline-none focus:ring-2 focus:ring-[#FFD54A]/30"
          >
            View details
          </button>
        </div>
      );
    }

    // Mobile bottom sheet: full-width stacked actions including compare + close
    return (
      <div className="mt-5 flex flex-col gap-3 border-t border-[rgba(255,255,255,0.06)] pt-4">
        <Link
          href={`/book?roomId=${encodeURIComponent(String(room.id))}`}
          className="flex w-full items-center justify-center rounded-full bg-[#FFD54A] px-6 py-3.5 text-sm font-semibold text-black shadow-lg transition-all duration-200 hover:bg-[#F6C445] hover:shadow-[#FFD54A]/25 focus:outline-none focus:ring-2 focus:ring-[#FFD54A]/30"
        >
          Book this room
        </Link>
        <button
          type="button"
          onClick={() => {
            onViewDetails();
            setQuickViewOpen(false);
          }}
          className="flex w-full items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-transparent px-6 py-3.5 text-sm font-semibold text-[rgba(255,255,255,0.92)] transition-all duration-200 hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.06)] focus:outline-none focus:ring-2 focus:ring-[#FFD54A]/30"
        >
          View details
        </button>
        <button
          type="button"
          onClick={() => toggleCompare(room.id)}
          className="flex w-full items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-transparent px-6 py-3.5 text-sm font-medium text-[rgba(255,255,255,0.65)] transition-all duration-200 hover:border-[rgba(255,255,255,0.12)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FFD54A]/30"
        >
          {inCompare ? "Remove from compare" : "Add to compare"}
        </button>
        {quickViewOpen && (
          <button
            type="button"
            onClick={() => setQuickViewOpen(false)}
            className="flex w-full items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] px-6 py-3.5 text-sm text-[rgba(255,255,255,0.65)] hover:text-white transition-all duration-200 sm:hidden"
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
        className="relative flex flex-col rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(17,17,19,0.75)] backdrop-blur-md p-6 shadow-lg hover:shadow-xl min-h-[20rem] transition-all duration-200 ease-out hover:min-h-[22rem] hover:border-[rgba(255,255,255,0.12)] hover:-translate-y-1 focus-within:ring-2 focus-within:ring-[#FFD54A]/30"
        data-room-id={room.id}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={false}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
        transition={{ duration: 0.2 }}
        style={{
          boxShadow: showOverlay ? "0 20px 60px rgba(0, 0, 0, 0.35)" : undefined,
        }}
      >
        {/* Base card: minimal, no buttons */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold tracking-tight text-[rgba(255,255,255,0.92)]">{room.name}</h3>
            <span className="mt-2 inline-block rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(17,17,19,0.75)] px-3 py-1 text-xs font-medium text-[rgba(255,255,255,0.65)]">
              {getBuildingTicketLabel(room.building)}
            </span>
          </div>
          <div className="shrink-0 text-right">
            <span className="text-2xl font-bold text-[#FFD54A]">{room.capacity}</span>
            <span className="ml-1 text-sm text-[rgba(255,255,255,0.48)]">capacity</span>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          <AVAndFurnitureSections room={room} animatedBadges />
        </div>

        {/* Desktop: hover overlay. Container pointer-events-none so clicks pass through when not on panel. */}
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              className="absolute inset-0 z-10 rounded-2xl bg-[rgba(11,11,12,0.95)] p-6 backdrop-blur-xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className="pointer-events-auto relative flex h-full flex-col justify-between"
                onClick={() => setQuickViewOpen(false)}
              >
                {/* Actions menu trigger (three-dot menu) */}
                <div className="absolute right-3 top-3 z-20">
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewOpen(true);
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(17,17,19,0.75)] text-[rgba(255,255,255,0.65)] hover:bg-[rgba(17,17,19,0.85)] hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFD54A]/30"
                    >
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <circle cx="4" cy="10" r="1.5" />
                        <circle cx="10" cy="10" r="1.5" />
                        <circle cx="16" cy="10" r="1.5" />
                      </svg>
                      <span className="sr-only">Open room actions</span>
                    </button>
                    {quickViewOpen && (
                      <div
                        className="absolute right-0 mt-2 w-40 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(17,17,19,0.85)] backdrop-blur-md py-1 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            toggleCompare(room.id);
                            setQuickViewOpen(false);
                          }}
                          className="flex w-full items-center px-3 py-2 text-left text-sm text-[rgba(255,255,255,0.92)] hover:bg-[rgba(255,255,255,0.06)] transition-colors duration-200"
                        >
                          {inCompare ? "Remove from compare" : "Add to compare"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Meta + badges */}
                <div>
                  <p className="text-lg font-semibold tracking-tight text-[rgba(255,255,255,0.92)] pr-10">{room.name}</p>
                  <p className="mt-1 text-sm text-[rgba(255,255,255,0.65)]">
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

        {/* Mobile only: Quick view pill — no other buttons on base card */}
        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)] sm:hidden">
          <button
            type="button"
            onClick={() => setQuickViewOpen(true)}
            className="rounded-full border border-[#FFD54A]/50 bg-[#FFD54A]/10 px-4 py-2 text-sm font-medium text-[#FFD54A] transition-all duration-200 hover:bg-[#FFD54A]/15 focus:outline-none focus:ring-2 focus:ring-[#FFD54A]/30"
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
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-[rgba(255,255,255,0.08)] bg-[rgba(17,17,19,0.85)] backdrop-blur-xl p-6 pb-8 sm:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <h2 id="quick-view-title" className="text-lg font-semibold tracking-tight text-[rgba(255,255,255,0.92)]">
                {room.name}
              </h2>
              <p className="mt-1 text-sm text-[rgba(255,255,255,0.65)]">
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
