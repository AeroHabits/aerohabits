
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChallengeList } from "@/components/ChallengeList";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function AppTabs() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="w-full max-w-md mx-auto bg-white/20 backdrop-blur-sm border border-white/30">
          <TabsTrigger 
            value="habits" 
            onClick={() => navigate("/habits")}
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
          <TabsContent value="challenges">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/20">
              <ChallengeList />
            </div>
          </TabsContent>
        </motion.div>
      </Tabs>
    </motion.div>
  );
}
