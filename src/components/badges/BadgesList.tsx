
import { DisplayBadge } from "./DisplayBadge";

interface Badge {
  id: string;
  name: string;
  description: string;
  badge_type: string;
  isUnlocked: boolean;
  unlockMessage: string;
  points_required?: number;
}

interface BadgesListProps {
  badges: Badge[];
}

export function BadgesList({ badges }: BadgesListProps) {
  return (
    <div className="space-y-4">
      {badges.map((badge, index) => (
        <DisplayBadge key={badge.id} badge={badge} index={index} />
      ))}

      {badges.length === 0 && (
        <div className="text-center py-8 text-white/60">
          No badges available yet. Start completing challenges to earn them!
        </div>
      )}
    </div>
  );
}
