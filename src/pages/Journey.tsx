import { WeeklyProgress } from "@/components/WeeklyProgress";
import { CumulativeStats } from "@/components/CumulativeStats";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Journey = () => {
  const { data: habits = [] } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] animate-gradient-x">
      <div className="container py-8 space-y-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            AREOHABITS
          </h1>
        </div>

        <div className="text-center space-y-4">
          <p className="text-lg text-white/80 max-w-2xl mx-auto animate-fade-in">
            Track your progress and visualize your habit-building journey.
          </p>
        </div>

        <div className="space-y-8 animate-fade-in">
          <CumulativeStats />
          <WeeklyProgress />
        </div>
      </div>
    </div>
  );
}

export default Journey;