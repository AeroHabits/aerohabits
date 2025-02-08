
import { Separator } from "@/components/ui/separator";
import { BadgesList } from "./BadgesList";

interface BadgeTabContentProps {
  badges: Array<{
    id: string;
    name: string;
    description: string;
    badge_type: string;
    isUnlocked: boolean;
    unlockMessage: string;
    points_required?: number;
  }>;
  isLoading: boolean;
}

export function BadgeTabContent({ badges, isLoading }: BadgeTabContentProps) {
  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-white/80">
          Your earned and purchased badges are displayed here. Each badge represents a milestone in your journey!
        </p>
      </div>
      <Separator className="bg-white/10 mb-4" />
      {isLoading ? (
        <div className="text-center py-8 text-white/60">
          Loading badges...
        </div>
      ) : (
        <BadgesList badges={badges} />
      )}
    </div>
  );
}
