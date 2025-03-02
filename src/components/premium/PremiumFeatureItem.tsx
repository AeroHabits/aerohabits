
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PremiumFeatureItemProps {
  title: string;
  description: string;
  icon: ReactNode;
  variant?: "default" | "challenge";
}

export function PremiumFeatureItem({
  title,
  description,
  icon,
  variant = "default"
}: PremiumFeatureItemProps) {
  return (
    <motion.div
      className={`flex gap-4 p-4 rounded-lg border ${
        variant === "challenge"
          ? "border-gray-200 bg-gray-50"
          : "border-gray-200 bg-white"
      }`}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className={`flex-shrink-0 p-2 rounded-full ${
        variant === "challenge" ? "bg-gray-100" : "bg-gray-100" 
      }`}>
        {icon}
      </div>
      
      <div className="flex-1 space-y-1">
        <h3 className={`font-medium ${
          variant === "challenge" ? "text-gray-800" : "text-gray-800" 
        }`}>
          {title}
        </h3>
        <p className={`text-sm ${
          variant === "challenge" ? "text-gray-600" : "text-gray-600" 
        }`}>
          {description}
        </p>
      </div>
    </motion.div>
  );
}
