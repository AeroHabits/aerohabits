
import { motion } from "framer-motion";
import { useProfileLoader } from "./ProfileLoader";
import { HeroTitle } from "./HeroTitle";
import { AnimatedUnderline } from "./AnimatedUnderline";
import { UserAvatar } from "../user/UserAvatar";

export function AppHero() {
  const {
    data: profile
  } = useProfileLoader();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative pt-8 md:pt-16 pb-12 md:pb-24 z-10 px-4 md:px-8"
    >
      {/* Subtle professional background with gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-indigo-500/5 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-gray-900/20 to-transparent"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="flex flex-col items-center space-y-12">
          <HeroTitle />
          
          <AnimatedUnderline />
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
          >
            Track your custom habits, build consistency, and achieve your highest potential 
            through our sophisticated habit tracking system designed for professionals.
          </motion.p>
          
          {profile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-6"
            >
              <UserAvatar user={profile} profile={profile} />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
