
import { motion } from "framer-motion";
export function JourneyHero() {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="text-center space-y-6 py-4">
      <motion.h1 className="text-5xl md:text-6xl font-bold tracking-tight drop-shadow-xl mb-8" initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }}>
        <span className="text-gradient bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 glow-text">
          Your Habit Journey
        </span>
      </motion.h1>
      
      <h2 className="text-3xl md:text-4xl font-bold text-gradient bg-gradient-to-r from-[#0EA5E9] to-[#D946EF] drop-shadow-md">
        Your Habit Journey
      </h2>
      <p className="text-xl bg-gradient-to-r from-[#F97316] to-[#8B5CF6] text-transparent bg-clip-text max-w-2xl mx-auto">
        Track Your Progress and Celebrate Your Achievements Along the Way
      </p>
    </motion.div>;
}
