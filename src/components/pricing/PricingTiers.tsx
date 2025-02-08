
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
import { format } from "date-fns";

const PREMIUM_PRICE_ID = 'price_1Qq8Q3Rrh0VTJWZxKHTXCKdT';

const tiers = [
  {
    name: "Free Trial",
    price: "0",
    description: "Try all premium features free for 7 days",
    features: [
      "Access to all challenges",
      "Habit tracking",
      "Goal setting",
      "Progress tracking",
      "7-day free trial"
    ],
    badge: null,
    buttonText: "Start Free Trial",
    buttonVariant: "outline" as const,
    priceId: null
  },
  {
    name: "Premium",
    price: "9.99",
    description: "Elevate your habit-building journey with advanced challenges, personalized insights, and expert guidance to accelerate your personal growth",
    features: [
      "All Free Trial features",
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

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      if (!session?.user) return null;
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user,
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
                  disabled={loading || (subscription?.status === 'active' && subscription?.plan_type === 'premium')}
                >
                  {loading ? "Loading..." : 
                    subscription?.status === 'active' && subscription?.plan_type === 'premium' 
                      ? "Current Plan" 
                      : tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
