
import { motion } from "framer-motion";

export function HeroTitle() {
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
        <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-sm">
          Journey To Self-Mastery
        </span>
      </h2>
    </motion.div>
  );
}
