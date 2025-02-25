
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

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
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
    "Access to advanced challenges",
    "Personalized insights and analytics",
    "Priority support",
    "Exclusive content and resources",
    "Ad-free experience",
    "Early access to new features"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-12 safe-top">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 text-gray-400 hover:text-white"
          >
            ← Back
          </Button>

          <div className="space-y-4">
            <Crown className="w-16 h-16 mx-auto text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">Upgrade to Premium</h1>
            <p className="text-xl text-gray-300">
              Unlock the full potential of your habit-building journey
            </p>
          </div>

          <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="space-y-6">
              <div className="flex justify-center items-baseline gap-2">
                <span className="text-5xl font-bold text-white">$9.99</span>
                <span className="text-xl text-gray-400">/month</span>
              </div>

              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-200">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 text-lg shadow-lg"
              >
                {isLoading ? "Loading..." : "Start Premium Trial"}
              </Button>

              <p className="text-sm text-gray-400">
                Start with a 3-day free trial. Cancel anytime.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
