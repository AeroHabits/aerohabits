import { JourneyChart } from "@/components/JourneyChart";

const Journey = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#222222] via-[#403E43] to-[#002D62] animate-gradient-x">
      <div className="container py-8 space-y-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            AREOHABITS
          </h1>
        </div>

        <div className="text-center space-y-4">
          <p className="text-lg text-[#9F9EA1] max-w-2xl mx-auto animate-fade-in">
            Track your progress and visualize your habit-building journey.
          </p>
        </div>

        <div className="space-y-8 animate-fade-in">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Your Journey</h2>
            <JourneyChart />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Journey;