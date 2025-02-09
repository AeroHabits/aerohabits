
import { StoreBadge, PurchasedBadge } from "./types";
import { BadgeCard } from "./BadgeCard";

interface BadgeTypeContentProps {
  badges: StoreBadge[];
  purchasedBadges: PurchasedBadge[] | undefined;
  onPurchase: (badgeId: string) => void;
}

export function BadgeTypeContent({ badges, purchasedBadges, onPurchase }: BadgeTypeContentProps) {
  const isOwned = (badgeId: string) => {
    return purchasedBadges?.some(pb => pb.badge_id === badgeId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {badges.map((badge, index) => (
        <BadgeCard
          key={badge.id}
          badge={badge}
          index={index}
          isOwned={isOwned(badge.id)}
          onPurchase={onPurchase}
        />
      ))}
    </div>
  );
}
