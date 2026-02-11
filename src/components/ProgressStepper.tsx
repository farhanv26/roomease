interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressStepper({ currentStep, totalSteps }: ProgressStepperProps) {
  return (
    <div className="mb-8">
      <p className="text-sm font-medium text-gray-500">
        Step {currentStep} of {totalSteps}
      </p>
      <div className="mt-2 flex gap-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i + 1 <= currentStep ? "bg-emerald-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
