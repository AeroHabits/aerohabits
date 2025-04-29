
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
            backgroundColor: index <= currentStep ? "rgb(79, 70, 229)" : "rgb(71, 85, 105)"
          }}
          transition={{ 
            duration: 0.2,
            delay: index * 0.03
          }}
          className={`h-1.5 rounded-full transition-colors ${
            index <= currentStep 
              ? "w-12 bg-indigo-600" 
              : "w-8 bg-slate-600"
          }`}
          style={{ willChange: 'auto' }}
        />
      ))}
    </div>
  );
}

export { ProgressIndicator };
