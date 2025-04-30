
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Trophy } from "lucide-react";
import { toast } from "sonner";

interface ChallengeStreakMilestoneProps {
  completionCount: number;
}

export function ChallengeStreakMilestone({ completionCount }: ChallengeStreakMilestoneProps) {
  const [showMilestone, setShowMilestone] = useState(false);
  
  useEffect(() => {
    if (completionCount > 0 && completionCount % 5 === 0) {
      setShowMilestone(true);
      
      // Show a special toast for milestone achievements
      toast.success(
        `Challenge Master: ${completionCount} Completions!`,
        {
          duration: 5000,
          icon: <Trophy className="h-5 w-5 text-yellow-500" />,
          description: "You've reached an impressive milestone! Keep up the great work!"
        }
      );

      const timer = setTimeout(() => setShowMilestone(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [completionCount]);

  if (!showMilestone) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      className="fixed bottom-10 inset-x-0 z-50 flex justify-center items-center"
    >
      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.2, 1, 1.2, 1]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          <Award className="h-8 w-8 text-yellow-200" />
        </motion.div>
        <div className="text-center">
          <h3 className="font-bold text-lg">Milestone Achievement!</h3>
          <p>You've completed this challenge {completionCount} times!</p>
        </div>
      </div>
    </motion.div>
  );
}
