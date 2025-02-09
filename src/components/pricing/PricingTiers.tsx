
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createCheckoutSession } from "@/lib/stripe";
import { loadStripe } from "@/lib/loadStripe";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { PricingCard } from "./PricingCard";
import { tiers } from "./pricingData";

export function PricingTiers() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: subscription } = useQuery({
    queryKey: ['subscription', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return null;
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user,
  });

  const handleSubscribe = async (tier: typeof tiers[number]) => {
    if (!tier.priceId) {
      navigate('/auth');
      return;
    }

    if (!session) {
      toast.error("Please sign in to upgrade to premium");
      navigate('/auth');
      return;
    }

    try {
      setLoading(true);
      const { sessionId } = await createCheckoutSession(tier.priceId);
      
      const stripe = await loadStripe('pk_test_51QpIhTRrh0VTJWZxqSz0Uho6kNt5UqFySvOhXo8Qx0MqS8QLYCCgwStVvkYjtRtVPigMSnNxViinXgdHWV6iM3FC00BkevHOVU');
      if (!stripe) throw new Error('Stripe failed to load');

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;

    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to start checkout process. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTrialStatus = () => {
    if (!subscription) return null;
    if (subscription.status === 'active' && subscription.plan_type === 'premium') {
      return "Premium Active";
    }
    if (subscription.trial_end && new Date(subscription.trial_end) > new Date()) {
      return `Trial ends ${format(new Date(subscription.trial_end), 'MMM dd, yyyy')}`;
    }
    return "Trial expired";
  };

  const trialStatus = getTrialStatus();
  const isCurrentPlan = subscription?.status === 'active' && subscription?.plan_type === 'premium';

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that's right for you
        </p>
        {trialStatus && (
          <Badge 
            variant="secondary" 
            className="mt-4 bg-blue-500/10 text-blue-500 border-blue-500/20"
          >
            {trialStatus}
          </Badge>
        )}
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {tiers.map((tier, index) => (
          <PricingCard
            key={tier.name}
            tier={tier}
            index={index}
            loading={loading}
            onSubscribe={handleSubscribe}
            isCurrentPlan={isCurrentPlan}
          />
        ))}
      </div>
    </div>
  );
}
