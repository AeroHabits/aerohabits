
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
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

  const handleSubscribe = async (tier: typeof tiers[number]) => {
    if (!session) {
      toast.error("Please sign in first");
      navigate('/auth');
      return;
    }

    toast.info("Subscriptions are currently being updated. Please check back soon!");
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
        <Badge 
          variant="secondary" 
          className="mt-4 bg-blue-500/10 text-blue-500 border-blue-500/20"
        >
          Coming Soon
        </Badge>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {tiers.map((tier, index) => (
          <PricingCard
            key={tier.name}
            tier={tier}
            index={index}
            loading={loading}
            onSubscribe={handleSubscribe}
            isCurrentPlan={false}
          />
        ))}
      </div>
    </div>
  );
}
