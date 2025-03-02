
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { PremiumFeatureCard, premiumFeatures } from "@/components/subscription/PremiumFeatureCard";
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard";

export function AppHero() {
  const [showFeatures, setShowFeatures] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*, subscription_status, is_subscribed, trial_end_date')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Calculate days remaining in trial
  const getDaysRemaining = () => {
    if (!profile?.trial_end_date) return 0;
    
    const trialEnd = new Date(profile.trial_end_date);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const daysRemaining = getDaysRemaining();
  const isInTrial = daysRemaining > 0;
  const isActiveSubscriber = profile?.subscription_status === 'active';

  return (
    <div className="text-center space-y-4">
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-800">
        Journey To Self-Mastery
      </h2>
      
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Track your habits, build streaks, and achieve your goals.
      </p>

      {isInTrial && !isActiveSubscriber && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 text-amber-700">
            <Clock className="h-5 w-5" />
            <span className="font-medium">
              Trial ends in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-sm text-amber-600 mt-1">
            Your credit card will be automatically charged when your trial ends.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Button
            variant="outline"
            onClick={() => setShowFeatures(!showFeatures)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {showFeatures ? (
              <>
                Hide Subscriptions <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Subscriptions <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {showFeatures && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
              {premiumFeatures.map((feature, index) => (
                <PremiumFeatureCard 
                  key={feature.title}
                  feature={feature}
                  index={index}
                />
              ))}
            </div>

            <div className="max-w-md mx-auto">
              <SubscriptionCard isLoading={isLoading} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
