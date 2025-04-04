
import { Trophy, Rocket, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function ChallengeHero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl shadow-2xl"
    >
      {/* Professional gradient background with Goals page blue (#0EA5E9) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9] via-blue-600 to-blue-800 z-0">
        {/* Advanced particle effect overlay */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          animate={{ 
            background: [
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 80%, rgba(255,255,255,0.4) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
        
        {/* Professional subtle pattern overlay */}
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
        
        {/* Professional subtle light beam effect */}
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
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-500 to-[#0EA5E9] rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative flex items-center justify-center p-5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg">
                <Trophy className="w-12 h-12 text-white" />
                <motion.div
                  className="absolute -inset-1 rounded-full"
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0px rgba(14, 165, 233, 0.3)",
                      "0 0 0 10px rgba(14, 165, 233, 0)"
                    ]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    repeatType: "loop"
                  }}
                />
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
              {/* Professional modern title with subtle sparkle animation */}
              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                  <span className="relative">
                    <motion.span
                      className="absolute -left-6 -top-1"
                      animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <Sparkles className="h-5 w-5 text-amber-300" />
                    </motion.span>
                    Excellence Awaits
                  </span>
                </h2>
                
                <motion.div
                  className="absolute -right-2 -top-1"
                  animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                >
                  <Sparkles className="h-5 w-5 text-amber-300" />
                </motion.div>
              </div>
              
              <motion.div 
                className="flex items-center gap-2 pl-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Target className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100 font-medium tracking-wide">Strategic growth for high achievers</span>
              </motion.div>
            </motion.div>

            {/* Professional compelling message with dynamic underline animation */}
            <motion.p 
              className="text-xl text-white/90 leading-relaxed font-medium relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              Elevate your performance through expertly designed challenges that drive 
              measurable growth and unlock your full potential.
              <motion.span 
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-200/0 via-blue-200/80 to-blue-200/0"
                animate={{ width: "100%" }}
                transition={{ delay: 1.5, duration: 1 }}
              />
            </motion.p>

            {/* Professional call to action with subtle animation */}
            <motion.div 
              className="mt-8 flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <Rocket className="w-5 h-5 text-blue-200" />
              </motion.div>
              <span className="bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full text-white/90 font-semibold text-sm border border-white/10 shadow-inner">
                Begin your excellence journey today
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
