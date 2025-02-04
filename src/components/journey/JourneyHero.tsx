import { motion } from "framer-motion";

export function JourneyHero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-black">
        Your Habit Journey
      </h1>
      <p className="text-xl text-black/80 max-w-2xl mx-auto">
        Track your progress and celebrate your achievements along the way
      </p>
    </motion.div>
  );
}