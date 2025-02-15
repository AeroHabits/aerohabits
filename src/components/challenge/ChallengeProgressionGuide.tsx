
import { ArrowRight, Star, Flame, Award, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export function ChallengeProgressionGuide() {
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-xl p-4 sm:p-8 border border-blue-500/30 shadow-lg backdrop-blur-sm"
    >
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-100">
        How Challenge Progression Works
      </h3>
      
      <div className="space-y-4 sm:space-y-6">
        <motion.div 
          className="flex items-center justify-start sm:justify-center gap-2 sm:gap-4 p-3 sm:p-4 bg-slate-800/90 rounded-lg shadow-inner border border-blue-500/20 overflow-x-auto"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-max">
            <div className="flex items-center gap-1 bg-blue-900/60 p-1.5 sm:p-2 rounded-lg shadow-sm border border-blue-500/30">
              <Star className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-400 ${isMobile ? 'mr-1' : ''}`} />
              <span className="text-[11px] sm:text-xs font-semibold text-blue-100">Easy</span>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <div className="flex items-center gap-1 bg-blue-900/60 p-1.5 sm:p-2 rounded-lg shadow-sm border border-blue-500/30">
              <Flame className={`w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 ${isMobile ? 'mr-1' : ''}`} />
              <span className="text-[11px] sm:text-xs font-semibold text-blue-100">Medium</span>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <div className="flex items-center gap-1 bg-blue-900/60 p-1.5 sm:p-2 rounded-lg shadow-sm border border-blue-500/30">
              <Award className={`w-4 h-4 sm:w-5 sm:h-5 text-sky-400 ${isMobile ? 'mr-1' : ''}`} />
              <span className="text-[11px] sm:text-xs font-semibold text-blue-100">Hard</span>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <div className="flex items-center gap-1 bg-blue-900/60 p-1.5 sm:p-2 rounded-lg shadow-sm border border-blue-500/30">
              <Crown className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-300 ${isMobile ? 'mr-1' : ''}`} />
              <span className="text-[11px] sm:text-xs font-semibold text-blue-100">Master</span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-start gap-3 p-3 bg-slate-800/90 rounded-lg shadow-sm border border-blue-500/20"
          >
            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md text-sm sm:text-base">
              1
            </div>
            <div>
              <h4 className="font-semibold text-blue-100 mb-1 text-sm sm:text-base">Start Simple</h4>
              <p className="text-xs sm:text-sm text-blue-200">Begin with easier challenges to build your foundation and confidence.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-start gap-3 p-3 bg-slate-800/90 rounded-lg shadow-sm border border-blue-500/20"
          >
            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold shadow-md text-sm sm:text-base">
              2
            </div>
            <div>
              <h4 className="font-semibold text-blue-100 mb-1 text-sm sm:text-base">Level Up</h4>
              <p className="text-xs sm:text-sm text-blue-200">Complete 80% of challenges in your current difficulty to unlock the next level.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-start gap-3 p-3 bg-slate-800/90 rounded-lg shadow-sm border border-blue-500/20"
          >
            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center text-white font-bold shadow-md text-sm sm:text-base">
              3
            </div>
            <div>
              <h4 className="font-semibold text-blue-100 mb-1 text-sm sm:text-base">Progressive Journey</h4>
              <p className="text-xs sm:text-sm text-blue-200">Move from Easy to Medium, then Hard, and finally Master-level challenges.</p>
            </div>
          </motion.div>
        </div>

        <motion.p 
          className="text-xs sm:text-sm font-medium text-center p-3 bg-slate-800/90 rounded-lg border border-blue-500/20"
          whileHover={{ scale: 1.01 }}
        >
          <span className="text-blue-100">Stay focused and keep progressing—each challenge prepares you for the next!</span>
        </motion.p>
      </div>
    </motion.div>
  );
}
