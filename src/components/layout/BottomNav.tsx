
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
      className="fixed bottom-0 left-0 right-0 glass-dark border-t border-[#403E43] shadow-lg z-50 safe-bottom"
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
                    ? "text-[#9b87f5] dark:text-[#9b87f5]"
                    : "text-[#8E9196] hover:text-[#9b87f5]"
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
                      className="absolute -inset-1.5 bg-[#9b87f5]/20 rounded-full blur-sm"
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
                  className="absolute top-0 left-0 right-0 h-full bg-gradient-to-t from-[#9b87f5]/10 to-transparent"
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
