
import { Trophy, Rocket, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function ChallengeHero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl"
    >
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 md:p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"10\" cy=\"10\" r=\"1\" fill=\"rgba(255,255,255,0.05)\"/></svg>')] opacity-20" />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative mb-8 inline-flex"
        >
          <div className="p-4 rounded-full bg-gray-700 relative">
            <div className="absolute inset-0 rounded-full bg-gray-600 blur-md opacity-50" />
            <Trophy className="w-8 h-8 text-white relative z-10" />
          </div>
        </motion.div>

        <div className="relative space-y-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-gray-300" />
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Excellence Awaits
              </h2>
              <Sparkles className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-lg text-gray-300 font-medium">
              Strategic growth for high achievers
            </p>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-200 leading-relaxed"
          >
            Elevate your performance through expertly designed challenges that drive 
            measurable growth and unlock your full potential.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="pt-4"
          >
            <Button 
              size="lg"
              variant="glass"
              className="group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Begin your excellence journey today
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent group-hover:translate-x-full duration-500" />
            </Button>
          </motion.div>
        </div>

        <div className="absolute top-8 right-8 opacity-10">
          <Target className="w-24 h-24 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
