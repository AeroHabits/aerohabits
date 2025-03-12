
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GradientBackground } from "@/components/premium/GradientBackground";
import { PricingCard } from "@/components/premium/PricingCard";
import { premiumFeatures } from "@/data/premium-features";
import { PageHeader } from "@/components/layout/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { PremiumFeatureCard } from "@/components/subscription/PremiumFeatureCard";

export default function Premium() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleBackClick = () => {
    if (isAuthenticated) {
      navigate(-1);
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen relative bg-black overflow-hidden">
      {/* Enhanced gradient background */}
      <GradientBackground />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={handleBackClick} 
              className="text-gray-300 hover:text-white flex items-center gap-2 transition-all hover:bg-white/10 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              {isAuthenticated ? 'Back' : 'Sign In'}
            </Button>
            
            <PageHeader />
          </div>

          <div className="text-center space-y-6 mb-10">
            <h1 className="text-5xl font-bold text-white">Premium Membership</h1>
            <p className="text-xl text-gray-300 max-w-lg mx-auto">
              Elevate your productivity with advanced tools designed for professionals.
            </p>
            {!isAuthenticated && (
              <div className="mt-4">
                <Button
                  onClick={() => navigate('/auth')}
                  variant="premium"
                  size="lg"
                  className="px-8 py-6 text-lg"
                >
                  Sign in to get started
                </Button>
                <p className="text-gray-400 mt-4">
                  New to AeroHabits? Create an account to start your free trial.
                </p>
              </div>
            )}
          </div>

          <PricingCard 
            features={premiumFeatures}
          />
          
          {/* Feature highlights */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-white text-center mb-6">
              Premium Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon: <span className="text-yellow-500 text-2xl">✨</span>,
                  title: "Advanced Analytics",
                  description: "Access detailed insights and performance metrics"
                },
                {
                  icon: <span className="text-blue-500 text-2xl">🤖</span>,
                  title: "AI-Powered Recommendations",
                  description: "Personalized suggestions based on your usage patterns"
                },
                {
                  icon: <span className="text-green-500 text-2xl">🎯</span>,
                  title: "Advanced Goal Tracking",
                  description: "Set complex goals with detailed progress tracking"
                },
                {
                  icon: <span className="text-purple-500 text-2xl">🏆</span>,
                  title: "Exclusive Challenges",
                  description: "Access premium challenges for expert habit builders"
                }
              ].map((feature, index) => (
                <PremiumFeatureCard 
                  key={index}
                  feature={feature}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
