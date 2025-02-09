
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StoreBadge, PurchasedBadge } from "./types";
import { getIcon } from "./utils/getIcon";

interface BadgeCardProps {
  badge: StoreBadge;
  index: number;
  isOwned: boolean;
  onPurchase: (badgeId: string) => void;
}

export function BadgeCard({ badge, index, isOwned, onPurchase }: BadgeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-4 bg-white/5 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-white/10">
            {getIcon(badge.icon)}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              {badge.name}
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                {badge.cost} pts
              </span>
            </h3>
            <p className="text-sm text-white/70 mt-1">
              {badge.description}
            </p>
            <div className="mt-3">
              {isOwned ? (
                <Button 
                  variant="secondary" 
                  className="w-full" 
                  disabled
                >
                  Owned
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => onPurchase(badge.id)}
                >
                  Purchase
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
