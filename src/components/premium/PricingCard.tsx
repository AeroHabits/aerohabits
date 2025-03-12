
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
}

export function PricingCard({ features }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <Card className="p-8 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-md border border-gray-700/30 shadow-xl rounded-xl overflow-hidden relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-blue-600/10"
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
                className="font-bold text-white text-5xl"
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
              <span className="text-gray-400">/month</span>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-1 text-yellow-400 my-1"
            >
              <Star className="h-4 w-4 fill-yellow-400" />
              <Star className="h-4 w-4 fill-yellow-400" />
              <Star className="h-4 w-4 fill-yellow-400" />
              <Star className="h-4 w-4 fill-yellow-400" />
              <Star className="h-4 w-4 fill-yellow-400" />
            </motion.div>
          </div>

          <PremiumFeatureSection 
            title="Premium Features"
            features={features}
            titleGradient="from-blue-300 to-blue-300"
          />

          <SubscribeButton />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="space-y-3 border-t border-gray-800 pt-4"
          >
            <p className="text-sm text-gray-400 text-center">
              Subscriptions will be charged to your credit card through your Apple ID account. Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.
            </p>
            <div className="flex items-center justify-center gap-2">
              <a href="/terms" className="text-sm text-blue-400 hover:underline">Terms of Service</a>
              <span className="text-gray-500">•</span>
              <a href="/privacy" className="text-sm text-blue-400 hover:underline">Privacy Policy</a>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
