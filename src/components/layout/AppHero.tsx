
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Sparkles, Rocket } from "lucide-react";
import { useState } from "react";
import { PricingTiers } from "../pricing/PricingTiers";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function AppHero() {
  const [showPricing, setShowPricing] = useState(false);
  const navigate = useNavigate();

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

      <div className="space-y-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            onClick={() => setShowPricing(!showPricing)}
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
            {showPricing ? (
              <>
                Hide Premium Features <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Unlock Premium Features <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
          className="flex justify-center"
        >
          <Button
            onClick={() => navigate('/coach')}
            className="bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 hover:from-purple-600 hover:via-blue-600 hover:to-purple-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <Rocket className="mr-2 h-6 w-6 animate-bounce" />
            Talk to Your AI Coach Now!
          </Button>
        </motion.div>

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
    </motion.div>
  );
}
