
import { motion } from "framer-motion";

export function HeroTitle() {
  return (
    <motion.div 
      className="relative text-center"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
          Journey To Self-Mastery
        </span>
      </h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-3 text-sm md:text-base text-blue-200/70 font-light"
      >
        Professional habit tracking for exceptional results
      </motion.p>
    </motion.div>
  );
}
