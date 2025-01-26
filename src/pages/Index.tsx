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
    <div className="min-h-screen bg-gradient-to-br from-[#FEF7CD] via-[#E5DEFF] to-[#D3E4FD]">
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
          <h1 className="text-4xl font-bold text-[#6E59A5] tracking-tight">
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
            <TabsList className="w-full max-w-md mx-auto bg-white/70 backdrop-blur-sm border border-[#D3E4FD]/50 hover:border-[#9b87f5]/60">
              <TabsTrigger 
                value="habits" 
                className="flex-1 data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white"
              >
                Habits
              </TabsTrigger>
              <TabsTrigger 
                value="goals" 
                onClick={() => navigate("/goals")}
                className="flex-1 data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white"
              >
                Goals
              </TabsTrigger>
              <TabsTrigger 
                value="journey" 
                onClick={() => navigate("/journey")}
                className="flex-1 data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white"
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
          className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-[#D3E4FD]/50 hover:border-[#9b87f5]/60"
        >
          <HabitList />
        </motion.section>
      </div>
    </div>
  );
};

export default Index;