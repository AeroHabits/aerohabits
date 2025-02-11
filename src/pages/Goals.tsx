
import { GoalForm } from "@/components/GoalForm";
import { GoalList } from "@/components/GoalList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/UserMenu";
import { Card } from "@/components/ui/card";
import { Rocket, Target, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
      icon: <Rocket className="w-8 h-8 text-[#8B5CF6] transition-all duration-300 group-hover:text-[#D946EF]" />,
      title: "Dream Big",
      description: "Your Goals are the First Step Toward Your Dreams. Make Them Count!",
      onClick: () => toast({
        title: "Dream Big!",
        description: "Set Ambitious Goals That Inspire and Challenge You.",
      })
    },
    {
      icon: <Target className="w-8 h-8 text-[#F97316] transition-all duration-300 group-hover:text-[#0EA5E9]" />,
      title: "Stay Focused",
      description: "Break Down Your Goals into Actionable Steps and Track Your Progress.",
      onClick: () => toast({
        title: "Stay Focused!",
        description: "Small Steps Every Day Lead to Big Achievements.",
      })
    },
    {
      icon: <Star className="w-8 h-8 text-[#0EA5E9] transition-all duration-300 group-hover:text-[#8B5CF6]" />,
      title: "Celebrate Progress",
      description: "Every Step Forward is a Victory. Acknowledge Your Achievements!",
      onClick: () => toast({
        title: "Celebrate Progress!",
        description: "Don't Forget to Celebrate Your Wins, Big and Small.",
      })
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className={cn(
        "container mx-auto px-4 py-6 md:py-8",
        isMobile && "pb-24"
      )}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
            AEROHABITS
          </h1>
          <UserMenu />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {inspirationalCards.map((card, index) => (
            <Card 
              key={index} 
              className="p-4 md:p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer transform hover:scale-105"
              onClick={card.onClick}
            >
              <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
                <div className="p-3 bg-white/10 rounded-full">
                  {card.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-white">{card.title}</h3>
                <p className="text-sm md:text-base text-gray-300">{card.description}</p>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/20">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-white">Your Goals</h2>
          <div className="space-y-6">
            <GoalForm onSubmit={handleGoalChange} />
            <GoalList onGoalUpdated={handleGoalChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
