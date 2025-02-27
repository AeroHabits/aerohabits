
import { motion } from "framer-motion";
import { Crown, Check, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Premium() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const {
        data,
        error
      } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId: 'price_1Qsw84LDj4yzbQfIQkQ8igHs',
          returnUrl: window.location.origin + '/settings',
          includeTrialPeriod: true
        }
      });
      if (error) throw error;
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process. Please try again.');
    } finally {
      setIsLoadingState(false);
    }
  };

  const features = [
    {
      title: "Advanced habit tracking",
      description: "Get detailed insights and analytics about your habits"
    },
    {
      title: "Personalized recommendations",
      description: "AI-powered suggestions to improve your habits"
    },
    {
      title: "Priority support",
      description: "Get help when you need it most"
    },
    {
      title: "Unlimited tracking",
      description: "Track as many habits as you want"
    },
    {
      title: "Detailed reports",
      description: "Weekly and monthly progress reports"
    },
    {
      title: "Custom reminders",
      description: "Set personalized notification schedules"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="text-gray-400 hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Crown className="w-12 h-12 mx-auto text-yellow-500 mb-6" />
            </motion.div>
            <h1 className="text-3xl font-semibold text-white">
              Start Your Premium Journey Today
            </h1>
            <p className="text-lg text-gray-300">
              3-Day Free Trial, Then $9.99/month
            </p>
          </div>

          <Card className="p-8 bg-gray-800/50 border-gray-700">
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex justify-center items-baseline gap-2">
                  <span className="font-bold text-white text-4xl">$9.99</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <p className="text-emerald-400 font-medium">First 3 days free</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>You won't be charged during the trial period.<br />Cancel anytime before the trial ends.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 bg-gray-700/20 p-3 rounded-lg"
                  >
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-white font-medium">{feature.title}</p>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold tracking-wide rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Crown className="w-5 h-5" />
                    </motion.div>
                    Processing...
                  </div>
                ) : (
                  "Start Free Trial"
                )}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-400">
                  By starting your trial, you agree to be charged $9.99/month after the trial ends unless you cancel.
                </p>
                <p className="text-sm text-gray-500">
                  You can cancel anytime during the trial period.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
