
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import { PricingHeader } from "./PricingHeader";
import { PricingCard } from "./PricingCard";

// Initialize Stripe with key from Supabase
const getStripePromise = async () => {
  const { data: publishableKey, error } = await supabase
    .rpc('get_stripe_publishable_key');
  
  if (error) {
    console.error('Error fetching Stripe key:', error);
    return null;
  }
  
  return loadStripe(publishableKey || '');
};

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

  const handleSubscribe = async (priceId: string | null) => {
    if (!session) {
      toast.error("Please sign in first");
      navigate('/auth');
      return;
    }

    if (!priceId) {
      toast.error("Invalid price ID");
      return;
    }

    try {
      setLoading(true);

      // First, create or get Stripe customer
      const { data: createCustomerData, error: createCustomerError } = await supabase.functions.invoke(
        'create-stripe-customer',
        {
          body: {
            email: session.user.email,
            userId: session.user.id,
          },
        }
      );

      if (createCustomerError) throw createCustomerError;

      // Create checkout session
      const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
        'create-checkout-session',
        {
          body: {
            priceId,
            customerId: createCustomerData.customerId,
          },
        }
      );

      if (sessionError) throw sessionError;

      // Initialize Stripe with key from Supabase
      const stripe = await getStripePromise();
      if (!stripe) throw new Error('Stripe failed to initialize');

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: sessionData.sessionId,
      });

      if (stripeError) throw stripeError;

    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error(error.message || "Failed to start subscription");
    } finally {
      setLoading(false);
    }
  };

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
      priceId: "price_1QqRMIRrh0VTJWZxqng2r1eS"
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
      buttonText: "Subscribe Yearly",
      buttonVariant: "default" as const,
      priceId: "price_1QseeyRrh0VTJWZx9wLlTiCI"
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
