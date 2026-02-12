"use client";

import { motion } from "framer-motion";
import { furnitureLabelsFromCodes } from "@/lib/furniture";
import { AVAndFurnitureSections } from "@/components/AVAndFurnitureSections";
import { useCompare } from "@/lib/compareStore";
import type { AvNeedKey } from "@/types/booking";
import type { Room } from "@/types/booking";
import {
  roomHasDocumentCamera,
  roomIsElectronicClassroom,
  roomIsStreamingRecordingCapable,
} from "@/types/booking";
import { getBuildingTicketLabel } from "@/lib/buildings";

interface RoomCardProps {
  room: Room;
  groupSize: number;
  avNeedsEnabled: boolean;
  avNeeds: AvNeedKey[];
  furnitureNeedsEnabled: boolean;
  furnitureNeeds: string[];
  onSelect: () => void;
  onViewDetails: () => void;
  isBestMatch?: boolean;
}

export function RoomCard({
  room,
  groupSize,
  avNeedsEnabled,
  avNeeds,
  furnitureNeedsEnabled,
  furnitureNeeds,
  onSelect,
  onViewDetails,
  isBestMatch = false,
}: RoomCardProps) {
  const fitsGroup = room.capacity >= groupSize;
  const hasStreaming = roomIsStreamingRecordingCapable(room);
  const hasElectronic = roomIsElectronicClassroom(room);
  const hasDocCamera = roomHasDocumentCamera(room);

  const needsStreaming = avNeeds.includes("streamingRecording");
  const needsElectronic = avNeeds.includes("electronicClassroom");
  const needsDocCamera = avNeeds.includes("documentCamera");

  const meetsStreaming = !avNeedsEnabled || !needsStreaming || hasStreaming;
  const meetsElectronic = !avNeedsEnabled || !needsElectronic || hasElectronic;
  const meetsDocCam = !avNeedsEnabled || !needsDocCamera || hasDocCamera;

  const meetsFurniture =
    !furnitureNeedsEnabled ||
    (furnitureNeeds?.length ?? 0) === 0 ||
    (() => {
      const labels = furnitureLabelsFromCodes(room.furniture);
      return furnitureNeeds.every((need) => labels.includes(need));
    })();

  const { isInCompare, toggleCompare } = useCompare();
  const inCompare = isInCompare(room.id);

  return (
    <motion.div
      className={`relative rounded-xl border-2 bg-[#1A1A1A] p-6 shadow-xl ${
        isBestMatch ? "border-[#FFD100]/60" : "border-[#2A2A2A] hover:border-[#FFD100]/40"
      }`}
      initial={false}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 20px 40px -12px rgba(255, 209, 0, 0.12)",
        transition: { duration: 0.2 },
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Compare icon + tooltip – anchored to card top-right */}
      <div className="absolute right-4 top-4 z-20 relative inline-flex group">
        <button
          type="button"
          onClick={() => toggleCompare(room.id)}
          aria-label={inCompare ? "Remove from compare" : "Add to compare"}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-[#1A1A1A] ${
            inCompare
              ? "border-[#FFD100] bg-[#FFD100]/15 text-[#FFD100] shadow-[0_0_15px_rgba(255,209,0,0.35)]"
              : "border-[#2A2A2A] bg-black/60 text-gray-300 hover:border-[#FFD100] hover:text-[#FFD100]"
          }`}
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
      {isBestMatch && (
        <div className="mb-4 inline-flex rounded-full bg-[#FFD100]/20 px-3 py-1 text-sm font-semibold text-[#FFD100]">
          Best Match
        </div>
      )}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">{room.name}</h2>
        <p className="mt-1 text-gray-400">{getBuildingTicketLabel(room.building)}</p>
      </div>
      <p className="mb-3 text-gray-400">
        Capacity: <span className="text-white font-medium">{room.capacity}</span>
      </p>
      <div className="mb-4 space-y-3">
        <AVAndFurnitureSections room={room} animatedBadges />
      </div>
      <div className="mb-6 rounded-lg border border-[#2A2A2A] bg-[#111111] p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Why this room</p>
        <ul className="space-y-1 text-sm text-gray-300">
          <li>• Fits your group size</li>
          {avNeedsEnabled && needsStreaming && <li>• {meetsStreaming ? "Streaming & recording ready" : "Streaming & recording not available"}</li>}
          {avNeedsEnabled && needsElectronic && <li>• {meetsElectronic ? "Electronic classroom" : "Electronic classroom not available"}</li>}
          {avNeedsEnabled && needsDocCamera && <li>• {meetsDocCam ? "Document camera available" : "Document camera not available"}</li>}
          {furnitureNeedsEnabled && (furnitureNeeds?.length ?? 0) > 0 && (
            <li>• {meetsFurniture ? "Matches your furniture requirements" : "Does not match furniture requirements"}</li>
          )}
        </ul>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={onSelect}
          className="flex-1 rounded-xl bg-[#FFD100] px-4 py-3 font-semibold text-black shadow-lg transition hover:bg-[#e6bc00] focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
        >
          Select this room
        </button>
        <button
          type="button"
          onClick={onViewDetails}
          className="rounded-xl border border-[#2A2A2A] bg-transparent px-4 py-3 font-medium text-gray-400 transition hover:border-[#FFD100]/50 hover:text-[#FFD100] focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
        >
          View details
        </button>
      </div>
    </motion.div>
  );
}
