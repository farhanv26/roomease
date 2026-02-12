"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCompare } from "@/lib/compareStore";

export function CompareBar() {
  const { compareIds, clearCompare } = useCompare();
  const pathname = usePathname();
  const onComparePage = pathname === "/compare";
  const show = compareIds.length >= 2 && !onComparePage;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-40 overflow-hidden border-t border-[#2A2A2A] bg-[#1A1A1A] shadow-[0_-8px_24px_rgba(0,0,0,0.4)]"
        >
          <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <p className="text-sm font-medium text-white">
              <span className="text-[#FFD100]">{compareIds.length}</span> room
              {compareIds.length !== 1 ? "s" : ""} selected
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={clearCompare}
                className="rounded-xl border border-[#2A2A2A] bg-transparent px-4 py-2.5 text-sm font-medium text-gray-400 transition hover:border-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
              >
                Clear
              </button>
              <Link
                href="/compare"
                className="rounded-xl bg-[#FFD100] px-6 py-2.5 text-sm font-semibold text-black shadow-lg transition hover:bg-[#e6bc00] focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
              >
                Compare
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
