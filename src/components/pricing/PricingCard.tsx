
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { PricingFeature } from "./PricingFeature";

interface PricingTier {
  name: string;
  price: string;
  interval: string;
  description: string;
  features: string[];
  badge: string | null;
  buttonText: string;
  buttonVariant: "outline" | "default";
  priceId: string | null;
}

interface PricingCardProps {
  tier: PricingTier;
  index: number;
  loading: boolean;
  onSubscribe: (priceId: string | null) => void;
}

export function PricingCard({ tier, index, loading, onSubscribe }: PricingCardProps) {
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
            {tier.name === "Yearly" ? (
              <Zap className="h-5 w-5 text-blue-500" />
            ) : null}
            {tier.name}
          </CardTitle>
          <div className="mt-4">
            <span className="text-3xl font-bold">${tier.price}</span>
            <span className="text-muted-foreground">/{tier.interval}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {tier.description}
          </p>
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="space-y-3">
            {tier.features.map((feature) => (
              <PricingFeature key={feature} feature={feature} />
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            variant={tier.buttonVariant}
            className="w-full"
            onClick={() => onSubscribe(tier.priceId)}
            disabled={loading}
          >
            {loading ? "Loading..." : tier.buttonText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
