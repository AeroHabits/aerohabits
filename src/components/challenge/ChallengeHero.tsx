
import { Trophy, Target, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

export function ChallengeHero() {
  const handleStartJourney = () => {
    // Scroll down to the challenges grid
    document.querySelector('.challenge-grid')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl shadow-2xl"
    >
      {/* Professional dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F2C] via-[#222736] to-[#1A1F2C] z-0">
        {/* Subtle pattern overlay */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%23ffffff\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')",
            backgroundSize: "cover"
          }}
        />
        
        {/* Subtle light beam effect */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{ 
            background: [
              "linear-gradient(45deg, transparent 65%, rgba(255,255,255,0.1) 75%, transparent 85%)",
              "linear-gradient(45deg, transparent 10%, rgba(255,255,255,0.1) 20%, transparent 30%)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
        />
      </div>
      
      <div className="relative z-10 p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Trophy icon with professional animation */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20, 
              delay: 0.3 
            }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-full blur-md opacity-70"></div>
              <div className="relative flex items-center justify-center p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </div>
          </motion.div>
          
          <div className="flex-1">
            <motion.div 
              className="space-y-1 mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* Professional title */}
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
                Excel & Achieve
              </h2>
              
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Target className="w-4 h-4 text-gray-300" />
                <span className="text-sm text-gray-300 font-medium">Growth for achievers</span>
              </motion.div>
            </motion.div>

            {/* More concise message */}
            <motion.p 
              className="text-base text-gray-200 leading-snug"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              Boost performance with daily challenges that build skills and habits.
            </motion.p>

            {/* Call to action */}
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button 
                onClick={handleStartJourney}
                variant="glass" 
                size="sm"
                className="group"
              >
                Start now
                <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Simplified challenge summary section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-6 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10"
        >
          <div className="text-white/90">
            <p className="text-xs leading-tight text-white/70">
              Complete challenges at each level to unlock advanced difficulties and earn rewards.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
