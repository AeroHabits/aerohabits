
import { UserMenu } from "../UserMenu";
import { motion } from "framer-motion";

export function AppHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 backdrop-blur-md rounded-lg px-4 md:px-6 py-3 shadow-lg border border-white/30"
    >
      <motion.h1 
        initial={{ scale: 1 }}
        animate={{ 
          scale: [1, 1.02, 1],
          textShadow: [
            "0 0 4px rgba(255,255,255,0.3)",
            "0 0 8px rgba(255,255,255,0.5)",
            "0 0 4px rgba(255,255,255,0.3)"
          ]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="text-xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 tracking-wider"
      >
        AREOHABITS
      </motion.h1>
      <UserMenu />
    </motion.header>
  );
}
