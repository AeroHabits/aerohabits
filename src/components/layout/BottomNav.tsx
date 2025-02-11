
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Trophy, Target, Route } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const location = useLocation();

  const tabs = [
    {
      name: "Habits",
      path: "/",
      icon: Home,
    },
    {
      name: "Challenges",
      path: "/challenges",
      icon: Trophy,
    },
    {
      name: "Goals",
      path: "/goals",
      icon: Target,
    },
    {
      name: "Journey",
      path: "/journey",
      icon: Route,
    },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 shadow-lg z-50"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="relative w-full"
            >
              <motion.div
                className={cn(
                  "flex flex-col items-center justify-center h-16 relative z-10",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="relative">
                  <Icon className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive && "animate-pulse"
                  )} />
                  {isActive && (
                    <motion.div
                      layoutId="bubble"
                      className="absolute -inset-1.5 bg-blue-500/20 dark:bg-blue-400/20 rounded-full blur-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-1.5 font-medium transition-all duration-300",
                  isActive && "scale-105"
                )}>{tab.name}</span>
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-0 right-0 h-full bg-gradient-to-t from-blue-500/10 to-transparent"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
