
import { ChallengeList } from "@/components/ChallengeList";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { UserMenu } from "@/components/UserMenu";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppShowcase } from "@/components/showcase/AppShowcase";

const Challenges = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className={cn(
        "container mx-auto px-4 pt-4 md:py-8",
        isMobile && "pb-24"
      )}>
        <div className="flex justify-between items-center mb-8">
          <PageHeader />
          <UserMenu />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <ChallengeList />
            </div>
          </motion.div>
          
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="hidden lg:block"
            >
              <AppShowcase />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Challenges;
