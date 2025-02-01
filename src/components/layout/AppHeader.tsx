import { UserMenu } from "@/components/UserMenu";
import { motion } from "framer-motion";

export function AppHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center mb-8"
    >
      <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">
        AREOHABITS
      </h1>
      <UserMenu />
    </motion.div>
  );
}