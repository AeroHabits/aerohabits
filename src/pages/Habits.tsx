
import { HabitList } from "@/components/HabitList";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/layout/AppHeader";

const Habits = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 pt-12 pb-6 md:py-8 space-y-8 md:space-y-12 safe-top" // Added pt-12 and safe-top
      >
        <AppHeader />
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/20">
          <HabitList />
        </div>
      </motion.div>
    </div>
  );
};

export default Habits;
