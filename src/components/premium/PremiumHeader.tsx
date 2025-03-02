
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
          className="absolute -inset-1 rounded-full blur-lg bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 opacity-70"
          animate={{ 
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{ 
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <motion.div
          className="relative bg-white rounded-full p-5 inline-block border border-gray-200 shadow-md"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Crown className="w-16 h-16 text-gray-700" />
        </motion.div>
      </motion.div>
      
      <motion.h1 
        variants={itemVariants}
        className="text-5xl font-bold text-gray-800"
      >
        Unlock Premium Experience
      </motion.h1>
      
      <motion.p 
        variants={itemVariants}
        className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed"
      >
        Elevate your habit-building journey with our premium subscription for just <span className="font-bold text-gray-800">$9.99/month</span>
      </motion.p>
    </motion.div>
  );
}
