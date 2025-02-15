
import { ArrowRight, Star, Flame, Award, Crown } from "lucide-react";
import { motion } from "framer-motion";

export function ChallengeProgressionGuide() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-xl p-8 border border-blue-500/30 shadow-lg backdrop-blur-sm"
    >
      <h3 className="text-2xl font-bold mb-6 text-blue-100">
        How Challenge Progression Works
      </h3>
      
      <div className="space-y-6">
        <motion.div 
          className="flex items-center justify-center gap-4 p-4 bg-slate-800/90 rounded-lg shadow-inner border border-blue-500/20"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-1 bg-blue-900/60 p-2 rounded-lg shadow-sm border border-blue-500/30">
              <Star className="w-6 h-6 text-blue-400" />
              <span className="text-xs font-semibold text-blue-100">Easy</span>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-400" />
            <div className="flex items-center gap-1 bg-blue-900/60 p-2 rounded-lg shadow-sm border border-blue-500/30">
              <Flame className="w-6 h-6 text-cyan-400" />
              <span className="text-xs font-semibold text-blue-100">Medium</span>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-400" />
            <div className="flex items-center gap-1 bg-blue-900/60 p-2 rounded-lg shadow-sm border border-blue-500/30">
              <Award className="w-6 h-6 text-sky-400" />
              <span className="text-xs font-semibold text-blue-100">Hard</span>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-400" />
            <div className="flex items-center gap-1 bg-blue-900/60 p-2 rounded-lg shadow-sm border border-blue-500/30">
              <Crown className="w-6 h-6 text-blue-300" />
              <span className="text-xs font-semibold text-blue-100">Master</span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-start gap-3 p-3 bg-slate-800/90 rounded-lg shadow-sm border border-blue-500/20"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              1
            </div>
            <div>
              <h4 className="font-semibold text-blue-100 mb-1">Start Simple</h4>
              <p className="text-sm text-blue-200">Begin with easier challenges to build your foundation and confidence.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-start gap-3 p-3 bg-slate-800/90 rounded-lg shadow-sm border border-blue-500/20"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              2
            </div>
            <div>
              <h4 className="font-semibold text-blue-100 mb-1">Level Up</h4>
              <p className="text-sm text-blue-200">Complete 80% of challenges in your current difficulty to unlock the next level.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-start gap-3 p-3 bg-slate-800/90 rounded-lg shadow-sm border border-blue-500/20"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              3
            </div>
            <div>
              <h4 className="font-semibold text-blue-100 mb-1">Progressive Journey</h4>
              <p className="text-sm text-blue-200">Move from Easy to Medium, then Hard, and finally Master-level challenges.</p>
            </div>
          </motion.div>
        </div>

        <motion.p 
          className="text-sm font-medium text-center p-3 bg-slate-800/90 rounded-lg border border-blue-500/20"
          whileHover={{ scale: 1.01 }}
        >
          <span className="text-blue-100">Stay focused and keep progressing—each challenge prepares you for the next!</span>
        </motion.p>
      </div>
    </motion.div>
  );
}
