
import { motion } from "framer-motion";

export function JourneyHero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6"
    >
      <motion.h1 
        className="text-4xl md:text-5xl font-bold tracking-tight drop-shadow-lg mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-gradient bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
          AEROHABITS
        </span>
      </motion.h1>
      
      <h2 className="text-3xl md:text-4xl font-bold text-white">
        Your Habit Journey
      </h2>
      <p className="text-xl text-white/80 max-w-2xl mx-auto">
        Track Your Progress and Celebrate Your Achievements Along the Way
      </p>
    </motion.div>
  );
}
