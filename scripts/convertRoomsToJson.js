/**
 * Converts Bookable Rooms.xlsx sheet "REG Rooms" to rooms.json.
 * Sheet has TWO room tables side-by-side. Column layout:
 *   Left:  STC (feature), Bldg/Room, Regular Capacity, Furniture
 *   Right: (col 4 = feature), Bldg/Room, Regular Capacity, Furniture
 * Furniture Legend at end is ignored.
 * Run: yarn rooms:convert
 * Output: src/data/rooms.json
 */
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const INPUT_PATH = path.join(__dirname, "../src/data/Bookable Rooms.xlsx");
const OUTPUT_PATH = path.join(__dirname, "../src/data/rooms.json");
const SHEET_NAME = "REG Rooms";

// Column indices from inspected sheet
const LEFT = { feature: 0, bldgRoom: 1, capacity: 2, furniture: 3 };
const RIGHT = { feature: 4, bldgRoom: 5, capacity: 6, furniture: 7 };

/**
 * Parse "Bldg/Room" into building + roomNumber.
 * "RCH 305" => RCH, 305; "AHS - 032A" => AHS, 032A; "AL - 009" => AL, 009
 */
function parseBldgRoom(val) {
  let s = typeof val === "string" ? val.trim() : String(val ?? "").trim();
  if (!s) return { building: "", roomNumber: "" };
  s = s.replace(/\s*-\s*/g, " ");
  const match = s.match(/^([A-Za-z]+)\s+(.+)$/);
  if (match) return { building: match[1].trim(), roomNumber: match[2].trim() };
  if (/^[A-Za-z]+$/.test(s)) return { building: s, roomNumber: "" };
  if (/^\d/.test(s)) return { building: "", roomNumber: s };
  return { building: s, roomNumber: "" };
}

/** SR = AV capable, D = doc camera. * ignored. */
function parseFeatureCode(val) {
  const raw = typeof val === "string" ? val.trim() : String(val ?? "").trim();
  const upper = raw.toUpperCase().replace(/\*/g, "");
  return {
    rawFeatureCode: raw,
    avCapable: upper.includes("SR"),
    docCamera: upper.includes("D"),
  };
}

function parseNumber(val) {
  if (typeof val === "number" && !Number.isNaN(val)) return Math.max(0, Math.floor(val));
  if (typeof val === "string") {
    const n = parseInt(val.replace(/\D/g, ""), 10);
    return Number.isNaN(n) ? 0 : Math.max(0, n);
  }
  return 0;
}

function extractRoom(row, block) {
  const bldgRoom = String(row[block.bldgRoom] ?? "").trim();
  const capacity = parseNumber(row[block.capacity]);
  if (!bldgRoom || capacity <= 0) return null;
  const { building, roomNumber } = parseBldgRoom(bldgRoom);
  if (!building || !roomNumber) return null;
  const featureVal = String(row[block.feature] ?? "").trim();
  const { rawFeatureCode, avCapable, docCamera } = parseFeatureCode(featureVal);
  const furniture = String(row[block.furniture] ?? "").trim() || undefined;
  return {
    id: `${building}-${roomNumber}`,
    name: `${building} ${roomNumber}`,
    building,
    roomNumber,
    capacity,
    furniture,
    avCapable,
    docCamera,
    rawFeatureCode: rawFeatureCode || undefined,
    accessible: false,
  };
}

function isLegendRow(row) {
  const str = String(row[0] ?? "").toLowerCase() + String(row[LEFT.bldgRoom] ?? "").toLowerCase();
  if (str.includes("furniture legend") || str.includes("legend")) return true;
  const last = row[row.length - 1];
  if (String(last ?? "").toLowerCase().includes("=")) return true;
  return false;
}

function run() {
  if (!fs.existsSync(INPUT_PATH)) {
    console.error("Input file not found:", INPUT_PATH);
    process.exit(1);
  }

  const workbook = XLSX.readFile(INPUT_PATH);
  if (!workbook.SheetNames.includes(SHEET_NAME)) {
    console.error(`Sheet "${SHEET_NAME}" not found.`);
    process.exit(1);
  }

  const sheet = workbook.Sheets[SHEET_NAME];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  if (rows.length < 2) {
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify([], null, 2));
    console.log("Total rooms found: 0");
    console.log("Rooms written: 0");
    console.log("Rooms skipped: 0");
    return;
  }

  const seenIds = new Set();
  const rooms = [];
  let skipped = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (isLegendRow(row)) {
      skipped++;
      continue;
    }

    for (const block of [LEFT, RIGHT]) {
      const room = extractRoom(row, block);
      if (!room) {
        const bldgRoom = String(row[block.bldgRoom] ?? "").trim();
        const cap = parseNumber(row[block.capacity]);
        if (bldgRoom || cap > 0) skipped++;
        continue;
      }
      if (seenIds.has(room.id)) continue;
      seenIds.add(room.id);
      rooms.push(room);
    }
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(rooms, null, 2), "utf8");
  console.log("Total rooms found:", rooms.length + skipped);
  console.log("Rooms written:", rooms.length);
  console.log("Rooms skipped:", skipped);
  console.log("Output:", OUTPUT_PATH);
}

run();
