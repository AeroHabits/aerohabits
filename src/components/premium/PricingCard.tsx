
import { motion } from "framer-motion";
import { Star, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PremiumFeatureSection } from "./PremiumFeatureSection";
import { SubscribeButton } from "./SubscribeButton";

interface PricingCardProps {
  features: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  premiumChallenges: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
}

export function PricingCard({ features, premiumChallenges }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <Card className="p-8 bg-white backdrop-blur-md border border-gray-200 shadow-md rounded-xl overflow-hidden relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-100/50 via-transparent to-gray-100/50"
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ backgroundSize: "200% 200%" }}
        />
        
        <div className="relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center items-baseline gap-2">
              <motion.span 
                className="font-bold text-gray-800 text-5xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 10, 
                  delay: 0.4 
                }}
              >
                $9.99
              </motion.span>
              <span className="text-gray-500">/month</span>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-1 text-amber-500 my-1"
            >
              <Star className="h-4 w-4 fill-amber-500" />
              <Star className="h-4 w-4 fill-amber-500" />
              <Star className="h-4 w-4 fill-amber-500" />
              <Star className="h-4 w-4 fill-amber-500" />
              <Star className="h-4 w-4 fill-amber-500" />
            </motion.div>
          </div>

          <PremiumFeatureSection 
            title="Premium Features"
            features={features}
            titleGradient="from-gray-700 to-gray-900"
          />

          <PremiumFeatureSection 
            title="Exclusive Premium Challenges"
            features={premiumChallenges}
            titleGradient="from-gray-700 to-gray-900"
            variant="challenge"
          />

          <SubscribeButton />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="space-y-3 border-t border-gray-200 pt-4"
          >
            <p className="text-sm text-gray-600 text-center">
              You'll be charged $9.99 monthly. Cancel anytime.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Info className="w-4 h-4" />
              <p>Secure payment processing by Stripe</p>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
