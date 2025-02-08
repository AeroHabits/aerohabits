
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { PricingFeatures } from "./PricingFeatures";
import { tiers } from "./pricingData";

type PricingTier = typeof tiers[number];

interface PricingCardProps {
  tier: PricingTier;
  index: number;
  loading: boolean;
  onSubscribe: (tier: PricingTier) => void;
  isCurrentPlan: boolean;
}

export function PricingCard({ tier, index, loading, onSubscribe, isCurrentPlan }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
    >
      <Card className="relative h-full flex flex-col">
        {tier.badge && (
          <Badge
            className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500"
            variant="secondary"
          >
            <Star className="h-3 w-3 mr-1" />
            {tier.badge}
          </Badge>
        )}
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(tier.name === "Premium Yearly" || tier.name === "Premium Monthly") && (
              <Zap className="h-5 w-5 text-blue-500" />
            )}
            {tier.name}
          </CardTitle>
          <div className="mt-4">
            <span className="text-3xl font-bold">${tier.price}</span>
            <span className="text-muted-foreground">{tier.name !== "Free Trial" ? "/year" : ""}</span>
            {tier.perMonth && (
              <div className="mt-1 text-sm text-muted-foreground">
                Just ${tier.perMonth}/month
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {tier.description}
          </p>
        </CardHeader>
        <CardContent className="flex-grow">
          <PricingFeatures features={tier.features} />
        </CardContent>
        <CardFooter>
          <Button
            variant={tier.buttonVariant}
            className="w-full"
            onClick={() => onSubscribe(tier)}
            disabled={loading || isCurrentPlan}
          >
            {loading ? "Loading..." : isCurrentPlan ? "Current Plan" : tier.buttonText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
