
import { ChallengeList } from "@/components/ChallengeList";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BadgeDisplay } from "@/components/badges/BadgeDisplay";
import { UserMenu } from "@/components/UserMenu";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChallengeHero } from "@/components/challenge/ChallengeHero";

const Challenges = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500 rounded-full filter blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 left-0 w-1/4 h-1/4 bg-purple-500 rounded-full filter blur-[100px] animate-float" />
        <div className="absolute top-1/2 right-1/4 w-1/5 h-1/5 bg-indigo-500 rounded-full filter blur-[100px] animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "container mx-auto px-4 pt-12 pb-6 md:py-8 space-y-8 md:space-y-12 safe-top relative z-10",
          isMobile && "pb-20"
        )}
      >
        <div className="flex justify-between items-center mb-8">
          <PageHeader />
          <UserMenu />
        </div>
        
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <ChallengeHero />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 hover:border-white/30 transition-all duration-300">
              <ChallengeList />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <BadgeDisplay />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Challenges;
