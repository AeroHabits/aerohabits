
import { motion } from "framer-motion";
import { TrendingUp, Award, Sparkles, Star } from "lucide-react";

export function JourneyHero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl p-8 text-center"
    >
      {/* Professional gradient background with Goals page blue (#0EA5E9) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9] via-blue-600 to-blue-800 z-0">
        {/* Subtle pattern overlay */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%23ffffff\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')",
            backgroundSize: "cover"
          }}
        />
        
        {/* Light beam effect */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          animate={{ 
            background: [
              "linear-gradient(45deg, transparent 65%, rgba(255,255,255,0.2) 75%, transparent 85%)",
              "linear-gradient(45deg, transparent 10%, rgba(255,255,255,0.2) 20%, transparent 30%)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Visual icon cluster */}
        <motion.div 
          className="flex justify-center gap-4 mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full"
          >
            <TrendingUp className="w-6 h-6 text-blue-100" />
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -5 }}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full"
          >
            <Award className="w-6 h-6 text-blue-100" />
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full"
          >
            <Star className="w-6 h-6 text-blue-100" />
          </motion.div>
        </motion.div>

        {/* Main title with animation */}
        <motion.h1 
          className="text-5xl md:text-6xl font-bold tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block relative">
            <span className="text-gradient bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text drop-shadow-lg">
              Your Habit Journey
            </span>
            <motion.span
              className="absolute -top-2 -right-2"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <Sparkles className="h-6 w-6 text-yellow-300" />
            </motion.span>
          </span>
        </motion.h1>
        
        {/* Description with better typography and animation */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-xl text-blue-100 max-w-2xl mx-auto font-medium leading-relaxed">
            Track your progress, celebrate achievements, and witness your growth transform into lasting habits.
          </p>
          <motion.div 
            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-300/30"
            initial={{ width: 0 }}
            animate={{ width: "150px" }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
        </motion.div>
        
        {/* Subtle motivational tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="pt-2"
        >
          <span className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-blue-100 text-sm font-medium border border-white/10">
            Every step counts on your path to excellence
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
