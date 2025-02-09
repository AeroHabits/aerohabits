
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { PricingCard } from "./PricingCard";
import { tiers } from "./pricingData";
import { createCheckoutSession } from "@/lib/stripe";

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

  const { data: stripeConfig } = useQuery({
    queryKey: ['stripeConfig'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stripe_config')
        .select('publishable_key')
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      if (!session?.user) return null;
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!session?.user,
  });

  const handleSubscribe = async (tier: typeof tiers[number]) => {
    if (!session) {
      toast.error("Please sign in first");
      navigate('/auth');
      return;
    }

    if (!tier.priceId) {
      toast.info("This plan is not available yet. Please check back soon!");
      return;
    }

    try {
      setLoading(true);
      const response = await createCheckoutSession(tier.priceId);
      
      if (!response?.sessionId) {
        throw new Error('Failed to create checkout session');
      }

      const { loadStripe } = await import('@/lib/loadStripe');
      
      if (!stripeConfig?.publishable_key) {
        throw new Error('Stripe configuration is not available');
      }

      const stripe = await loadStripe(stripeConfig.publishable_key);
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const result = await stripe.redirectToCheckout({
        sessionId: response.sessionId
      });

      if (result?.error) {
        throw new Error(result.error.message || 'Failed to redirect to checkout');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error?.message || "Failed to start subscription process. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that's right for you
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {tiers.map((tier, index) => (
          <PricingCard
            key={tier.name}
            tier={tier}
            index={index}
            loading={loading}
            onSubscribe={handleSubscribe}
            isCurrentPlan={subscription?.plan_type === tier.name.toLowerCase()}
          />
        ))}
      </div>
    </div>
  );
}
