import type { Room } from "@/types/booking";

export const MOCK_ROOMS: Room[] = [
  {
    id: 1,
    name: "SLC 214",
    building: "SLC",
    capacity: 40,
    hasAV: true,
    accessible: true,
  },
  {
    id: 2,
    name: "E7 3352",
    building: "E7",
    capacity: 25,
    hasAV: true,
    accessible: false,
  },
  {
    id: 3,
    name: "DC 1350",
    building: "DC",
    capacity: 60,
    hasAV: true,
    accessible: true,
  },
];
