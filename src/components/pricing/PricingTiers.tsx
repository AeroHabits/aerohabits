
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { createCheckoutSession } from "@/lib/stripe";
import { loadStripe } from "@/lib/loadStripe";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function PricingTiers() {
  const [loading, setLoading] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
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
    return stripeProducts.find(product => product.interval === (isYearly ? 'year' : 'month'));
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
  const monthlyPrice = selectedPlan?.interval === 'month' ? selectedPlan.price : (selectedPlan?.price || 0) / 12;

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
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight">
          Choose Your Premium Plan
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          72-hour free trial, then unlock full access with our premium plans
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="relative h-full flex flex-col">
              {tier.badge && (
                <Badge
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500"
                  variant="secondary"
                >
                  <Star className="h-3 w-3 mr-1" />
                  {tier.badge}
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {tier.name === "Yearly" ? (
                    <Zap className="h-5 w-5 text-blue-500" />
                  ) : null}
                  {tier.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">${tier.price}</span>
                  <span className="text-muted-foreground">/{tier.interval}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {tier.description}
                </p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={tier.buttonVariant}
                  className="w-full"
                  onClick={() => handleSubscribe(tier.priceId)}
                  disabled={loading}
                >
                  {loading ? "Loading..." : tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

