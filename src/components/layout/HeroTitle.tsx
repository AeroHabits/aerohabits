
import { motion } from "framer-motion";

export function HeroTitle() {
  return (
    <motion.h2
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className="text-3xl md:text-5xl font-bold tracking-tight"
    >
      <span className="relative inline-block">
        {/* Glow effect behind text */}
        <span className="absolute inset-0 blur-md bg-gradient-to-r from-blue-400/30 via-purple-500/30 to-blue-400/30 rounded-lg -z-10"></span>
        
        {/* Main text with gradient */}
        <span className="bg-gradient-to-r from-blue-300 via-indigo-400 to-blue-300 bg-clip-text text-transparent drop-shadow-sm animate-gradient-x">
          Journey To Self-Mastery
        </span>
      </span>
    </motion.h2>
  );
}
