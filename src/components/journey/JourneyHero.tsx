
import { motion } from "framer-motion";
import { TrendingUp, Award, Target, Sparkles } from "lucide-react";

export function JourneyHero() {
  return (
    <div className="relative overflow-hidden">
      <div className="relative px-8 py-16 md:px-12 md:py-20">
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-blue-500/10">
          <motion.div
            className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0h20v20H0z\" fill=\"none\"/%3E%3Cpath d=\"M10 10l5-5M15 10l-5-5M10 15l5-5M5 10l5-5\" stroke=\"%23fff\" stroke-opacity=\".05\" stroke-width=\".5\"/%3E%3C/svg%3E')]"
            style={{ backgroundSize: "20px 20px" }}
            animate={{
              backgroundPosition: ["0px 0px", "20px 20px"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Enhanced icon cluster */}
          <motion.div 
            className="flex justify-center gap-8 mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {[TrendingUp, Award, Target].map((Icon, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05, rotate: 0 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.05] shadow-lg"
              >
                <Icon className="w-6 h-6 text-blue-300" />
              </motion.div>
            ))}
          </motion.div>

          {/* Refined title with elegant animation */}
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="relative inline-block text-5xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 bg-clip-text text-transparent">
                Your Habit Journey
              </span>
              <motion.span
                className="absolute -top-2 -right-2"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Sparkles className="h-6 w-6 text-blue-400" />
              </motion.span>
            </h1>
            
            <p className="text-xl text-blue-100/80 font-medium max-w-2xl mx-auto leading-relaxed">
              Transform your daily actions into lasting success
            </p>

            {/* Elegant divider */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-blue-300/20 to-transparent" />
              <div className="h-1 w-1 rounded-full bg-blue-400/20" />
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-blue-300/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
