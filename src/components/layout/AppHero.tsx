import { motion } from "framer-motion";
import { useProfileLoader } from "./ProfileLoader";
import { HeroTitle } from "./HeroTitle";
import { AnimatedUnderline } from "./AnimatedUnderline";
export function AppHero() {
  const {
    data: profile
  } = useProfileLoader();
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay: 0.1
  }} className="text-center space-y-4">
      <HeroTitle />
      
      <AnimatedUnderline />
      
      <p className="text-lg text-white/80 max-w-2xl mx-auto">Track your custom habits, build streaks, and achieve your goals.</p>
    </motion.div>;
}