
import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export function ProgressIndicator({ totalSteps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="flex gap-2 justify-center mt-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            backgroundColor: index <= currentStep ? "rgb(59, 130, 246)" : "rgb(55, 65, 81)"
          }}
          transition={{ 
            duration: 0.3,
            delay: index * 0.05
          }}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            index <= currentStep 
              ? "w-16 bg-blue-500 shadow-sm shadow-blue-500/30" 
              : "w-10 bg-gray-700"
          }`}
        />
      ))}
    </div>
  );
}
