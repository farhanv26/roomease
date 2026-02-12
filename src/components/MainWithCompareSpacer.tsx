"use client";

import { useCompare } from "@/lib/compareStore";

export function MainWithCompareSpacer({ children }: { children: React.ReactNode }) {
  const { compareIds } = useCompare();
  const showBar = compareIds.length >= 2;
  return (
    <div className={showBar ? "pb-24" : undefined}>
      {children}
    </div>
  );
}
