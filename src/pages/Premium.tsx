
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GradientBackground } from "@/components/premium/GradientBackground";
import { PremiumHeader } from "@/components/premium/PremiumHeader";
import { PricingCard } from "@/components/premium/PricingCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { SubscriptionTerms } from "@/components/premium/SubscriptionTerms";

export default function Premium() {
  const navigate = useNavigate();
  
  // Define features as simple strings
  const premiumFeatures = [
    "Advanced tracking with detailed insights",
    "Personalized AI recommendations",
    "Priority customer support",
    "Track unlimited habits",
    "Weekly and monthly progress reports",
    "Custom reminders and notifications"
  ];
  
  // Define challenges with title and description
  const premiumChallenges = [
    {
      title: "Master Challenges",
      description: "Access exclusive premium difficulty challenges designed to push your limits"
    },
    {
      title: "Custom Challenge Creation",
      description: "Create personalized challenges tailored to your specific goals and needs"
    },
    {
      title: "Challenge Analytics",
      description: "Get detailed performance metrics and insights for all your challenges"
    }
  ];

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
          
          {/* Add subscription terms with legal details */}
          <SubscriptionTerms />
        </div>
      </div>
    </div>
  );
}
