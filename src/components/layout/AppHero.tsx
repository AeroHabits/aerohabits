
import { motion } from "framer-motion";
import { useProfileLoader } from "./ProfileLoader";
import { HeroTitle } from "./HeroTitle";
import { AnimatedUnderline } from "./AnimatedUnderline";

export function AppHero() {
  const { data: profile } = useProfileLoader();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative text-center py-10 px-4 z-10"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-20 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative space-y-6">
        <HeroTitle />
        
        <AnimatedUnderline />
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
        >
          Track your custom habits, build streaks, and achieve your goals.
        </motion.p>

        {/* Hero buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex justify-center gap-4 pt-6"
        >
          <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all duration-200">
            Get Started
          </button>
          <button className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-100 font-medium rounded-md transition-all duration-200">
            Learn More
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
