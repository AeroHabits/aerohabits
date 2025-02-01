import { AppHeader } from "@/components/layout/AppHeader";
import { AppHero } from "@/components/layout/AppHero";
import { AppTabs } from "@/components/layout/AppTabs";
import { WelcomeTour } from "@/components/WelcomeTour";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/90 via-blue-600/80 to-indigo-600/90">
      <WelcomeTour />
      <div className={cn(
        "container py-8 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        isMobile && "pb-24"
      )}>
        <AppHeader />
        <AppHero />
        <AppTabs />
      </div>
    </div>
  );
};

export default Index;