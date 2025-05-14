
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Target, Trophy, Route } from "lucide-react";
import { cn } from "@/lib/utils";

export const MobileNav = () => {
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
      className="md:hidden fixed bottom-0 left-0 right-0 glass-dark border-t border-[#403E43] shadow-lg z-50 safe-bottom"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-xs space-y-1",
                isActive
                  ? "text-[#9b87f5]"
                  : "text-[#8E9196] hover:text-[#9b87f5] transition-colors"
              )}
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
              <span className={isActive ? "font-medium" : ""}>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};
