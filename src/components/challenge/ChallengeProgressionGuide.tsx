
import { ArrowRight, Star, Flame, Award, Crown } from "lucide-react";
import { motion } from "framer-motion";

export function ChallengeProgressionGuide() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-lg p-6 border border-purple-200"
    >
      <h3 className="text-xl font-semibold mb-4 text-purple-900">How Challenge Progression Works</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex space-x-2">
            <Star className="w-5 h-5 text-green-500" />
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <Flame className="w-5 h-5 text-yellow-500" />
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <Award className="w-5 h-5 text-red-500" />
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <Crown className="w-5 h-5 text-purple-500" />
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span className="font-medium">Start Simple:</span> Begin with easier challenges to build your foundation.
          </p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span className="font-medium">Level Up:</span> Complete 80% of challenges in your current difficulty to unlock the next level.
          </p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span className="font-medium">Progressive Journey:</span> Move from Easy to Medium, then Hard, and finally Master-level challenges.
          </p>
        </div>

        <p className="text-sm text-purple-700 font-medium mt-4">
          Stay focused and keep progressing—each challenge prepares you for the next!
        </p>
      </div>
    </motion.div>
  );
}
