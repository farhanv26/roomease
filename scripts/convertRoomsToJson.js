/**
 * Converts src/data/Bookable Rooms.xlsx (first sheet) to src/data/rooms.json
 * for use by the RoomEase frontend. Run: yarn rooms:convert
 *
 * Output: src/data/rooms.json
 */
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const INPUT_PATH = path.join(__dirname, "../src/data/Bookable Rooms.xlsx");
const OUTPUT_PATH = path.join(__dirname, "../src/data/rooms.json");

function normalizeHeader(str) {
  if (typeof str !== "string") return "";
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

function findColumnIndex(headers, ...candidates) {
  for (const candidate of candidates) {
    const idx = headers.findIndex((h) => {
      const n = normalizeHeader(String(h));
      return n.includes(candidate) || candidate.includes(n);
    });
    if (idx >= 0) return idx;
  }
  return -1;
}

/** Normalize Yes/No, TRUE/FALSE, 1/0, Y/N to boolean */
function parseBool(val) {
  if (val === true || val === 1) return true;
  if (val === false || val === 0) return false;
  if (typeof val === "string") {
    const v = val.trim().toLowerCase();
    if (v === "yes" || v === "true" || v === "y" || v === "1") return true;
    if (v === "no" || v === "false" || v === "n" || v === "0") return false;
  }
  return false;
}

function parseNumber(val) {
  if (typeof val === "number" && !Number.isNaN(val)) return Math.max(0, Math.floor(val));
  if (typeof val === "string") {
    const n = parseInt(val.replace(/\D/g, ""), 10);
    return Number.isNaN(n) ? 0 : Math.max(0, n);
  }
  return 0;
}

/** Stable id: prefer existing id column, else string from name+building */
function stableId(rowIndex, idVal, name, building) {
  if (idVal !== undefined && idVal !== null && idVal !== "") {
    const n = parseNumber(idVal);
    if (n > 0) return n;
  }
  const str = `${name || ""}|${building || ""}`.trim() || `row-${rowIndex}`;
  return str;
}

function run() {
  if (!fs.existsSync(INPUT_PATH)) {
    console.error("Input file not found:", INPUT_PATH);
    process.exit(1);
  }

  const workbook = XLSX.readFile(INPUT_PATH);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  if (rows.length < 2) {
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify([], null, 2));
    console.log("No data rows; wrote empty rooms.json");
    return;
  }

  const headerRow = rows[0].map((h) => String(h ?? ""));
  const idIdx = findColumnIndex(headerRow, "id");
  const nameIdx = findColumnIndex(headerRow, "room", "name", "room name", "room name/code");
  const buildingIdx = findColumnIndex(headerRow, "building", "bldg");
  const capacityIdx = findColumnIndex(headerRow, "capacity", "cap", "seats");
  const avIdx = findColumnIndex(headerRow, "av", "a/v", "audio", "visual", "has av", "av available");
  const accessibleIdx = findColumnIndex(headerRow, "accessible", "access", "accessibility", "wheelchair");

  let imported = 0;
  let filtered = 0;
  const rooms = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const name = nameIdx >= 0 ? String(row[nameIdx] ?? "").trim() : "";
    let building = buildingIdx >= 0 ? String(row[buildingIdx] ?? "").trim() : "";
    const capacity = parseNumber(capacityIdx >= 0 ? row[capacityIdx] : 0);
    const hasAV = avIdx >= 0 ? parseBool(row[avIdx]) : false;
    const accessible = accessibleIdx >= 0 ? parseBool(row[accessibleIdx]) : false;

    if (!name || capacity <= 0) {
      filtered++;
      continue;
    }

    if (!building) building = "Unknown";
    const id = stableId(i, idIdx >= 0 ? row[idIdx] : undefined, name, building);

    rooms.push({
      id,
      name,
      building,
      capacity: Number(capacity),
      hasAV,
      accessible,
    });
    imported++;
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(rooms, null, 2), "utf8");
  console.log(`Imported ${imported} rooms, filtered out ${filtered} rows.`);
  console.log(`Output: ${OUTPUT_PATH}`);
}

run();
