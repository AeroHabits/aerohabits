import { HabitList } from "@/components/HabitList";
import { UserMenu } from "@/components/UserMenu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { WelcomeTour } from "@/components/WelcomeTour";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 animate-gradient-x">
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
        >
          <Tabs defaultValue="habits" className="w-full">
            <TabsList className="w-full max-w-md mx-auto bg-blue-400/30 backdrop-blur-sm border border-blue-300/20 hover:border-blue-300/30">
              <TabsTrigger 
                value="habits" 
                className="flex-1 data-[state=active]:bg-blue-500/20 data-[state=active]:text-white text-white font-medium"
              >
                Habits
              </TabsTrigger>
              <TabsTrigger 
                value="goals" 
                onClick={() => navigate("/goals")}
                className="flex-1 data-[state=active]:bg-blue-500/20 data-[state=active]:text-white text-white font-medium"
              >
                Goals
              </TabsTrigger>
              <TabsTrigger 
                value="journey" 
                onClick={() => navigate("/journey")}
                className="flex-1 data-[state=active]:bg-blue-500/20 data-[state=active]:text-white text-white font-medium"
              >
                Journey
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-400/20 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-blue-300/20"
        >
          <HabitList />
        </motion.section>
      </div>
    </div>
  );
};

export default Index;