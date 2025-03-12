
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GradientBackground } from "@/components/premium/GradientBackground";
import { PremiumHeader } from "@/components/premium/PremiumHeader";
import { PricingCard } from "@/components/premium/PricingCard";
import { premiumFeatures, premiumChallenges } from "@/data/premium-features";
import { PageHeader } from "@/components/layout/PageHeader";

export default function Premium() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-black overflow-hidden">
      {/* Enhanced gradient background */}
      <GradientBackground />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="text-gray-300 hover:text-white flex items-center gap-2 transition-all hover:bg-white/10 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <PageHeader />
          </div>

          <PricingCard 
            features={premiumFeatures}
            premiumChallenges={premiumChallenges}
          />
        </div>
      </div>
    </div>
  );
}
