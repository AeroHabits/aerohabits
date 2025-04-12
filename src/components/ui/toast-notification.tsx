
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  onDismiss: () => void;
  duration?: number;
}

export function Toast({
  title,
  description,
  variant = "default",
  onDismiss,
  duration = 5000,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300); // Allow animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  // Determine background color based on variant
  const bgColor = {
    default: "bg-gray-800",
    destructive: "bg-red-600",
    success: "bg-green-600",
  }[variant];

  // Determine icon based on variant
  const Icon = {
    default: null,
    destructive: AlertTriangle,
    success: CheckCircle,
  }[variant];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            "rounded-lg shadow-lg p-4 flex items-start gap-3 text-white max-w-sm w-full",
            bgColor
          )}
        >
          {Icon && <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />}
          
          <div className="flex-1">
            {title && <h4 className="font-medium">{title}</h4>}
            {description && <p className="text-sm opacity-90 mt-1">{description}</p>}
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onDismiss, 300);
            }}
            className="text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ToastContainer({ 
  toasts,
  dismissToast 
}: { 
  toasts: any[],
  dismissToast: (index: number) => void 
}) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 items-end">
      {toasts.map((toast, index) => (
        <Toast
          key={index}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onDismiss={() => dismissToast(index)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
}
