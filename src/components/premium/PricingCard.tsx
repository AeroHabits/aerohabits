
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Sparkles } from "lucide-react";
import { PremiumFeatureItem } from "./PremiumFeatureItem";
import { PremiumFeatureSection } from "./PremiumFeatureSection";
import { SubscribeButton } from "./SubscribeButton";
import { AppleSubscriptionInfo } from "../subscription/AppleSubscriptionInfo";

interface PricingCardProps {
  features: string[];
  premiumChallenges: {
    title: string;
    description: string;
  }[];
}

export function PricingCard({ features, premiumChallenges }: PricingCardProps) {
  return (
    <Card className="bg-black/80 shadow-xl border-[#333] backdrop-blur relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
      <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-purple-500/30 rounded-full blur-3xl transform rotate-45" />
      <div className="absolute -bottom-20 -left-20 w-[250px] h-[250px] bg-blue-500/20 rounded-full blur-3xl" />
      
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-400" />
            Premium
          </CardTitle>
          <div className="bg-[#222] p-1 px-2 rounded-full text-xs font-medium text-white border border-white/10">
            3-Day Free Trial
          </div>
        </div>
        <CardDescription className="text-gray-400">Take your habit journey to the next level</CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-6">
        <div className="flex items-baseline mb-4">
          <span className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-300 bg-clip-text text-transparent">$9.99</span>
          <span className="text-gray-400 ml-2">/month</span>
        </div>
        
        {/* Moved subscription button to the top for better visibility */}
        <SubscribeButton />
        
        {/* Animated card divider */}
        <div className="relative h-[1px] w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 my-4">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0"
            animate={{ x: ["0%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <PremiumFeatureSection title="Everything you get">
          {features.map((feature, index) => (
            <PremiumFeatureItem key={index} feature={feature} />
          ))}
        </PremiumFeatureSection>
        
        <PremiumFeatureSection title="Premium Challenges" icon={<Crown className="h-5 w-5 text-yellow-400" />}>
          {premiumChallenges.map((challenge, index) => (
            <div key={index} className="mb-3">
              <h4 className="font-medium text-white">{challenge.title}</h4>
              <p className="text-gray-400 text-sm">{challenge.description}</p>
            </div>
          ))}
        </PremiumFeatureSection>
        
        <AppleSubscriptionInfo />
      </CardContent>
    </Card>
  );
}
