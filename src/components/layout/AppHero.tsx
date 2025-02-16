
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Crown, Sparkles, Star, Trophy, Target } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AppHero() {
  const [showFeatures, setShowFeatures] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleSubscribe = async (interval: 'month' | 'year') => {
    try {
      setIsLoading(true);

      // Create or get Stripe customer
      if (!profile?.stripe_customer_id) {
        const response = await fetch('/api/stripe/create-customer', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to create customer');
      }

      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interval }),
      });

      const { url, error } = await response.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const premiumFeatures = [
    {
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      title: "Advanced Challenges",
      description: "Access premium difficulty levels and exclusive challenges"
    },
    {
      icon: <Trophy className="h-6 w-6 text-amber-500" />,
      title: "Detailed Analytics",
      description: "Get in-depth insights about your habits and progress"
    },
    {
      icon: <Target className="h-6 w-6 text-blue-500" />,
      title: "Personalized Goals",
      description: "Set and track advanced personal goals"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-center space-y-4"
    >
      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
          delay: 0.2
        }}
        className="text-3xl md:text-4xl font-bold text-white/95 tracking-wide"
      >
        <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent animate-gradient-x">
          Journey To Self-Mastery
        </span>
      </motion.h2>
      <div className="h-1 w-32 mx-auto bg-gradient-to-r from-white/0 via-white/80 to-white/0 animate-pulse" />
      <p className="text-lg text-white/80 max-w-2xl mx-auto">
        Track your habits, build streaks, and achieve your goals.
      </p>

      <div className="space-y-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            onClick={() => setShowFeatures(!showFeatures)}
            className="relative group bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-white border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                background: ["linear-gradient(to right, rgba(168,85,247,0.1), rgba(59,130,246,0.1))", 
                           "linear-gradient(to right, rgba(59,130,246,0.1), rgba(168,85,247,0.1))"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <Sparkles className="mr-2 h-4 w-4 text-yellow-300 animate-pulse" />
            {showFeatures ? (
              <>
                Hide Subscriptions <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Subscriptions <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>

        {showFeatures && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-white/10">
                        {feature.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-white">{feature.title}</h3>
                        <p className="text-sm text-white/70">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 backdrop-blur-sm border-purple-400/30 h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <Crown className="h-8 w-8 text-yellow-400" />
                      <div>
                        <h3 className="text-xl font-bold text-white">Monthly Premium</h3>
                        <p className="text-2xl font-bold text-white">$9.99<span className="text-sm text-white/70">/month</span></p>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-6 text-white/80">
                      <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>All Premium Features</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-400" />
                        <span>Advanced Analytics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-yellow-400" />
                        <span>Cancel Anytime</span>
                      </li>
                    </ul>
                    <Button
                      onClick={() => handleSubscribe('month')}
                      disabled={isLoading || profile?.is_subscribed}
                      className="mt-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold"
                    >
                      {profile?.is_subscribed ? "Currently Subscribed" : "Subscribe Monthly"}
                    </Button>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 backdrop-blur-sm border-purple-400/30 h-full relative overflow-hidden">
                  <div className="absolute top-3 right-3">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                      Save 42%
                    </span>
                  </div>
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <Crown className="h-8 w-8 text-yellow-400" />
                      <div>
                        <h3 className="text-xl font-bold text-white">Yearly Premium</h3>
                        <p className="text-2xl font-bold text-white">$69.99<span className="text-sm text-white/70">/year</span></p>
                        <p className="text-sm text-white/70">$5.83/month, billed annually</p>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-6 text-white/80">
                      <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>All Premium Features</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-400" />
                        <span>Advanced Analytics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-yellow-400" />
                        <span>2 Months Free</span>
                      </li>
                    </ul>
                    <Button
                      onClick={() => handleSubscribe('year')}
                      disabled={isLoading || profile?.is_subscribed}
                      className="mt-auto bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold"
                    >
                      {profile?.is_subscribed ? "Currently Subscribed" : "Subscribe Yearly"}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
