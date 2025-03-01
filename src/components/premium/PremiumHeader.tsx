
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

export function PremiumHeader() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible" 
      className="text-center space-y-8"
    >
      <motion.div
        variants={itemVariants}
        className="relative inline-block"
      >
        <motion.div
          className="absolute -inset-1 rounded-full blur-lg bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 opacity-70"
          animate={{ 
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{ 
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <motion.div
          className="relative bg-gradient-to-br from-[#080A1A] to-[#0F1222] rounded-full p-5 inline-block border border-amber-500/30 shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Crown className="w-16 h-16 text-amber-400" />
        </motion.div>
      </motion.div>
      
      <motion.h1 
        variants={itemVariants}
        className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500"
      >
        Unlock Premium Experience
      </motion.h1>
      
      <motion.p 
        variants={itemVariants}
        className="text-xl text-gray-200 max-w-lg mx-auto leading-relaxed"
      >
        Elevate your habit-building journey with our premium subscription for just <span className="font-bold text-amber-300">$9.99/month</span>
      </motion.p>
    </motion.div>
  );
}
