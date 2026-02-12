"use client";

import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoomDashboardCard } from "@/components/RoomDashboardCard";
import { RoomDetailsModal } from "@/components/RoomDetailsModal";
import {
  filterAndSortRooms,
  RoomsFilters,
  useRoomsFilters,
} from "@/components/RoomsFilters";
import { ROOMS } from "@/data/rooms";
import type { Room } from "@/types/booking";

export default function RoomsDashboardPage() {
  const filters = useRoomsFilters();
  const [detailsRoom, setDetailsRoom] = useState<Room | null>(null);
  const [hoveredRoomId, setHoveredRoomId] = useState<string | number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const finalRooms = useMemo(() => {
    return filterAndSortRooms(ROOMS, filters.state);
  }, [filters.state]);

  const handleHoverStart = useCallback((room: Room) => () => setHoveredRoomId(room.id), []);
  const handleHoverEnd = useCallback(() => setHoveredRoomId(null), []);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Top toolbar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Bookable Rooms
            </h1>
            <p className="mt-1 text-gray-400">
              Browse capacity and features across campus.
            </p>
          </div>
        <div className="flex flex-1 flex-col gap-3 sm:max-w-xl sm:flex-row sm:items-center sm:justify-end">
            <div className="flex flex-1 items-center gap-2">
              <input
                type="search"
                value={filters.state.search}
                onChange={(e) => filters.setSearch(e.target.value)}
                placeholder="Search by room or building..."
                className="w-full rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-2.5 text-white placeholder-gray-500 focus:border-[#FFD100] focus:outline-none focus:ring-1 focus:ring-[#FFD100] sm:w-auto"
                style={{ minWidth: "28ch", maxWidth: "40ch" }}
                aria-label="Search rooms"
              />
            </div>
            <div className="grid grid-cols-[auto_auto_auto] items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-500">
                <span>Sort</span>
                <select
                  value={filters.state.sort}
                  onChange={(e) => filters.setSort(e.target.value as any)}
                  className="rounded-lg border border-[#2A2A2A] bg-[#111111] px-3 py-2 text-sm text-white focus:border-[#FFD100] focus:outline-none focus:ring-1 focus:ring-[#FFD100]"
                >
                  <option value="recommended">Recommended</option>
                  <option value="capacity-low">Capacity: Low → High</option>
                  <option value="capacity-high">Capacity: High → Low</option>
                  <option value="name-az">Name: A → Z</option>
                </select>
              </label>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2A2A2A] bg-[#111111] px-4 py-2.5 text-sm font-medium text-gray-200 transition hover:border-[#FFD100]/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-black"
              >
                <span>Filters</span>
                {filters.hasActiveFilters && (
                  <span className="text-xs text-[#FFD100]">●</span>
                )}
              </button>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={filters.resetFilters}
                  className={`rounded-xl border border-[#FFD100]/50 bg-transparent px-4 py-2.5 text-sm font-medium text-[#FFD100] transition hover:bg-[#FFD100]/10 focus:outline-none focus:ring-2 focus:ring-[#FFD100] ${
                    filters.hasActiveFilters ? "" : "opacity-0 pointer-events-none"
                  }`}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {filters.activeFilterPills.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Active:</span>
            {filters.activeFilterPills.map((pill) => (
              <button
                key={pill.key}
                type="button"
                onClick={() => filters.removeFilterByKey(pill.key)}
                className="inline-flex items-center gap-2 rounded-full border border-[#FFD100]/40 bg-[#FFD100]/10 px-3 py-1 text-xs font-medium text-[#FFD100] hover:bg-[#FFD100]/20"
              >
                <span>{pill.label}</span>
                <span aria-hidden="true" className="text-[10px]">
                  ✕
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="mb-4 text-sm text-gray-500">
        Showing {finalRooms.length} of {ROOMS.length} rooms
      </p>

      {finalRooms.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-[#FFD100]/40 bg-[#1A1A1A]/50 py-16 text-center">
          <p className="text-lg font-medium text-gray-400">No rooms match your filters.</p>
          <button
            type="button"
            onClick={filters.resetFilters}
            className="mt-4 rounded-xl border border-[#FFD100] bg-transparent px-6 py-3 font-semibold text-[#FFD100] transition hover:bg-[#FFD100]/10 focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {finalRooms.map((room) => (
            <RoomDashboardCard
              key={room.id}
              room={room}
              onViewDetails={() => setDetailsRoom(room)}
              hoveredRoomId={hoveredRoomId}
              onHoverStart={handleHoverStart(room)}
              onHoverEnd={handleHoverEnd}
            />
          ))}
        </div>
      )}

      {detailsRoom && (
        <RoomDetailsModal
          room={detailsRoom}
          isOpen
          onClose={() => setDetailsRoom(null)}
          showStartBooking
        />
      )}

      {/* Filter drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setFiltersOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-[#2A2A2A] bg-[#111111] p-6 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              role="dialog"
              aria-modal="true"
              aria-label="Room filters"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Filters</h2>
                  <p className="text-xs text-gray-500">
                    Refine by capacity, AV, furniture, and building.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-1 text-xs text-gray-300 hover:border-[#FFD100]/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                >
                  Close
                </button>
              </div>
              <RoomsFilters
                state={filters.state}
                setSearch={filters.setSearch}
                setBuilding={filters.setBuilding}
                toggleCapacityBucket={filters.toggleCapacityBucket}
                setStreamingOnly={filters.setStreamingOnly}
                setElectronicOnly={filters.setElectronicOnly}
                setDocCamOnly={filters.setDocCamOnly}
                toggleFurniture={filters.toggleFurniture}
                setSort={filters.setSort}
                buildingModalOpen={filters.buildingModalOpen}
                setBuildingModalOpen={filters.setBuildingModalOpen}
                buildingsList={filters.buildingsList}
                hasActiveFilters={filters.hasActiveFilters}
                onReset={filters.resetFilters}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
