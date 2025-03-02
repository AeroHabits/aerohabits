
import { motion } from "framer-motion";

export function PageHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
        AEROHABITS
      </h1>
    </motion.div>
  );
}
