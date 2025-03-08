
import { HabitList } from "@/components/HabitList";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/UserMenu";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { useHabits } from "@/hooks/useHabits";

const Habits = () => {
  const isMobile = useIsMobile();
  const [isResetting, setIsResetting] = useState(false);
  const { refetch } = useHabits();

  const handleResetHabits = async () => {
    try {
      setIsResetting(true);
      const { data, error } = await supabase.functions.invoke('reset-habits');
      
      if (error) {
        console.error("Error resetting habits:", error);
        toast.error("Failed to reset habits", {
          description: "There was a problem resetting your habits. Please try again."
        });
        return;
      }
      
      toast.success("Habits reset successfully", {
        description: `${data.count || 0} habits were reset to uncompleted status while preserving streaks.`
      });

      // Refresh the habits list to show updated state
      await refetch();
      
    } catch (error) {
      console.error("Error resetting habits:", error);
      toast.error("Failed to reset habits");
    } finally {
      setIsResetting(false);
    }
  };

  return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500 rounded-full filter blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 left-0 w-1/4 h-1/4 bg-purple-500 rounded-full filter blur-[100px] animate-float" />
        <div className="absolute top-1/2 right-1/4 w-1/5 h-1/5 bg-indigo-500 rounded-full filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-1/4 h-1/4 bg-blue-600 rounded-full filter blur-[120px] animate-float" />
        <div className="absolute top-1/3 left-1/4 w-1/6 h-1/6 bg-indigo-400 rounded-full filter blur-[80px] animate-pulse" />
      </div>

      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.5
    }} className={cn("container mx-auto px-4 pt-12 pb-6 md:py-8 space-y-8 md:space-y-12 safe-top relative z-10", isMobile && "pb-20")}>
        <div className="flex justify-between items-center mb-8">
          <PageHeader />
          <UserMenu />
        </div>
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.2
      }} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-300">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              <span className="relative">
                <span className="text-gradient bg-gradient-to-r from-blue-300 to-indigo-400">
                  Your Daily Habits
                </span>
                <motion.span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-300 to-indigo-400" initial={{
                width: "0%"
              }} animate={{
                width: "100%"
              }} transition={{
                duration: 0.8,
                delay: 0.5
              }} />
              </span>
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Build consistency by tracking your daily habits and watching your streaks grow
            </p>

            {/* Improved Reset Habits button */}
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-transparent text-blue-300 border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
                onClick={handleResetHabits}
                disabled={isResetting}
              >
                <RefreshCcw className={cn("h-4 w-4 mr-2", isResetting && "animate-spin")} />
                {isResetting ? "Resetting..." : "Reset Habits for New Day"}
              </Button>
            </div>
          </div>
          <HabitList />
        </motion.div>
      </motion.div>
    </div>;
};
export default Habits;
