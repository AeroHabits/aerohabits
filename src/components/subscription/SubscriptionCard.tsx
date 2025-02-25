
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, Star, Trophy, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface SubscriptionCardProps {
  type: 'month' | 'year';
  isLoading?: boolean;
}

export function SubscriptionCard({ type, isLoading: parentLoading }: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isYearly = type === 'year';
  const price = isYearly ? "$69.99" : "$9.99";
  const interval = isYearly ? "year" : "month";
  const priceId = isYearly 
    ? 'price_yearly_placeholder'  // Replace with your Stripe yearly price ID
    : 'price_monthly_placeholder'; // Replace with your Stripe monthly price ID

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Create a Stripe checkout session through our Edge Function
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId, returnUrl: window.location.origin + '/settings' }
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: isYearly ? 0.4 : 0.3 }}
    >
      <Card className="p-6 bg-black/40 backdrop-blur-lg border-white/10 hover:bg-black/50 transition-all h-full relative overflow-hidden">
        {isYearly && (
          <div className="absolute top-3 right-3">
            <span className="bg-white/10 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-full border border-white/20">
              Save 42%
            </span>
          </div>
        )}
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="h-8 w-8 text-yellow-400/80" />
            <div>
              <h3 className="text-xl font-bold text-white">{isYearly ? "Yearly" : "Monthly"} Premium</h3>
              <p className="text-2xl font-bold text-white">{price}<span className="text-sm text-white/70">/{interval}</span></p>
              {isYearly && <p className="text-sm text-white/70">$5.83/month, billed annually</p>}
            </div>
          </div>
          <ul className="space-y-2 mb-6 text-white/80">
            <li className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400/80" />
              <span>All Premium Features</span>
            </li>
            <li className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-400/80" />
              <span>Advanced Analytics</span>
            </li>
            <li className="flex items-center gap-2">
              <Target className="h-4 w-4 text-yellow-400/80" />
              <span>{isYearly ? "2 Months Free" : "Cancel Anytime"}</span>
            </li>
          </ul>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleSubscribe}
              disabled={isLoading || parentLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold"
            >
              {isLoading ? "Loading..." : "Subscribe Now"}
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
