
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { PricingTiers } from "../pricing/PricingTiers";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function AppHero() {
  const [showPricing, setShowPricing] = useState(false);

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

      {!profile?.is_premium && (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => setShowPricing(!showPricing)}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            {showPricing ? (
              <>
                Hide Premium Features <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                View Premium Features <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>

          {showPricing && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PricingTiers />
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
