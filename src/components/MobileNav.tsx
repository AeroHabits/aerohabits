import { Home, Target, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function MobileNav() {
  const location = useLocation();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-[#2980B9]/20 bg-gradient-to-r from-[#1A1F2C] via-[#2C3E50] to-[#2980B9] backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 z-50 animate-fade-in">
      <nav className="flex h-16 items-center justify-around px-4">
        <Link
          to="/"
          className={cn(
            "flex flex-col items-center gap-1 text-white/70 transition-all duration-300 hover:text-white hover:scale-110",
            location.pathname === "/" && "text-white scale-105"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs font-medium">Habits</span>
        </Link>
        <Link
          to="/goals"
          className={cn(
            "flex flex-col items-center gap-1 text-white/70 transition-all duration-300 hover:text-white hover:scale-110",
            location.pathname === "/goals" && "text-white scale-105"
          )}
        >
          <Target className="h-5 w-5" />
          <span className="text-xs font-medium">Goals</span>
        </Link>
        <Link
          to="/journey"
          className={cn(
            "flex flex-col items-center gap-1 text-white/70 transition-all duration-300 hover:text-white hover:scale-110",
            location.pathname === "/journey" && "text-white scale-105"
          )}
        >
          <TrendingUp className="h-5 w-5" />
          <span className="text-xs font-medium">Journey</span>
        </Link>
      </nav>
    </div>
  );
}