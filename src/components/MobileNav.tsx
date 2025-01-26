import { Home, Target, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function MobileNav() {
  const location = useLocation();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 animate-fade-in">
      <nav className="flex h-16 items-center justify-around px-4">
        <Link
          to="/"
          className={cn(
            "flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground",
            location.pathname === "/" && "text-foreground"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Habits</span>
        </Link>
        <Link
          to="/goals"
          className={cn(
            "flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground",
            location.pathname === "/goals" && "text-foreground"
          )}
        >
          <Target className="h-5 w-5" />
          <span className="text-xs">Goals</span>
        </Link>
        <Link
          to="/journey"
          className={cn(
            "flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground",
            location.pathname === "/journey" && "text-foreground"
          )}
        >
          <TrendingUp className="h-5 w-5" />
          <span className="text-xs">Journey</span>
        </Link>
      </nav>
    </div>
  );
}