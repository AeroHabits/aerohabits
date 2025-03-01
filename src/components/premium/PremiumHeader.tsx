
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
      className="text-center space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="relative"
      >
        <motion.div
          className="absolute -inset-1 rounded-full blur-md bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 opacity-75"
          animate={{ 
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{ 
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <motion.div
          className="relative bg-black rounded-full p-4 inline-block"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Crown className="w-16 h-16 text-yellow-500" />
        </motion.div>
      </motion.div>
      
      <motion.h1 
        variants={itemVariants}
        className="text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500"
      >
        Unlock Your Full Potential
      </motion.h1>
      
      <motion.p 
        variants={itemVariants}
        className="text-xl text-gray-200 max-w-lg mx-auto"
      >
        Join our premium subscription and elevate your habit-building journey for just <span className="font-bold text-yellow-300">$9.99/month</span>
      </motion.p>
    </motion.div>
  );
}
