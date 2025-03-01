
import { motion } from "framer-motion";

export function PageHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <h1 
        className="text-4xl md:text-5xl font-extrabold tracking-tight text-white"
      >
        AEROHABITS
      </h1>
    </motion.div>
  );
}
