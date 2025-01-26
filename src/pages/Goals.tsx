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
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] animate-gradient-x">
      <div className="container py-8 space-y-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            AREOHABITS
          </h1>
          <UserMenu />
        </div>

        <div className="text-center space-y-4">
          <p className="text-lg text-white/80 max-w-2xl mx-auto animate-fade-in">
            Set and track your goals to achieve lasting change.
          </p>
        </div>

        <div className="space-y-8 animate-fade-in">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Your Goals</h2>
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