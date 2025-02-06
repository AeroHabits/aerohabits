
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Trophy, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface PremiumFeatureCardProps {
  isMobile?: boolean;
}

export function PremiumFeatureCard({ isMobile }: PremiumFeatureCardProps) {
  const handleUpgradeClick = () => {
    toast.info("Premium features coming soon!");
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      className="relative p-6 rounded-lg bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/30 mb-8 overflow-hidden shadow-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 animate-gradient-x" />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                Unlock Premium Features
              </h3>
              <p className="text-sm text-gray-100 max-w-md">
                Take your personal growth to the next level with premium challenges and exclusive features.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-100">Advanced Challenges</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-100">Personalized Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-100">Expert Guidance</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Medium Challenges
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Hard Challenges
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Master Challenges
              </Badge>
            </div>
          </div>
          <div className="hidden md:block">
            <Button 
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-lg"
              onClick={handleUpgradeClick}
            >
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
