import { Stats } from "@/components/Stats";
import { HabitList } from "@/components/HabitList";
import { UserMenu } from "@/components/UserMenu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { WelcomeTour } from "@/components/WelcomeTour";
import { MobileNav } from "@/components/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D3E4FD]/90 via-[#E5DEFF]/80 to-[#FDE1D3]/70">
      <WelcomeTour />
      <div className={cn("container py-8 space-y-8", isMobile && "pb-24")}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F97316] via-[#D946EF] to-[#0EA5E9] bg-clip-text text-transparent">
            AREOHABITS
          </h1>
          <UserMenu />
        </div>

        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Transform your life through consistent daily habits. Track your progress, build streaks, and achieve your goals.
          </p>
        </div>

        <Tabs defaultValue="habits" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="habits">Habits</TabsTrigger>
            <TabsTrigger value="goals" onClick={() => navigate("/goals")}>Goals</TabsTrigger>
            <TabsTrigger value="journey" onClick={() => navigate("/journey")}>Journey</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-8 animate-fade-in">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Stats</h2>
            <Stats />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Habits</h2>
            <HabitList />
          </section>
        </div>
      </div>
      <MobileNav />
    </div>
  );
};

export default Index;