
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PremiumFeatureSectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  titleGradient?: string;
}

export function PremiumFeatureSection({
  title,
  children,
  icon,
  titleGradient = "from-white to-gray-300"
}: PremiumFeatureSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.h3
        variants={itemVariants}
        className={`text-xl font-bold flex items-center justify-center gap-2 mb-4 bg-clip-text text-transparent bg-gradient-to-r ${titleGradient}`}
      >
        {icon && <span>{icon}</span>}
        {title}
      </motion.h3>
      
      <div className="space-y-3">
        {children}
      </div>
    </motion.div>
  );
}
