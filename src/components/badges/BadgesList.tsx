
import { motion } from "framer-motion";
import { DisplayBadge } from "./DisplayBadge";
import { Medal } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  badge_type: string;
  isUnlocked: boolean;
  unlockMessage: string;
  points_required?: number;
}

interface BadgesListProps {
  badges: Badge[];
}

export function BadgesList({ badges }: BadgesListProps) {
  // Debug information
  console.log('Badges received:', badges?.length);

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {badges && badges.length > 0 ? (
        badges.map((badge, index) => (
          <DisplayBadge key={badge.id || index} badge={badge} index={index} />
        ))
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 bg-white/5 rounded-lg border border-white/10"
        >
          <Medal className="h-16 w-16 text-white/40 mb-4" />
          <p className="text-center text-white/60 font-medium">
            No badges available yet. Start completing challenges to earn them!
          </p>
          <p className="text-center text-white/40 text-sm mt-2 max-w-md">
            Complete daily habits and challenges to earn points and unlock achievement badges.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
