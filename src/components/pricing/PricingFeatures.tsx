
import { Check } from "lucide-react";

interface PricingFeaturesProps {
  features: readonly string[];
}

export function PricingFeatures({ features }: PricingFeaturesProps) {
  return (
    <ul className="space-y-3">
      {features.map((feature) => (
        <li key={feature} className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm">{feature}</span>
        </li>
      ))}
    </ul>
  );
}
