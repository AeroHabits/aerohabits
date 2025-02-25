
import { motion } from "framer-motion";
import { Crown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

export default function Premium() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartFreeTrial = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Update the user's profile with trial information
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'trialing',
          trial_end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Your free trial has started!");
      navigate('/settings');
    } catch (error) {
      console.error('Error starting free trial:', error);
      toast.error('Failed to start free trial. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const {
        data,
        error
      } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId: 'price_1Qsw84LDj4yzbQfIQkQ8igHs',
          returnUrl: window.location.origin + '/settings'
        }
      });
      if (error) throw error;
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    "Advanced habit tracking and analytics",
    "Personalized goal setting and recommendations",
    "Priority customer support",
    "Unlimited habit tracking",
    "Detailed progress reports",
    "Custom reminders and notifications"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="text-gray-400 hover:text-white"
          >
            ← Back
          </Button>

          <div className="text-center space-y-4">
            <Crown className="w-12 h-12 mx-auto text-yellow-500 mb-6" />
            <h1 className="text-3xl font-semibold text-white">
              Upgrade to Premium
            </h1>
            <p className="text-lg text-gray-300">
              Get full access to all features and maximize your productivity
            </p>
          </div>

          <Card className="p-8 bg-gray-800/50 border-gray-700">
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex justify-center items-baseline gap-2">
                  <span className="font-bold text-white text-3xl">$9.99</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Start with a 3-day free trial, no credit card required
                </p>
              </div>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <p className="text-gray-300">{feature}</p>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleStartFreeTrial}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold tracking-wide rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Start Free Trial"}
              </Button>

              <div className="text-center space-y-4">
                <p className="text-sm text-gray-400">
                  Already tried and love it? Subscribe now:
                </p>
                <Button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? "Processing..." : "Subscribe Now"}
                </Button>
              </div>

              <p className="text-sm text-gray-400 text-center">
                No credit card required for trial. Subscribe any time during or after your trial.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
