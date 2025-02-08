
import { BadgeDisplay } from "@/components/badges/BadgeDisplay";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/UserMenu";

const Badges = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className={cn(
        "container mx-auto px-4 py-6 md:py-8",
        isMobile && "pb-24"
      )}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
            AEROHABITS
          </h1>
          <UserMenu />
        </div>

        <BadgeDisplay />
      </div>
    </div>
  );
};

export default Badges;
