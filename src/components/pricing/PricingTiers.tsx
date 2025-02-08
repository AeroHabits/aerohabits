import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { createCheckoutSession } from "@/lib/stripe";
import { loadStripe } from "@/lib/loadStripe";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const PREMIUM_PRICE_ID = 'price_XXXXX'; // Replace with your actual Stripe price ID

const tiers = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for getting started with habit building",
    features: [
      "Access to basic challenges",
      "Habit tracking",
      "Goal setting",
      "Progress tracking",
    ],
    badge: null,
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    priceId: null
  },
  {
    name: "Premium",
    price: "9.99",
    description: "Elevate your habit-building journey with advanced challenges, personalized insights, and expert guidance to accelerate your personal growth",
    features: [
      "All Free features",
      "Advanced challenges",
      "Personalized recommendations",
      "Priority support",
      "Exclusive content",
      "Advanced analytics",
    ],
    badge: "Most Popular",
    buttonText: "Upgrade Now",
    buttonVariant: "default" as const,
    priceId: PREMIUM_PRICE_ID
  },
];

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

  const handleSubscribe = async (tier: typeof tiers[0]) => {
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
      
      // Load Stripe.js
      const stripe = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || '');
      if (!stripe) throw new Error('Stripe failed to load');

      // Redirect to Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;

    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to start checkout process. Please try again.");
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
                  {tier.name === "Premium" ? (
                    <Zap className="h-5 w-5 text-blue-500" />
                  ) : null}
                  {tier.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">${tier.price}</span>
                  <span className="text-muted-foreground">/month</span>
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
                  onClick={() => handleSubscribe(tier)}
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
