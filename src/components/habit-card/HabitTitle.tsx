
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { icons } from "lucide-react";

interface HabitTitleProps {
  title: string;
  completed: boolean;
  category?: {
    icon: string;
    color: string;
  };
}

export function HabitTitle({ title, completed, category }: HabitTitleProps) {
  const LucideIcon = category?.icon ? (icons as any)[category.icon] : null;

  // Animation variants
  const titleVariants = {
    initial: { scale: 1 },
    animate: completed ? 
      {
        scale: [1, 1.05, 1],
        transition: { duration: 0.5, repeat: 0 }
      } : {}
  };

  // Animation for the completed indicator
  const completedVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: completed ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 },
    transition: { type: "spring", stiffness: 260, damping: 20 }
  };

  return (
    <div className="flex items-center gap-2">
      {category && LucideIcon && (
        <div 
          className="p-1.5 rounded-lg"
          style={{ backgroundColor: `${category.color}30` }}
        >
          <LucideIcon 
            className="h-4 w-4"
            style={{ color: category.color }}
          />
        </div>
      )}
      <motion.h3 
        variants={titleVariants}
        className={cn(
          "font-semibold text-lg",
          completed ? "text-purple-200 line-through opacity-70" : "text-white/90"
        )}
      >
        {title}
      </motion.h3>
      {completed && (
        <motion.div
          variants={completedVariants}
          initial="initial"
          animate="animate"
        >
          <CheckCircle className="h-5 w-5 text-purple-400" />
        </motion.div>
      )}
    </div>
  );
}
