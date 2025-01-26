import { GoalForm } from "@/components/GoalForm";
import { GoalList } from "@/components/GoalList";
import { UserMenu } from "@/components/UserMenu";
import { useState } from "react";

const Goals = () => {
  const [refreshStats, setRefreshStats] = useState(0);

  const handleGoalChange = () => {
    setRefreshStats(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D3E4FD]/90 via-[#E5DEFF]/80 to-[#FDE1D3]/70">
      <div className="container py-8 space-y-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F97316] via-[#D946EF] to-[#0EA5E9] bg-clip-text text-transparent">
            AREOHABITS
          </h1>
          <UserMenu />
        </div>

        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Set and track your goals to achieve lasting change.
          </p>
        </div>

        <div className="space-y-8 animate-fade-in">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Goals</h2>
            <div className="space-y-6">
              <GoalForm onGoalAdded={handleGoalChange} />
              <GoalList onGoalUpdated={handleGoalChange} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Goals;