
import { Trophy, Target, Rocket, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export function ChallengeHero() {
  const navigate = useNavigate();

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
      
      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
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
              <div className="relative flex items-center justify-center p-5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </div>
          </motion.div>
          
          <div className="flex-1">
            <motion.div 
              className="space-y-2 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* Professional title */}
              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                Excellence Awaits
              </h2>
              
              <motion.div 
                className="flex items-center gap-2 pl-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Target className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300 font-medium tracking-wide">Strategic growth for high achievers</span>
              </motion.div>
            </motion.div>

            {/* Professional message */}
            <motion.p 
              className="text-xl text-gray-200 leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              Elevate your performance through expertly designed challenges that drive 
              measurable growth and unlock your full potential.
            </motion.p>

            {/* Professional call to action */}
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button 
                onClick={handleStartJourney}
                variant="glass" 
                size="pill"
                className="group"
              >
                Begin your excellence journey today
                <ArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Challenge summary section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
        >
          <div className="text-white/90 space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              How Challenges Work
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Challenges are structured progressions designed to build habits and skills. Each challenge has a difficulty level, daily tasks, and rewards points upon completion. Complete 80% of challenges at your current level to unlock harder difficulties and earn exclusive achievements.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
