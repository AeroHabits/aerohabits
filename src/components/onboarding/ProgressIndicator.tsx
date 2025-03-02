
interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export function ProgressIndicator({ totalSteps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="flex gap-1 justify-center mt-4">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-1 rounded-full w-12 transition-colors duration-300 ${
            index <= currentStep
              ? "bg-purple-500"
              : "bg-gray-700"
          }`}
        />
      ))}
    </div>
  );
}
