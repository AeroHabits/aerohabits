
import { Check } from "lucide-react";
import React from "react";

interface PricingFeatureProps {
  feature: string;
}

export function PricingFeature({ feature }: PricingFeatureProps) {
  return (
    <li className="flex items-center gap-2">
      <Check className="h-4 w-4 text-green-500" />
      <span className="text-sm">{feature}</span>
    </li>
  );
}
