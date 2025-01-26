import { HabitList } from "@/components/HabitList";
import { UserMenu } from "@/components/UserMenu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { WelcomeTour } from "@/components/WelcomeTour";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { StatsGrid } from "@/components/StatsGrid";
import { ProgressChart } from "@/components/ProgressChart";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [stats, setStats] = useState({
    totalHabits: 0,
    currentStreak: 0,
    completionRate: 0,
    weeklyProgress: 0,
    monthlyAverage: 0,
    bestStreak: 0
  });
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchProgressData();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: habits } = await supabase
        .from('habits')
        .select('*');

      if (habits) {
        const completedHabits = habits.filter(h => h.completed).length;
        const totalHabits = habits.length;
        const completionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

        setStats({
          totalHabits,
          currentStreak: Math.max(...habits.map(h => h.streak || 0)),
          completionRate,
          weeklyProgress: completionRate,
          monthlyAverage: completionRate,
          bestStreak: Math.max(...habits.map(h => h.streak || 0))
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProgressData = async () => {
    // This is sample data - you could enhance this with real data from your database
    const sampleData = [
      { date: "Mon", completed: 85, total: 100 },
      { date: "Tue", completed: 75, total: 95 },
      { date: "Wed", completed: 90, total: 100 },
      { date: "Thu", completed: 80, total: 90 },
      { date: "Fri", completed: 85, total: 95 },
      { date: "Sat", completed: 70, total: 85 },
      { date: "Sun", completed: 95, total: 100 }
    ];
    setProgressData(sampleData);
  };

  return (
    <div className="min-h-screen bg-background">
      <WelcomeTour />
      <div className={cn("container py-8 space-y-8", isMobile && "pb-24")}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-foreground">
            Your Habits
          </h1>
          <UserMenu />
        </div>

        <Tabs defaultValue="habits" className="w-full">
          <TabsList className="w-full max-w-md mx-auto bg-card">
            <TabsTrigger 
              value="habits" 
              className="flex-1"
            >
              Habits
            </TabsTrigger>
            <TabsTrigger 
              value="goals" 
              onClick={() => navigate("/goals")}
              className="flex-1"
            >
              Goals
            </TabsTrigger>
            <TabsTrigger 
              value="journey" 
              onClick={() => navigate("/journey")}
              className="flex-1"
            >
              Journey
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-8">
          <section className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-medium mb-4 text-card-foreground">Overview</h2>
            <StatsGrid {...stats} />
          </section>

          <section className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-medium mb-4 text-card-foreground">Weekly Progress</h2>
            <ProgressChart 
              data={progressData}
              title="Habit Completion Trends"
              description="Your habit completion rate over the past week"
            />
          </section>

          <section className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-medium mb-4 text-card-foreground">Your Habits</h2>
            <HabitList />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;