
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GradientBackground } from "@/components/premium/GradientBackground";
import { PricingCard } from "@/components/premium/PricingCard";
import { premiumFeatures } from "@/data/premium-features";
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

          <div className="text-center space-y-6 mb-10">
            <h1 className="text-5xl font-bold text-white">Premium Membership</h1>
            <p className="text-xl text-gray-300 max-w-lg mx-auto">
              Elevate your productivity with advanced tools designed for professionals.
            </p>
          </div>

          <PricingCard 
            features={premiumFeatures}
          />
        </div>
      </div>
    </div>
  );
}
