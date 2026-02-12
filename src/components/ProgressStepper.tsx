"use client";

import { motion } from "framer-motion";

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressStepper({ currentStep, totalSteps }: ProgressStepperProps) {
  return (
    <div className="mb-10">
      <p className="text-sm font-medium text-gray-400">
        Step {currentStep} of {totalSteps}
      </p>
      <div className="mt-3 flex gap-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#2A2A2A]"
          >
            <motion.div
              className="h-full rounded-full bg-[#FFD100]"
              initial={false}
              animate={{
                width: i + 1 <= currentStep ? "100%" : "0%",
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
