
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Timer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { differenceInHours } from "date-fns";

export function PricingHeader() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return data;
    },
  });

  const { data: signUpDate } = useQuery({
    queryKey: ['signUpDate'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      return new Date(user.created_at);
    },
  });

  const hoursLeft = signUpDate ? 72 - differenceInHours(new Date(), signUpDate) : null;
  const showTrialMessage = !profile?.is_premium && hoursLeft && hoursLeft > 0;

  return (
    <motion.div 
      className="text-center mb-12 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 text-transparent bg-clip-text">
        Choose Your Premium Plan
      </h2>

      {showTrialMessage ? (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-500/30">
            <Timer className="h-5 w-5 text-purple-400 animate-pulse" />
            <p className="text-xl md:text-2xl text-white">
              <span className="font-bold text-purple-400">{Math.max(0, Math.floor(hoursLeft))} hours</span> left in your trial
            </p>
            <Timer className="h-5 w-5 text-purple-400 animate-pulse" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
            <p className="text-lg text-muted-foreground">
              Enjoy full access to all premium features during your trial
            </p>
            <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
          </div>
        </motion.div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
          <p className="text-xl md:text-2xl text-muted-foreground">
            Unlock premium features to supercharge your habit-building journey
          </p>
          <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
        </div>
      )}
    </motion.div>
  );
}
