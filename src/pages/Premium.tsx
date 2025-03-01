
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
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      title: "Advanced tracking",
      description: "Get detailed insights about your habits"
    },
    {
      title: "Smart suggestions",
      description: "AI-powered recommendations to improve your habits"
    },
    {
      title: "Fast support",
      description: "Get help when you need it"
    },
    {
      title: "Track unlimited habits",
      description: "No limits on what you can track"
    },
    {
      title: "Progress reports",
      description: "Weekly and monthly summaries of your progress"
    },
    {
      title: "Custom reminders",
      description: "Set notifications that work for you"
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
              Try Premium for Free
            </h1>
            <p className="text-lg text-gray-300">
              3-Day Free Trial, Then $9.99/month
            </p>
            <p className="text-sm text-yellow-400">
              Cancel anytime during trial - no charge
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
                      <TooltipContent className="p-4 max-w-[300px]">
                        <p className="font-medium">About Your Free Trial:</p>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• Payment info required to start trial</li>
                          <li>• No charge for 3 days</li>
                          <li>• Cancel anytime during trial - no charge</li>
                        </ul>
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

              <div className="space-y-3 border-t border-gray-700/50 pt-4">
                <p className="text-sm text-gray-400 text-center">
                  Payment details required. You won't be charged until your 3-day trial ends.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Info className="w-4 h-4" />
                  <p>Cancel anytime during trial - zero cost</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
