
import { motion } from "framer-motion";

export function AnimatedUnderline() {
  return (
    <motion.div 
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: "200px", opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="h-1 bg-gradient-to-r from-blue-400/0 via-blue-400 to-blue-400/0 mx-auto rounded-full"
    />
  );
}
