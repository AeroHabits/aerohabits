import { GoalForm } from "@/components/GoalForm";
import { GoalList } from "@/components/GoalList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatsGrid } from "@/components/StatsGrid";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/UserMenu";

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

        {goals && (
          <StatsGrid
            totalHabits={goals.length}
            currentStreak={0}
            completionRate={0}
            weeklyProgress={0}
            monthlyAverage={0}
            bestStreak={0}
          />
        )}
        
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/30">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Your Goals</h2>
            <div className="space-y-6">
              <GoalForm onSubmit={handleGoalChange} />
              <GoalList onGoalChange={handleGoalChange} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Goals;