
import { Trophy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export function LoadingSpinner() {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex flex-col items-center justify-center ${isMobile ? 'h-52' : 'h-64'}`}>
      <div className="relative">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative z-10"
        >
          <Trophy className="w-16 h-16 text-indigo-400" />
        </motion.div>
        
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl -z-10"
        />
        
        {/* Circling sparkles effect */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              rotate: i * 120,
              translateX: 30,
              translateY: 0,
              scale: 0.6 + (i * 0.2)
            }}
            animate={{ 
              rotate: [i * 120, i * 120 + 360] 
            }}
            transition={{ 
              duration: 3 + i,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Sparkles className="w-4 h-4 text-indigo-300" />
          </motion.div>
        ))}
      </div>
      
      <motion.p 
        className="mt-6 text-indigo-200 font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading challenges...
      </motion.p>
    </div>
  );
}
