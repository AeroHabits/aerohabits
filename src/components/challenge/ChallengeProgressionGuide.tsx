
import { ArrowRight, Star, Flame, Award, Crown } from "lucide-react";
import { motion } from "framer-motion";

export function ChallengeProgressionGuide() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-600/20 via-purple-600/25 to-pink-600/20 rounded-xl p-8 border border-purple-300/50 shadow-lg backdrop-blur-sm"
    >
      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
        How Challenge Progression Works
      </h3>
      
      <div className="space-y-6">
        <motion.div 
          className="flex items-center justify-center gap-4 p-4 bg-white/60 rounded-lg shadow-inner"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-1 bg-green-200 p-2 rounded-lg shadow-sm">
              <Star className="w-6 h-6 text-green-600" />
              <span className="text-xs font-semibold text-green-800">Easy</span>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-500" />
            <div className="flex items-center gap-1 bg-yellow-200 p-2 rounded-lg shadow-sm">
              <Flame className="w-6 h-6 text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-800">Medium</span>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-500" />
            <div className="flex items-center gap-1 bg-red-200 p-2 rounded-lg shadow-sm">
              <Award className="w-6 h-6 text-red-600" />
              <span className="text-xs font-semibold text-red-800">Hard</span>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-500" />
            <div className="flex items-center gap-1 bg-purple-200 p-2 rounded-lg shadow-sm">
              <Crown className="w-6 h-6 text-purple-600" />
              <span className="text-xs font-semibold text-purple-800">Master</span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-start gap-3 p-3 bg-white/60 rounded-lg shadow-sm"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              1
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Start Simple</h4>
              <p className="text-sm text-gray-700">Begin with easier challenges to build your foundation and confidence.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-start gap-3 p-3 bg-white/60 rounded-lg shadow-sm"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              2
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Level Up</h4>
              <p className="text-sm text-gray-700">Complete 80% of challenges in your current difficulty to unlock the next level.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-start gap-3 p-3 bg-white/60 rounded-lg shadow-sm"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              3
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Progressive Journey</h4>
              <p className="text-sm text-gray-700">Move from Easy to Medium, then Hard, and finally Master-level challenges.</p>
            </div>
          </motion.div>
        </div>

        <motion.p 
          className="text-sm font-medium text-center p-3 bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-purple-600/20 rounded-lg"
          whileHover={{ scale: 1.01 }}
        >
          <span className="text-purple-900">Stay focused and keep progressing—each challenge prepares you for the next!</span>
        </motion.p>
      </div>
    </motion.div>
  );
}
