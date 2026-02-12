"use client";

import { useCallback, useMemo, useState } from "react";
import { BuildingModal } from "@/components/BuildingModal";
import { getBuildingsFromRooms, ROOMS } from "@/data/rooms";
import type { Room } from "@/types/booking";
import { roomAvCapable } from "@/types/booking";

export type SortOption = "recommended" | "capacity-low" | "capacity-high" | "name-az";

export interface RoomsFilterState {
  search: string;
  building: string;
  minCapacity: number;
  avOnly: boolean;
  docCamOnly: boolean;
  sort: SortOption;
}

const defaultFilters: RoomsFilterState = {
  search: "",
  building: "",
  minCapacity: 0,
  avOnly: false,
  docCamOnly: false,
  sort: "recommended",
};

const buildingsList = getBuildingsFromRooms(ROOMS);

export function useRoomsFilters() {
  const [state, setState] = useState<RoomsFilterState>(defaultFilters);
  const [buildingModalOpen, setBuildingModalOpen] = useState(false);

  const setSearch = useCallback((search: string) => setState((s) => ({ ...s, search })), []);
  const setBuilding = useCallback((building: string) => setState((s) => ({ ...s, building })), []);
  const setMinCapacity = useCallback((minCapacity: number) => setState((s) => ({ ...s, minCapacity })), []);
  const setAvOnly = useCallback((avOnly: boolean) => setState((s) => ({ ...s, avOnly })), []);
  const setDocCamOnly = useCallback((docCamOnly: boolean) => setState((s) => ({ ...s, docCamOnly })), []);
  const setSort = useCallback((sort: SortOption) => setState((s) => ({ ...s, sort })), []);

  const hasActiveFilters = useMemo(() => {
    return (
      state.search !== defaultFilters.search ||
      state.building !== defaultFilters.building ||
      state.minCapacity !== defaultFilters.minCapacity ||
      state.avOnly !== defaultFilters.avOnly ||
      state.docCamOnly !== defaultFilters.docCamOnly ||
      state.sort !== defaultFilters.sort
    );
  }, [state]);

  const resetFilters = useCallback(() => setState(defaultFilters), []);

  return {
    state,
    setSearch,
    setBuilding,
    setMinCapacity,
    setAvOnly,
    setDocCamOnly,
    setSort,
    hasActiveFilters,
    resetFilters,
    buildingModalOpen,
    setBuildingModalOpen,
    buildingsList,
  };
}

function sortRooms(rooms: Room[], sort: SortOption): Room[] {
  const copy = [...rooms];
  switch (sort) {
    case "recommended":
      return copy.sort((a, b) => {
        const buildingCmp = (a.building || "").localeCompare(b.building || "");
        if (buildingCmp !== 0) return buildingCmp;
        const aNum = a.roomNumber ?? a.name;
        const bNum = b.roomNumber ?? b.name;
        return String(aNum).localeCompare(String(bNum), undefined, { numeric: true });
      });
    case "capacity-low":
      return copy.sort((a, b) => a.capacity - b.capacity);
    case "capacity-high":
      return copy.sort((a, b) => b.capacity - a.capacity);
    case "name-az":
      return copy.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    default:
      return copy;
  }
}

export function filterAndSortRooms(rooms: Room[], state: RoomsFilterState): Room[] {
  const q = state.search.trim().toLowerCase();
  let filtered = rooms.filter((room) => {
    if (state.building && room.building !== state.building) return false;
    if (room.capacity < state.minCapacity) return false;
    if (state.avOnly && !roomAvCapable(room)) return false;
    if (state.docCamOnly && !room.docCamera) return false;
    if (q) {
      const name = (room.name || "").toLowerCase();
      const building = (room.building || "").toLowerCase();
      if (!name.includes(q) && !building.includes(q)) return false;
    }
    return true;
  });
  return sortRooms(filtered, state.sort);
}

interface RoomsFiltersProps {
  state: RoomsFilterState;
  setSearch: (v: string) => void;
  setBuilding: (v: string) => void;
  setMinCapacity: (v: number) => void;
  setAvOnly: (v: boolean) => void;
  setDocCamOnly: (v: boolean) => void;
  setSort: (v: SortOption) => void;
  buildingModalOpen: boolean;
  setBuildingModalOpen: (v: boolean) => void;
  buildingsList: { value: string; label: string }[];
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function RoomsFilters({
  state,
  setSearch,
  setBuilding,
  setMinCapacity,
  setAvOnly,
  setDocCamOnly,
  setSort,
  buildingModalOpen,
  setBuildingModalOpen,
  buildingsList,
  hasActiveFilters,
  onReset,
}: RoomsFiltersProps) {
  const buildingLabel = useMemo(
    () => buildingsList.find((b) => b.value === state.building)?.label ?? "Any building",
    [state.building, buildingsList]
  );

  return (
    <>
      <div className="space-y-4 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setBuildingModalOpen(true)}
            className="rounded-xl border border-[#2A2A2A] bg-[#111111] px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-[#FFD100]/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
          >
            {buildingLabel}
          </button>
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Min capacity</span>
            <input
              type="number"
              min={0}
              max={500}
              value={state.minCapacity === 0 ? "" : state.minCapacity}
              onChange={(e) => setMinCapacity(Math.max(0, parseInt(e.target.value, 10) || 0))}
              placeholder="0"
              className="w-20 rounded-lg border border-[#2A2A2A] bg-[#111111] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#FFD100] focus:outline-none focus:ring-1 focus:ring-[#FFD100]"
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={state.avOnly}
              onChange={(e) => setAvOnly(e.target.checked)}
              className="h-4 w-4 rounded border-[#2A2A2A] bg-[#111111] text-[#FFD100] focus:ring-[#FFD100]"
            />
            <span className="text-sm text-gray-300">AV (SR)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={state.docCamOnly}
              onChange={(e) => setDocCamOnly(e.target.checked)}
              className="h-4 w-4 rounded border-[#2A2A2A] bg-[#111111] text-[#FFD100] focus:ring-[#FFD100]"
            />
            <span className="text-sm text-gray-300">Document Camera (D)</span>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort</span>
            <select
              value={state.sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-lg border border-[#2A2A2A] bg-[#111111] px-3 py-2 text-sm text-white focus:border-[#FFD100] focus:outline-none focus:ring-1 focus:ring-[#FFD100]"
            >
              <option value="recommended">Recommended (building A→Z, room #)</option>
              <option value="capacity-low">Capacity: Low → High</option>
              <option value="capacity-high">Capacity: High → Low</option>
              <option value="name-az">Name: A → Z</option>
            </select>
          </label>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="rounded-xl border border-[#FFD100]/50 bg-transparent px-4 py-2.5 text-sm font-medium text-[#FFD100] transition hover:bg-[#FFD100]/10 focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      <BuildingModal
        isOpen={buildingModalOpen}
        onClose={() => setBuildingModalOpen(false)}
        value={state.building}
        onSelect={(v) => {
          setBuilding(v);
          setBuildingModalOpen(false);
        }}
        buildings={buildingsList}
      />
    </>
  );
}
