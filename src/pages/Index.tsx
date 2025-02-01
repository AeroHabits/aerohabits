import { HabitList } from "@/components/HabitList";
import { ChallengeList } from "@/components/ChallengeList";
import { UserMenu } from "@/components/UserMenu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { WelcomeTour } from "@/components/WelcomeTour";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/90 via-blue-600/80 to-indigo-600/90">
      <WelcomeTour />
      <div className={cn(
        "container py-8 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        isMobile && "pb-24"
      )}>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center space-y-4"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: 0.2
            }}
            className="text-3xl md:text-4xl font-bold text-white/95 tracking-wide"
          >
            Journey To Self-Mastery
          </motion.h2>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-white/0 via-white/80 to-white/0 animate-pulse" />
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Track your habits, build streaks, and achieve your goals.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="habits" className="w-full">
            <TabsList className="w-full max-w-md mx-auto bg-white/20 backdrop-blur-sm border border-white/30">
              <TabsTrigger 
                value="habits" 
                className="flex-1 data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/90 font-medium"
              >
                Habits
              </TabsTrigger>
              <TabsTrigger 
                value="challenges" 
                className="flex-1 data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/90 font-medium"
              >
                Challenges
              </TabsTrigger>
              <TabsTrigger 
                value="goals" 
                onClick={() => navigate("/goals")}
                className="flex-1 data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/90 font-medium"
              >
                Goals
              </TabsTrigger>
              <TabsTrigger 
                value="journey" 
                onClick={() => navigate("/journey")}
                className="flex-1 data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/90 font-medium"
              >
                Journey
              </TabsTrigger>
            </TabsList>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <TabsContent value="habits">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/30">
                  <HabitList />
                </div>
              </TabsContent>
              
              <TabsContent value="challenges">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/30">
                  <ChallengeList />
                </div>
              </TabsContent>
            </motion.div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;