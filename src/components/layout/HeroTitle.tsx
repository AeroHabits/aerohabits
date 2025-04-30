
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function HeroTitle() {
  return (
    <motion.div 
      className="relative text-center space-y-5"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="relative inline-block">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-gray-100 via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-sm">
            Journey To Self-Mastery
          </span>
        </h2>
        <motion.div
          className="absolute -top-6 -right-8 text-blue-300/70"
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
        className="text-lg md:text-xl text-blue-100/80 font-medium max-w-xl mx-auto leading-relaxed"
      >
        Professional habit tracking for exceptional results
      </motion.p>
    </motion.div>
  );
}
