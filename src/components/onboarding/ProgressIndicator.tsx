
import { memo } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

function ProgressIndicator({ totalSteps, currentStep }: ProgressIndicatorProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <div className="flex gap-2 justify-center">
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
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-slate-400 hover:text-indigo-500 transition-colors text-xs"
        >
          <Home size={14} />
          <span>Back to Home</span>
        </Button>
      </motion.div>
    </div>
  );
}

export { ProgressIndicator };
