import { Stats } from "@/components/Stats";
import { HabitList } from "@/components/HabitList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100/90 via-fuchsia-100/80 to-rose-100/70">
      <div className="container py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-500 bg-clip-text text-transparent animate-fade-in">
            AREOHABITS
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Transform your life through consistent daily habits. Track your progress, build streaks, and achieve your goals.
          </p>
        </div>

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
    </div>
  );
};

export default Index;