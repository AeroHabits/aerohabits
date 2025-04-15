
import { Trophy, Rocket, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function ChallengeHero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl"
    >
      <div className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 p-8 md:p-12">
        {/* Enhanced floating elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-[80px] animate-float" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-[80px] animate-float" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-[100px] animate-pulse" />
        </div>

        {/* Decorative patterns */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,_rgba(120,119,198,0.3),transparent_60%)]" />
        <div className="absolute inset-0" style={{ 
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }} />

        <div className="relative space-y-6 max-w-2xl">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4 inline-flex gap-3"
          >
            <Trophy className="h-8 w-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]" />
            <Sparkles className="h-8 w-8 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.3)]" />
            <Rocket className="h-8 w-8 text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.3)]" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-6 h-6 text-blue-400" />
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                  Excellence Awaits
                </span>
              </h2>
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-lg text-blue-100 font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              Strategic growth for high achievers
            </p>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-200 leading-relaxed drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
          >
            Elevate your performance through expertly designed challenges that drive 
            measurable growth and unlock your full potential.
          </motion.p>
        </div>

        {/* Enhanced glow effects */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </div>
    </motion.div>
  );
}
