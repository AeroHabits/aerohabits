
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
  const baseClasses = "flex items-start gap-3 p-4 rounded-lg transition-all";
  const variantClasses = variant === "challenge" 
    ? "bg-gradient-to-r from-amber-900/20 to-transparent border border-amber-500/20" 
    : "bg-gradient-to-r from-white/5 to-transparent border border-white/10";

  return (
    <motion.div 
      whileHover={{ x: 5, transition: { duration: 0.2 } }}
      className={`${baseClasses} ${variantClasses}`}
    >
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-2 rounded-lg shadow-inner border border-white/5">
        {icon}
      </div>
      <div>
        <p className="text-white font-medium">{title}</p>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </motion.div>
  );
}
