
import { Trophy, Rocket, Target, Star, Award } from "lucide-react";
import { motion } from "framer-motion";

export function ChallengeHero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl shadow-2xl"
    >
      {/* Background gradient with animated effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 animate-gradient-x">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzBoLTZsMyAzeiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div>
      
      {/* Animated floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20 backdrop-blur-sm"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Main content area with glass effect */}
      <div className="relative p-8 md:p-10 backdrop-blur-sm z-10 border border-white/20">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-5 mb-6">
            {/* Trophy icon with glow effect */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex-shrink-0"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-full shadow-lg border-2 border-white/30">
                  <Trophy className="w-8 h-8 text-white drop-shadow-md" />
                </div>
              </div>
            </motion.div>
            
            {/* Text content */}
            <div className="flex-1">
              <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-4xl font-extrabold mb-2 tracking-tight text-white drop-shadow-lg"
              >
                Epic Challenges Await!
              </motion.h2>
              
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center gap-2 mb-1"
              >
                <Target className="w-5 h-5 text-yellow-300" />
                <span className="text-yellow-200 font-semibold text-lg">Level up your life</span>
              </motion.div>
            </div>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-xl text-white leading-relaxed font-medium mb-8 drop-shadow-md max-w-2xl"
          >
            Push your limits, achieve greatness, and unlock incredible rewards along the way. 
            Each challenge is a step towards becoming your best self.
          </motion.p>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <Rocket className="w-5 h-5 text-indigo-200 animate-pulse" />
            <span className="text-indigo-100 font-semibold">Start your journey to excellence today!</span>
          </motion.div>
          
          {/* Achievement indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-wrap mt-8 gap-2"
          >
            {['Focus', 'Discipline', 'Growth', 'Success'].map((tag, i) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + (i * 0.1) }}
                className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white border border-white/20"
              >
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  <span>{tag}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
