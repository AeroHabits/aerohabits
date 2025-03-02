
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";

export const GoalListEmpty = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="text-center text-white font-medium bg-gradient-to-br from-gray-800/70 to-slate-700/70 p-6 rounded-lg border border-white/5 shadow-lg"
  >
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-full bg-gray-700/50 p-3 mb-2">
        <ClipboardList className="h-6 w-6 text-blue-300" />
      </div>
      <p className="text-lg">No goals yet. Add your first goal above!</p>
      <p className="text-blue-300/80 text-sm max-w-md">
        Setting clear goals helps you track your progress and stay motivated on your journey.
      </p>
    </div>
  </motion.div>
);
