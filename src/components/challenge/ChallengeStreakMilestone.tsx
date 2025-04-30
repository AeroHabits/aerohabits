
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Trophy, Star, Fire } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChallengeStreakMilestoneProps {
  completionCount: number;
}

export function ChallengeStreakMilestone({ completionCount }: ChallengeStreakMilestoneProps) {
  const [showMilestone, setShowMilestone] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (completionCount > 0 && completionCount % 5 === 0) {
      setShowMilestone(true);
      
      // Show a special toast for milestone achievements with improved styling
      toast.success(
        <div className="flex flex-col gap-2">
          <div className="font-bold text-base">Challenge Master: {completionCount} Completions!</div>
          <div className="text-sm opacity-90">You've reached an impressive milestone! Keep up the great work!</div>
        </div>,
        {
          duration: 6000,
          icon: <Trophy className="h-6 w-6 text-amber-400" />,
          description: "Your dedication is paying off!",
          className: "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-300/30"
        }
      );

      const timer = setTimeout(() => setShowMilestone(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [completionCount]);

  if (!showMilestone) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
        className={`fixed ${isMobile ? 'bottom-20' : 'bottom-10'} inset-x-0 z-50 flex justify-center items-center px-4`}
      >
        <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-6 py-5 rounded-xl shadow-xl flex items-center gap-4 max-w-md">
          <div className="relative">
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 15, 0],
                scale: [1, 1.2, 1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="z-20 relative"
            >
              <Trophy className="h-10 w-10 text-yellow-100" />
            </motion.div>
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 bg-yellow-300 rounded-full blur-lg -z-10"
            />
          </div>
          
          <div className="text-left">
            <h3 className="font-bold text-xl tracking-tight text-white">Milestone Achievement!</h3>
            <p className="text-yellow-50 font-medium">
              You've completed this challenge {completionCount} times!
            </p>
            <div className="flex mt-1.5">
              {[...Array(Math.min(5, completionCount % 5 === 0 ? 5 : completionCount % 5))].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                >
                  <Star className="h-4 w-4 text-yellow-200 mr-1" fill="rgba(254, 240, 138, 0.8)" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
