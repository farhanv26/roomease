This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Room data (Excel → JSON)

Room options are loaded from **`src/data/rooms.json`**. To regenerate this file from the Excel source:

1. **Where the data lives**
   - Input: **`src/data/Bookable Rooms.xlsx`** (first sheet only).
   - Output: **`src/data/rooms.json`** (used by the app at build and runtime).

2. **How to run the conversion**
   ```bash
   yarn rooms:convert
   ```
   The script logs how many rows were imported and how many were filtered out, then prints the output path.

3. **What the script does**
   - Reads the first sheet and maps columns to: id, name, building, capacity, hasAV, accessible (flexible header matching).
   - Capacity is parsed as a number; AV and accessibility are normalized from Yes/No, TRUE/FALSE, 1/0, Y/N.
   - Each room gets a stable id (from an id column if present, otherwise from name+building).
   - Rows without a room name or valid capacity are skipped and counted as filtered out.
   - Empty building is stored as `"Unknown"`.

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
