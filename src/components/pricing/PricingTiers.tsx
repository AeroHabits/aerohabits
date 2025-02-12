
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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

  const handleSubscribe = async () => {
    if (!session) {
      toast.error("Please sign in first");
      navigate('/auth');
      return;
    }

    toast.info("Premium features coming soon!");
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
      priceId: null
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
      priceId: null
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
