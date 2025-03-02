
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Star, Trophy, Target } from "lucide-react";

interface PremiumFeature {
  icon: JSX.Element;
  title: string;
  description: string;
}

export const premiumFeatures: PremiumFeature[] = [
  {
    icon: <Star className="h-6 w-6 text-gray-700" />,
    title: "Advanced Challenges",
    description: "Access premium difficulty levels and exclusive challenges"
  },
  {
    icon: <Trophy className="h-6 w-6 text-gray-700" />,
    title: "Detailed Analytics",
    description: "Get in-depth insights about your habits and progress"
  },
  {
    icon: <Target className="h-6 w-6 text-gray-700" />,
    title: "Personalized Goals",
    description: "Set and track advanced personal goals"
  }
];

interface PremiumFeatureCardProps {
  feature: PremiumFeature;
  index: number;
}

export function PremiumFeatureCard({ feature, index }: PremiumFeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6 bg-white backdrop-blur-sm border border-gray-200 hover:bg-gray-50 transition-all">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-full bg-gray-100">
            {feature.icon}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
