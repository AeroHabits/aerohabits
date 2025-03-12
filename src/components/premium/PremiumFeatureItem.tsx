
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PremiumFeatureItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  variant?: "default" | "challenge";
}

export function PremiumFeatureItem({ 
  icon, 
  title, 
  description, 
  variant = "default"
}: PremiumFeatureItemProps) {
  const baseClasses = "flex items-start gap-4 p-5 rounded-xl transition-all";
  const variantClasses = variant === "challenge" 
    ? "bg-gradient-to-r from-amber-900/20 to-transparent border border-amber-500/30 shadow-md" 
    : "bg-gradient-to-r from-white/5 to-transparent border border-white/20 shadow-md";

  return (
    <motion.div 
      whileHover={{ x: 5, scale: 1.01, transition: { duration: 0.2 } }}
      className={`${baseClasses} ${variantClasses}`}
    >
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-3 rounded-xl shadow-inner border border-white/10 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-white font-semibold text-lg">{title}</p>
        <p className="text-gray-300 text-sm mt-1">{description}</p>
      </div>
    </motion.div>
  );
}
