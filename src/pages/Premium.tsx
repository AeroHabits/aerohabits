
import { motion } from "framer-motion";
import { Crown, Check, Sparkles, Trophy, Star, Rocket, Gift } from "lucide-react";
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
    {
      icon: <Trophy className="w-6 h-6 text-amber-400" />,
      title: "Advanced Challenges",
      description: "Access premium difficulty levels and exclusive challenges"
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-400" />,
      title: "Personalized Analytics",
      description: "Get deep insights into your habit-forming journey"
    },
    {
      icon: <Rocket className="w-6 h-6 text-blue-400" />,
      title: "Priority Support",
      description: "Get help when you need it most"
    },
    {
      icon: <Gift className="w-6 h-6 text-purple-400" />,
      title: "Exclusive Content",
      description: "Access special resources and premium features"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
      title: "Advanced Analytics",
      description: "Track your progress with detailed metrics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="container mx-auto px-4 py-12 safe-top">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 text-gray-400 hover:text-white"
          >
            ← Back
          </Button>

          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.6,
              ease: "easeOut"
            }}
            className="space-y-6"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Crown className="w-20 h-20 mx-auto text-yellow-400" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 to-transparent blur-3xl -z-10" />
            </div>
            
            <h1 className="text-5xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Unlock Your Full Potential
            </h1>
            <p className="text-xl text-blue-100">
              Transform your habits with our premium features
            </p>
          </motion.div>

          <Card className="p-8 bg-white/10 backdrop-blur-lg border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-gradient-x" />
            <div className="relative z-10 space-y-8">
              <div className="flex justify-center items-baseline gap-2 mb-8">
                <span className="text-6xl font-bold text-white">$9.99</span>
                <span className="text-xl text-blue-200">/month</span>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="p-3 rounded-full bg-gray-900/50">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-gray-300">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold py-6 text-lg shadow-lg"
                >
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <>
                      Start Your Free Trial
                      <Sparkles className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </motion.div>

              <p className="text-sm text-gray-300 mt-4">
                Start with a 3-day free trial. Cancel anytime before the trial ends.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
