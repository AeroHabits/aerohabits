import { UserMenu } from "../UserMenu";
import { motion } from "framer-motion";

export function AppHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg border border-white/20"
    >
      <motion.h1 
        initial={{ scale: 1 }}
        animate={{ 
          scale: [1, 1.02, 1],
          textShadow: [
            "0 0 4px rgba(255,255,255,0.5)",
            "0 0 8px rgba(255,255,255,0.8)",
            "0 0 4px rgba(255,255,255,0.5)"
          ]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="text-3xl font-extrabold text-white tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-white to-blue-100 animate-gradient-x drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
      >
        AREOHABITS
      </motion.h1>
      <UserMenu />
    </motion.header>
  );
}