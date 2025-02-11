
import { Trophy, Rocket, Target } from "lucide-react";
import { motion } from "framer-motion";

export function ChallengeHero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-purple-600/30 p-8 rounded-xl backdrop-blur-sm border border-purple-400/30 shadow-2xl"
    >
      <motion.div 
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        style={{
          background: "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
          backgroundSize: "200% 200%",
          animation: "shimmer 2s linear infinite",
        }}
      />
      
      <div className="relative z-10">
        <motion.div 
          className="flex items-center gap-4 mb-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg"
          >
            <Trophy className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <motion.h2 
              className="text-3xl font-bold text-white mb-1"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Epic Challenges Await!
            </motion.h2>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Target className="w-4 h-4 text-purple-300" />
              <span className="text-purple-300 text-sm">Level up your life</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.p 
          className="text-lg text-gray-100 mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Push your limits, achieve greatness, and unlock incredible rewards along the way. 
          Each challenge is a step towards becoming your best self.
        </motion.p>

        <motion.div 
          className="flex items-center gap-2 text-sm text-purple-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Rocket className="w-4 h-4 animate-pulse" />
          <span>Start your journey to excellence today!</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
