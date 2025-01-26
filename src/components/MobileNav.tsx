import { Link, useLocation } from "react-router-dom";
import { Home, Target, Map } from "lucide-react";

export const MobileNav = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glass effect container with gradient border */}
      <div className="backdrop-blur-xl bg-white/10 border-t border-white/20 shadow-lg">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            <Link
              to="/"
              className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                pathname === "/" 
                ? "text-white scale-110" 
                : "text-white/60 hover:text-white"
              }`}
            >
              <Home className={`w-6 h-6 ${
                pathname === "/" 
                ? "drop-shadow-[0_0_8px_rgba(155,135,245,0.8)]" 
                : ""
              }`} />
              <span className="text-xs font-medium">Habits</span>
            </Link>

            <Link
              to="/goals"
              className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                pathname === "/goals" 
                ? "text-white scale-110" 
                : "text-white/60 hover:text-white"
              }`}
            >
              <Target className={`w-6 h-6 ${
                pathname === "/goals" 
                ? "drop-shadow-[0_0_8px_rgba(155,135,245,0.8)]" 
                : ""
              }`} />
              <span className="text-xs font-medium">Goals</span>
            </Link>

            <Link
              to="/journey"
              className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                pathname === "/journey" 
                ? "text-white scale-110" 
                : "text-white/60 hover:text-white"
              }`}
            >
              <Map className={`w-6 h-6 ${
                pathname === "/journey" 
                ? "drop-shadow-[0_0_8px_rgba(155,135,245,0.8)]" 
                : ""
              }`} />
              <span className="text-xs font-medium">Journey</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};