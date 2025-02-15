
import { ArrowRight, Star, Flame, Award, Crown } from "lucide-react";
import { motion } from "framer-motion";

export function ChallengeProgressionGuide() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 rounded-xl p-8 border border-gray-700 shadow-lg backdrop-blur-sm"
    >
      <h3 className="text-2xl font-bold mb-6 text-white">
        How Challenge Progression Works
      </h3>
      
      <div className="space-y-6">
        <motion.div 
          className="flex items-center justify-center gap-4 p-4 bg-gray-800/80 rounded-lg shadow-inner border border-gray-700"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-1 bg-gray-700 p-2 rounded-lg shadow-sm">
              <Star className="w-6 h-6 text-[#1EAEDB]" />
              <span className="text-xs font-semibold text-gray-200">Easy</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500" />
            <div className="flex items-center gap-1 bg-gray-700 p-2 rounded-lg shadow-sm">
              <Flame className="w-6 h-6 text-[#0FA0CE]" />
              <span className="text-xs font-semibold text-gray-200">Medium</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500" />
            <div className="flex items-center gap-1 bg-gray-700 p-2 rounded-lg shadow-sm">
              <Award className="w-6 h-6 text-[#0EA5E9]" />
              <span className="text-xs font-semibold text-gray-200">Hard</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500" />
            <div className="flex items-center gap-1 bg-gray-700 p-2 rounded-lg shadow-sm">
              <Crown className="w-6 h-6 text-white" />
              <span className="text-xs font-semibold text-gray-200">Master</span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-start gap-3 p-3 bg-gray-800/80 rounded-lg shadow-sm border border-gray-700"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-[#1EAEDB] rounded-full flex items-center justify-center text-white font-bold shadow-md">
              1
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Start Simple</h4>
              <p className="text-sm text-gray-300">Begin with easier challenges to build your foundation and confidence.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-start gap-3 p-3 bg-gray-800/80 rounded-lg shadow-sm border border-gray-700"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-[#0FA0CE] rounded-full flex items-center justify-center text-white font-bold shadow-md">
              2
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Level Up</h4>
              <p className="text-sm text-gray-300">Complete 80% of challenges in your current difficulty to unlock the next level.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-start gap-3 p-3 bg-gray-800/80 rounded-lg shadow-sm border border-gray-700"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-[#0EA5E9] rounded-full flex items-center justify-center text-white font-bold shadow-md">
              3
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Progressive Journey</h4>
              <p className="text-sm text-gray-300">Move from Easy to Medium, then Hard, and finally Master-level challenges.</p>
            </div>
          </motion.div>
        </div>

        <motion.p 
          className="text-sm font-medium text-center p-3 bg-gray-800/80 rounded-lg border border-gray-700"
          whileHover={{ scale: 1.01 }}
        >
          <span className="text-gray-200">Stay focused and keep progressing—each challenge prepares you for the next!</span>
        </motion.p>
      </div>
    </motion.div>
  );
}
