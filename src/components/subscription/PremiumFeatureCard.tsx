
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Star, Trophy, Target, Zap } from "lucide-react";

interface PremiumFeature {
  icon: JSX.Element;
  title: string;
  description: string;
}

export const premiumFeatures: PremiumFeature[] = [
  {
    icon: <Star className="h-6 w-6 text-amber-400" />,
    title: "Advanced Challenges",
    description: "Access premium difficulty levels and exclusive challenges"
  },
  {
    icon: <Trophy className="h-6 w-6 text-amber-500" />,
    title: "Detailed Analytics",
    description: "Get in-depth insights about your habits and progress"
  },
  {
    icon: <Target className="h-6 w-6 text-blue-500" />,
    title: "Personalized Goals",
    description: "Set and track advanced personal goals"
  },
  {
    icon: <Zap className="h-6 w-6 text-purple-400" />,
    title: "AI Guidance",
    description: "Intelligent recommendations based on your behavior patterns"
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
      <Card className="p-4 bg-gradient-to-br from-gray-900 to-gray-950 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 shadow-inner">
            {feature.icon}
          </div>
          <div className="text-left">
            <h3 className="font-medium text-white text-lg">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
