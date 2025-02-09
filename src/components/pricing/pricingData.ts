
import { supabase } from "@/integrations/supabase/client";

export type PricingTier = {
  name: string;
  price: string;
  perMonth?: string;
  description: string;
  features: readonly string[];
  badge: string | null;
  buttonText: string;
  buttonVariant: 'outline' | 'default';
  priceId: string | null;
}

export async function getPricingTiers(): Promise<PricingTier[]> {
  // Fetch stripe products from the database
  const { data: stripeProducts } = await supabase
    .from('stripe_products')
    .select('*')
    .order('price', { ascending: true });

  const monthlyProduct = stripeProducts?.find(p => p.interval === 'month');
  const yearlyProduct = stripeProducts?.find(p => p.interval === 'year');

  return [
    {
      name: "Free Trial",
      price: "0",
      description: "Try all premium features free for 3 days",
      features: [
        "Access to all challenges",
        "Habit tracking",
        "Goal setting",
        "Progress tracking",
        "3-day free trial"
      ],
      badge: null,
      buttonText: "Start Free Trial",
      buttonVariant: "outline" as const,
      priceId: null
    },
    {
      name: "Premium Monthly",
      price: monthlyProduct?.price.toString() || "9.99",
      perMonth: monthlyProduct?.price.toString() || "9.99",
      description: "Elevate your habit-building journey with advanced challenges, personalized insights, and expert guidance",
      features: [
        "All Free Trial features",
        "Advanced challenges",
        "Personalized recommendations",
        "Priority support",
        "Exclusive content",
        "Advanced analytics",
      ],
      badge: null,
      buttonText: "Subscribe Monthly",
      buttonVariant: "default" as const,
      priceId: monthlyProduct?.stripe_price_id || null
    },
    {
      name: "Premium Yearly",
      price: yearlyProduct?.price.toString() || "69.99",
      perMonth: (yearlyProduct ? (yearlyProduct.price / 12).toFixed(2) : "5.83"),
      description: "Get our best value plan with 40% savings when paid annually",
      features: [
        "All Premium Monthly features",
        "Save 40% vs monthly plan",
        "Advanced challenges",
        "Personalized recommendations",
        "Priority support",
        "Exclusive content",
        "Advanced analytics",
      ],
      badge: "Best Value",
      buttonText: "Subscribe Yearly",
      buttonVariant: "default" as const,
      priceId: yearlyProduct?.stripe_price_id || null
    }
  ];
}
