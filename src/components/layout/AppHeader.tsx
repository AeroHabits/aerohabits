
import { UserMenu } from "../UserMenu";
import { motion } from "framer-motion";

export function AppHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 backdrop-blur-md rounded-lg px-4 md:px-6 py-3 md:py-4 shadow-lg border border-white/30 w-full mb-6"
    >
      <h1 
        className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 tracking-wider truncate"
      >
        AEROHABITS
      </h1>
      <UserMenu />
    </motion.header>
  );
}
