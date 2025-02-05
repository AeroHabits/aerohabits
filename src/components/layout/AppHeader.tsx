import { UserMenu } from "../UserMenu";
import { motion } from "framer-motion";

export function AppHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between bg-white shadow-sm rounded-lg px-6 py-4"
    >
      <h1 className="text-2xl font-bold text-gray-900">
        AREOHABITS
      </h1>
      <UserMenu />
    </motion.header>
  );
}