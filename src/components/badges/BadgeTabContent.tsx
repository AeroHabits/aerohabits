
import { Separator } from "@/components/ui/separator";
import { BadgesList } from "./BadgesList";
import { Loader2 } from "lucide-react";

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
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-white/60 animate-spin mb-2" />
          <p className="text-center text-white/60">
            Loading badges...
          </p>
        </div>
      ) : (
        <BadgesList badges={badges || []} />
      )}
    </div>
  );
}
