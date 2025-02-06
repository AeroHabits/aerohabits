
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Trophy className="w-12 h-12 text-blue-500" />
      </motion.div>
    </div>
  );
}
