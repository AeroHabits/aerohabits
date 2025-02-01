import { GoalForm } from "@/components/GoalForm";
import { GoalList } from "@/components/GoalList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/UserMenu";
import { Card } from "@/components/ui/card";
import { Rocket, Target, Star } from "lucide-react";

const Goals = () => {
  const isMobile = useIsMobile();
  
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
      icon: <Rocket className="w-8 h-8 text-blue-500" />,
      title: "Dream Big",
      description: "Your goals are the first step towards your dreams. Make them count!"
    },
    {
      icon: <Target className="w-8 h-8 text-purple-500" />,
      title: "Stay Focused",
      description: "Break down your goals into actionable steps and track your progress."
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: "Celebrate Progress",
      description: "Every step forward is a victory. Acknowledge your achievements!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/90 via-blue-600/80 to-indigo-600/90">
      <div className={cn(
        "container py-8 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        isMobile && "pb-24"
      )}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">
            AREOHABITS
          </h1>
          <UserMenu />
        </div>

        <div className="text-center space-y-4">
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Set and track your goals to achieve lasting change.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {inspirationalCards.map((card, index) => (
            <Card key={index} className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-colors duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-white/10 rounded-full">
                  {card.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                <p className="text-white/80">{card.description}</p>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/30">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Your Goals</h2>
            <div className="space-y-6">
              <GoalForm onSubmit={handleGoalChange} />
              <GoalList onGoalUpdated={handleGoalChange} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Goals;