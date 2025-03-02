
import { Trophy, Target, Rocket } from "lucide-react";

export function ChallengeHero() {
  return (
    <div className="relative overflow-hidden rounded-xl shadow-md bg-white border border-gray-200">
      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="relative flex items-center justify-center p-5 bg-gray-100 rounded-full shadow-sm border border-gray-200">
                <Trophy className="w-12 h-12 text-gray-800" />
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="space-y-2 mb-6">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight tracking-tight">
                Excellence Awaits
              </h2>
              
              <div className="flex items-center gap-2 pl-1">
                <Target className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium tracking-wide">Strategic growth for high achievers</span>
              </div>
            </div>

            <p className="text-xl text-gray-700 leading-relaxed font-medium relative">
              Elevate your performance through expertly designed challenges that drive 
              measurable growth and unlock your full potential.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <Rocket className="w-5 h-5 text-gray-600" />
              <span className="bg-gray-50 px-5 py-2.5 rounded-full text-gray-700 font-semibold text-sm border border-gray-200">
                Begin your excellence journey today
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
