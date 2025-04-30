
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function HeroTitle() {
  return (
    <motion.div 
      className="relative text-center space-y-6"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="relative inline-block">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-200 bg-clip-text text-transparent drop-shadow-sm">
            Journey To Self-Mastery
          </span>
        </h2>
        <motion.div
          className="absolute -top-6 -right-8 text-blue-300"
          animate={{ 
            rotate: [0, 10, 0, -10, 0],
            scale: [1, 1.2, 1, 1.2, 1],
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        >
          <Sparkles className="h-8 w-8" />
        </motion.div>
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-lg md:text-xl text-blue-100 font-medium max-w-xl mx-auto leading-relaxed"
      >
        Professional habit tracking for exceptional results
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="flex justify-center"
      >
        <div className="h-1 w-24 bg-gradient-to-r from-blue-400/10 via-blue-400/50 to-blue-400/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full w-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
            animate={{ 
              x: ["-100%", "100%"], 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2, 
              ease: "easeInOut" 
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
