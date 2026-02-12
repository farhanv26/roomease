This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

1. **Regenerate room data** from the Excel file (required for room list and building picker to match your data):
   ```bash
   yarn rooms:convert
   ```

2. **Run the development server:**
   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Use **`/book`** for the booking flow.

### Room data (Excel → JSON)

Room options are loaded from **`src/data/rooms.json`**. To regenerate this file from the Excel source:

1. **Where the data lives**
   - Input: **`src/data/Bookable Rooms.xlsx`**, sheet **"REG Rooms"**.
   - Output: **`src/data/rooms.json`** (used by the app at build and runtime).

2. **How to run the conversion**
   ```bash
   yarn rooms:convert
   ```
   The script logs total rooms found, rooms written, rooms skipped, and the output path.

3. **What the script does**
   - Reads the **REG Rooms** sheet, which has **two room tables side-by-side** (left and right columns).
   - For each row, extracts up to two rooms (from left and right blocks). Ignores "Furniture Legend" and junk rows.
   - **Building/room**: parses strings like `"RCH 305"` or `"AHS - 032A"` into `building` + `roomNumber`. Room id is `building-roomNumber`.
   - **Feature codes** (STC column): **SR** = AV capable, **D** = document camera; asterisks are ignored.
   - Output fields: `id`, `name`, `building`, `roomNumber`, `capacity`, `furniture`, `avCapable`, `docCamera`, `rawFeatureCode`, `accessible`.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
