import { motion } from "framer-motion";
export function PageHeader() {
  return <motion.div initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.3
  }} className="mb-8">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-300 bg-clip-text text-transparent drop-shadow-sm text-center">
        AEROHABITS
      </h1>
    </motion.div>;
}