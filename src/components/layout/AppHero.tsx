
import { motion } from "framer-motion";
import { useProfileLoader } from "./ProfileLoader";
import { HeroTitle } from "./HeroTitle";
import { AnimatedUnderline } from "./AnimatedUnderline";
import { Rocket, Target, Sparkles, BarChart3 } from "lucide-react";

export function AppHero() {
  const { data: profile } = useProfileLoader();
  
  // Define staggered animations for the floating icons
  const floatingIcons = [
    { icon: <Rocket size={20} />, color: "text-blue-400", delay: 0.2 },
    { icon: <Target size={20} />, color: "text-purple-400", delay: 0.3 },
    { icon: <BarChart3 size={20} />, color: "text-indigo-400", delay: 0.4 },
    { icon: <Sparkles size={18} />, color: "text-cyan-400", delay: 0.5 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative text-center py-10 px-4 z-10"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        {/* Animated floating icons */}
        <div className="absolute inset-0">
          {floatingIcons.map((item, index) => (
            <motion.div
              key={index}
              className={`absolute ${item.color} opacity-40`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 0.6, 
                y: 0,
                x: index % 2 === 0 ? [0, 10, 0] : [0, -10, 0],
                rotate: index % 2 === 0 ? [0, 5, 0] : [0, -5, 0]
              }}
              transition={{
                delay: item.delay,
                y: { duration: 0.6 },
                x: { repeat: Infinity, duration: 3 + index, repeatType: "reverse" },
                rotate: { repeat: Infinity, duration: 3 + index, repeatType: "reverse" }
              }}
              style={{
                top: `${20 + (index * 15)}%`,
                left: `${10 + (index * 20)}%`
              }}
            >
              {item.icon}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative space-y-6">
        <HeroTitle />
        
        <AnimatedUnderline />
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-lg md:text-xl text-blue-100/90 font-medium max-w-2xl mx-auto leading-relaxed"
        >
          Track your custom habits, build streaks, and achieve your goals.
        </motion.p>

        {/* Hero buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex justify-center gap-4 pt-6"
        >
          <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
            Get Started
          </button>
          <button className="px-6 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg hover:bg-white/15 transition-all duration-300">
            Learn More
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
