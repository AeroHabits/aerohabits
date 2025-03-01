
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { PremiumFeatureItem } from "./PremiumFeatureItem";

interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

interface PremiumFeatureSectionProps {
  title: string;
  features: Feature[];
  titleGradient: string;
  variant?: "default" | "challenge";
}

export function PremiumFeatureSection({
  title,
  features,
  titleGradient,
  variant = "default"
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
        className={`text-xl font-bold text-white text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r ${titleGradient}`}
      >
        {title}
      </motion.h3>
      
      {features.map((feature, index) => (
        <motion.div key={index} variants={itemVariants}>
          <PremiumFeatureItem
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            variant={variant}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
