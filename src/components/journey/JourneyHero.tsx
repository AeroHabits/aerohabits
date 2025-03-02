
import { TrendingUp, Award, Star } from "lucide-react";

export function JourneyHero() {
  return (
    <div className="relative overflow-hidden rounded-xl p-8 text-center bg-gray-50 border border-gray-200">
      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <div className="flex justify-center gap-4 mb-2">
          <div className="p-2 bg-white rounded-full border border-gray-200">
            <TrendingUp className="w-6 h-6 text-gray-700" />
          </div>
          <div className="p-2 bg-white rounded-full border border-gray-200">
            <Award className="w-6 h-6 text-gray-700" />
          </div>
          <div className="p-2 bg-white rounded-full border border-gray-200">
            <Star className="w-6 h-6 text-gray-700" />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-800">
          Your Habit Journey
        </h1>
        
        <div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Track your progress, celebrate achievements, and witness your growth transform into lasting habits.
          </p>
        </div>
        
        <div className="pt-2">
          <span className="inline-block bg-white px-4 py-1.5 rounded-full text-gray-700 text-sm font-medium border border-gray-200">
            Every step counts on your path to excellence
          </span>
        </div>
      </div>
    </div>
  );
}
