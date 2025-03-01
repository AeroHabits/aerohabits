
import { motion } from "framer-motion";
import { Crown, Check, ArrowLeft, Info, Sparkles, Star, Rocket, Award, Gem, Mountain, Target } from "lucide-react";
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
          includeTrialPeriod: false
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
      description: "Get detailed insights about your habits",
      icon: <Star className="h-5 w-5 text-yellow-400" />
    },
    {
      title: "Smart suggestions",
      description: "Personalized AI recommendations that evolve with your habits and goals",
      icon: <Sparkles className="h-5 w-5 text-blue-400" />
    },
    {
      title: "Fast support",
      description: "Get help when you need it",
      icon: <Rocket className="h-5 w-5 text-purple-400" />
    },
    {
      title: "Track unlimited habits",
      description: "No limits on what you can track",
      icon: <Award className="h-5 w-5 text-emerald-400" />
    },
    {
      title: "Progress reports",
      description: "Weekly and monthly summaries of your progress",
      icon: <Gem className="h-5 w-5 text-indigo-400" />
    },
    {
      title: "Custom reminders",
      description: "Set notifications that work for you",
      icon: <Crown className="h-5 w-5 text-amber-400" />
    }
  ];

  const premiumChallenges = [
    {
      title: "Master Challenges",
      description: "Access exclusive premium difficulty challenges designed to push your limits",
      icon: <Mountain className="h-5 w-5 text-red-500" />
    },
    {
      title: "Custom Challenge Creation",
      description: "Create personalized challenges tailored to your specific goals and needs",
      icon: <Target className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Challenge Analytics",
      description: "Get detailed performance metrics and insights for all your challenges",
      icon: <Award className="h-5 w-5 text-amber-500" />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black overflow-hidden">
      {/* Static gradient background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="text-gray-300 hover:text-white flex items-center gap-2 transition-all hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible" 
            className="text-center space-y-6"
          >
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <motion.div
                className="absolute -inset-1 rounded-full blur-md bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 opacity-75"
                animate={{ 
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{ 
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              <motion.div
                className="relative bg-black rounded-full p-4 inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Crown className="w-16 h-16 text-yellow-500" />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500"
            >
              Unlock Your Full Potential
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-200 max-w-lg mx-auto"
            >
              Join our premium subscription and elevate your habit-building journey for just <span className="font-bold text-yellow-300">$9.99/month</span>
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Card className="p-8 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-md border border-purple-700/30 shadow-xl rounded-xl overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10"
                animate={{ 
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{ 
                  duration: 15, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                style={{ backgroundSize: "200% 200%" }}
              />
              
              <div className="relative z-10 space-y-6">
                <div className="text-center space-y-2">
                  <div className="flex justify-center items-baseline gap-2">
                    <motion.span 
                      className="font-bold text-white text-5xl"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 10, 
                        delay: 0.4 
                      }}
                    >
                      $9.99
                    </motion.span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-1 text-yellow-400 my-1"
                  >
                    <Star className="h-4 w-4 fill-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400" />
                  </motion.div>
                </div>

                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  <motion.h3
                    variants={itemVariants}
                    className="text-xl font-bold text-white text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300"
                  >
                    Premium Features
                  </motion.h3>
                  
                  {features.map((feature, index) => (
                    <motion.div 
                      key={index}
                      variants={itemVariants}
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                      className="flex items-start gap-3 bg-gradient-to-r from-white/5 to-transparent p-4 rounded-lg border border-white/5 transition-all"
                    >
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-lg shadow-inner">
                        {feature.icon}
                      </div>
                      <div>
                        <p className="text-white font-medium">{feature.title}</p>
                        <p className="text-gray-400 text-sm">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4 mt-8"
                >
                  <motion.h3
                    variants={itemVariants}
                    className="text-xl font-bold text-white text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-red-300"
                  >
                    Exclusive Premium Challenges
                  </motion.h3>
                  
                  {premiumChallenges.map((challenge, index) => (
                    <motion.div 
                      key={index}
                      variants={itemVariants}
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                      className="flex items-start gap-3 bg-gradient-to-r from-orange-900/10 to-transparent p-4 rounded-lg border border-orange-700/20 transition-all"
                    >
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-lg shadow-inner">
                        {challenge.icon}
                      </div>
                      <div>
                        <p className="text-white font-medium">{challenge.title}</p>
                        <p className="text-gray-400 text-sm">{challenge.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Button
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-7 text-lg font-semibold tracking-wide rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    <span className="absolute w-40 h-40 -top-10 -left-10 bg-white/20 rounded-full transform scale-0 group-hover:scale-100 transition-all duration-500"></span>
                    <span className="absolute w-40 h-40 -bottom-10 -right-10 bg-white/20 rounded-full transform scale-0 group-hover:scale-100 transition-all duration-500 delay-100"></span>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Crown className="w-5 h-5" />
                          </motion.div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Subscribe Now
                        </>
                      )}
                    </span>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="space-y-3 border-t border-gray-800 pt-4"
                >
                  <p className="text-sm text-gray-400 text-center">
                    You'll be charged $9.99 monthly. Cancel anytime.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <p>Secure payment processing by Stripe</p>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
