
import { motion } from "framer-motion";
import { useProfileLoader } from "./ProfileLoader";
import { HeroTitle } from "./HeroTitle";
import { AnimatedUnderline } from "./AnimatedUnderline";

export function AppHero() {
  const {
    data: profile
  } = useProfileLoader();
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.8
  }} className="relative text-center md:py-20 z-10 px-0 py-0">
      {/* Refined background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px]"></div>
        <motion.div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-400/3 rounded-full" animate={{
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.3, 0.2]
      }} transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }} />
      </div>

      <div className="relative max-w-3xl mx-auto space-y-10">
        <HeroTitle />
        
        <AnimatedUnderline />
        
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4,
        duration: 0.6
      }} className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed font-light tracking-wide pb-6">
          Track your custom habits, build consistency, and achieve your highest potential.
        </motion.p>
      </div>
    </motion.div>;
}
