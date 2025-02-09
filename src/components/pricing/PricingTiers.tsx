
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createCheckoutSession } from "@/lib/stripe";
import { loadStripe } from "@/lib/loadStripe";
import { PricingHeader } from "./PricingHeader";
import { PricingCard } from "./PricingCard";

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

  const { data: stripeProducts } = useQuery({
    queryKey: ['stripeProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stripe_products')
        .select('*')
        .eq('active', true)
        .order('price');
      
      if (error) throw error;
      return data;
    },
  });

  const getSelectedPlan = () => {
    if (!stripeProducts) return null;
    return stripeProducts[0]; // Monthly plan
  };

  const handleSubscribe = async (priceId: string | null) => {
    if (!priceId) {
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
      const { sessionId } = await createCheckoutSession(priceId);
      
      const stripe = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || '');
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

  const selectedPlan = getSelectedPlan();

  const tiers = [
    {
      name: "Monthly",
      price: "9.99",
      interval: "month",
      description: "Perfect for getting started with full access to all premium features",
      features: [
        "All premium features",
        "Advanced challenges",
        "Personalized recommendations",
        "Priority support",
        "Exclusive content",
        "Advanced analytics",
      ],
      badge: null,
      buttonText: "Subscribe Monthly",
      buttonVariant: "outline" as const,
      priceId: selectedPlan?.stripe_price_id || null
    },
    {
      name: "Yearly",
      price: "69.99",
      interval: "year",
      description: "Best value for long-term commitment to self-improvement",
      features: [
        "All Monthly features",
        "Save 42% compared to monthly",
        "Advanced challenges",
        "Personalized recommendations",
        "Priority support",
        "Exclusive content",
        "Advanced analytics",
      ],
      badge: "Best Value",
      buttonText: "Get Yearly Access",
      buttonVariant: "default" as const,
      priceId: selectedPlan?.stripe_price_id || null
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <PricingHeader />
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {tiers.map((tier, index) => (
          <PricingCard
            key={tier.name}
            tier={tier}
            index={index}
            loading={loading}
            onSubscribe={handleSubscribe}
          />
        ))}
      </div>
    </div>
  );
}
