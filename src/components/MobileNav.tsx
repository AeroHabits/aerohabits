import { Link, useLocation } from "react-router-dom";
import { Home, Target, Map, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export const MobileNav = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <div className="bg-gradient-to-r from-blue-600/95 via-blue-700/95 to-indigo-700/95 backdrop-blur-xl border-t border-white/20 shadow-lg">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            <Link
              to="/"
              className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                pathname === "/" 
                ? "text-white scale-110" 
                : "text-white/70 hover:text-white"
              }`}
            >
              <div className="relative">
                <Home className={`w-6 h-6 ${
                  pathname === "/" 
                  ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                  : ""
                }`} />
                {pathname === "/" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-xs font-medium">Habits</span>
            </Link>

            <Link
              to="/challenges"
              className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                pathname === "/challenges" 
                ? "text-white scale-110" 
                : "text-white/70 hover:text-white"
              }`}
            >
              <div className="relative">
                <Trophy className={`w-6 h-6 ${
                  pathname === "/challenges" 
                  ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                  : ""
                }`} />
                {pathname === "/challenges" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-xs font-medium">Challenges</span>
            </Link>

            <Link
              to="/goals"
              className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                pathname === "/goals" 
                ? "text-white scale-110" 
                : "text-white/70 hover:text-white"
              }`}
            >
              <div className="relative">
                <Target className={`w-6 h-6 ${
                  pathname === "/goals" 
                  ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                  : ""
                }`} />
                {pathname === "/goals" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-xs font-medium">Goals</span>
            </Link>

            <Link
              to="/journey"
              className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                pathname === "/journey" 
                ? "text-white scale-110" 
                : "text-white/70 hover:text-white"
              }`}
            >
              <div className="relative">
                <Map className={`w-6 h-6 ${
                  pathname === "/journey" 
                  ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                  : ""
                }`} />
                {pathname === "/journey" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-xs font-medium">Journey</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};