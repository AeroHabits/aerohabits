import { GoalForm } from "@/components/GoalForm";
import { GoalList } from "@/components/GoalList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/UserMenu";
import { Card } from "@/components/ui/card";
import { Rocket, Target, Star, Sparkles, Trophy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";

const Goals = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const { data: goals, refetch } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleGoalChange = () => {
    refetch();
  };

  const inspirationalCards = [
    {
      icon: <Rocket className="w-8 h-8 text-blue-500 transition-all duration-300 group-hover:text-indigo-400" />,
      title: "Dream Big",
      description: "Your Goals are the First Step Toward Your Dreams. Make Them Count!",
      onClick: () => toast({
        title: "Dream Big!",
        description: "Set Ambitious Goals That Inspire and Challenge You.",
      })
    },
    {
      icon: <Target className="w-8 h-8 text-emerald-500 transition-all duration-300 group-hover:text-teal-400" />,
      title: "Stay Focused",
      description: "Break Down Your Goals into Actionable Steps and Track Your Progress.",
      onClick: () => toast({
        title: "Stay Focused!",
        description: "Small Steps Every Day Lead to Big Achievements.",
      })
    },
    {
      icon: <Star className="w-8 h-8 text-amber-500 transition-all duration-300 group-hover:text-yellow-400" />,
      title: "Celebrate Progress",
      description: "Every Step Forward is a Victory. Acknowledge Your Achievements!",
      onClick: () => toast({
        title: "Celebrate Progress!",
        description: "Don't Forget to Celebrate Your Wins, Big and Small.",
      })
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-950 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className={cn(
        "container mx-auto px-4 py-6 md:py-8 relative z-10",
        isMobile && "pt-12 safe-top" // Added pt-12 and safe-top for mobile
      )}>
        <div className="flex justify-between items-center mb-8">
          <PageHeader />
          <UserMenu />
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-10"
        >
          <Card className="p-6 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 backdrop-blur-sm border border-white/10 shadow-xl">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-600/50 to-indigo-600/50 rounded-full">
                <Trophy className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Your Goal Tracker</h2>
                <p className="text-blue-100 text-sm">Turn your aspirations into achievements</p>
              </div>
            </div>
            <p className="text-white/90">
              Welcome to your personal goal tracking dashboard. Set meaningful goals, track your progress, and celebrate your victories!
            </p>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {inspirationalCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * (index + 1), duration: 0.4 }}
            >
              <Card 
                className="p-4 md:p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer transform hover:scale-105 hover:shadow-xl"
                onClick={card.onClick}
              >
                <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
                  <motion.div 
                    className="p-3 bg-white/5 rounded-full"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    {card.icon}
                  </motion.div>
                  <h3 className="text-lg md:text-xl font-semibold text-white">{card.title}</h3>
                  <p className="text-sm md:text-base text-gray-300">{card.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mb-10"
        >
          <div className="bg-gradient-to-br from-gray-900/70 to-slate-800/70 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-600/30 to-indigo-600/30 rounded-full">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-white">Your Goals</h2>
            </div>
            <div className="space-y-6">
              <GoalForm onSubmit={handleGoalChange} />
              <GoalList onGoalUpdated={handleGoalChange} />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Goals;
