
import { motion } from "framer-motion";
import { useProfileLoader } from "./ProfileLoader";
import { HeroTitle } from "./HeroTitle";
import { AnimatedUnderline } from "./AnimatedUnderline";
import { ArrowRight } from "lucide-react";

export function AppHero() {
  const { data: profile } = useProfileLoader();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative text-center py-16 md:py-20 px-6 z-10"
    >
      {/* Refined background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px]"></div>
        <motion.div 
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-400/3 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto space-y-8">
        <HeroTitle />
        
        <AnimatedUnderline />
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
        >
          Track your custom habits, build consistency, and achieve your highest potential.
        </motion.p>

        {/* Enhanced buttons with more professional styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4 pt-6"
        >
          <button className="group flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button className="px-8 py-3 bg-transparent hover:bg-gray-800/50 border border-gray-600 hover:border-gray-500 text-gray-100 font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Learn More
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
