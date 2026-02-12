"use client";

import { useMemo, useState } from "react";
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

  const filteredRooms = useMemo(
    () => filterAndSortRooms(ROOMS, filters.state),
    [filters.state]
  );

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Bookable Rooms
          </h1>
          <p className="mt-1 text-gray-400">
            Browse capacity and features across campus.
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-3">
          <input
            type="search"
            value={filters.state.search}
            onChange={(e) => filters.setSearch(e.target.value)}
            placeholder="Search by room or building..."
            className="w-full min-w-[200px] max-w-sm rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-2.5 text-white placeholder-gray-500 focus:border-[#FFD100] focus:outline-none focus:ring-1 focus:ring-[#FFD100] sm:w-64"
            aria-label="Search rooms"
          />
          {filters.hasActiveFilters && (
            <button
              type="button"
              onClick={filters.resetFilters}
              className="rounded-xl border border-[#FFD100]/50 bg-transparent px-4 py-2.5 text-sm font-medium text-[#FFD100] transition hover:bg-[#FFD100]/10 focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <RoomsFilters
          state={filters.state}
          setSearch={filters.setSearch}
          setBuilding={filters.setBuilding}
          setMinCapacity={filters.setMinCapacity}
          setAvOnly={filters.setAvOnly}
          setDocCamOnly={filters.setDocCamOnly}
          setSort={filters.setSort}
          buildingModalOpen={filters.buildingModalOpen}
          setBuildingModalOpen={filters.setBuildingModalOpen}
          buildingsList={filters.buildingsList}
          hasActiveFilters={filters.hasActiveFilters}
          onReset={filters.resetFilters}
        />
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-gray-500">
        Showing {filteredRooms.length} of {ROOMS.length} rooms
      </p>

      {/* Results grid or empty state */}
      {filteredRooms.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-[#FFD100]/40 bg-[#1A1A1A]/50 py-16 text-center">
          <p className="text-lg font-medium text-gray-400">
            No rooms match your filters.
          </p>
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
          {filteredRooms.map((room) => (
            <RoomDashboardCard
              key={room.id}
              room={room}
              onViewDetails={() => setDetailsRoom(room)}
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
    </div>
  );
}
