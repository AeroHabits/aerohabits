
import { motion } from "framer-motion";
import { Award, ChevronRight, Target } from "lucide-react";

export function JourneyHero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl"
    >
      <div className="py-8 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Target className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-indigo-300 font-medium text-sm">PERSONAL DASHBOARD</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg"
            >
              Your Habit Journey
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-white/80 leading-relaxed"
            >
              Track your progress, celebrate achievements, and build momentum toward your goals. Every consistent action brings you one step closer to lasting change.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-2 text-sm font-medium text-indigo-300"
            >
              <Award className="w-4 h-4" />
              <span>Your journey to excellence visualized</span>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-2xl rounded-full" />
            <div className="relative p-4 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl">
              <div className="flex flex-col items-center justify-center h-full py-4 px-6">
                <span className="text-6xl font-bold text-white mb-2">{Math.floor(Math.random() * 30) + 70}%</span>
                <span className="text-indigo-200 text-sm">Habit Completion</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-600/20 rounded-full blur-2xl" />
      <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-600/20 rounded-full blur-2xl" />
    </motion.div>
  );
}
