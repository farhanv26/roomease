"use client";

import { motion } from "framer-motion";

const baseClass =
  "inline-flex rounded-full border border-[#FFD100]/50 bg-[#FFD100]/10 px-2.5 py-1 text-xs font-medium text-[#FFD100]";

interface FeatureBadgeProps {
  children: React.ReactNode;
  /** Enable hover glow animation */
  animated?: boolean;
}

export function FeatureBadge({ children, animated = true }: FeatureBadgeProps) {
  if (animated) {
    return (
      <motion.span
        className={baseClass}
        whileHover={{
          boxShadow: "0 0 14px rgba(255, 209, 0, 0.25)",
          transition: { duration: 0.2 },
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    );
  }
  return <span className={baseClass}>{children}</span>;
}
