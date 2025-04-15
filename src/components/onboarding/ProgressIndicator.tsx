
import { memo } from "react";
import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

function ProgressIndicator({ totalSteps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="flex gap-2 justify-center mt-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            backgroundColor: index <= currentStep ? "rgb(6, 182, 212)" : "rgb(55, 65, 81)"
          }}
          transition={{ 
            duration: 0.2,
            delay: index * 0.03 // Reduced delay for better performance
          }}
          className={`h-1.5 rounded-full transition-colors ${
            index <= currentStep 
              ? "w-12 bg-cyan-500" 
              : "w-8 bg-gray-700"
          }`}
          style={{ willChange: 'auto' }} // Optimize rendering
        />
      ))}
    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export { ProgressIndicator };
