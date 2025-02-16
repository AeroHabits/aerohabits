
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, Star, Trophy, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionCardProps {
  type: 'month' | 'year';
  isLoading: boolean;
  isSubscribed: boolean;
  onSubscribe: (interval: 'month' | 'year') => Promise<void>;
}

export function SubscriptionCard({ type, isLoading, isSubscribed, onSubscribe }: SubscriptionCardProps) {
  const isYearly = type === 'year';
  const price = isYearly ? "$69.99" : "$9.99";
  const interval = isYearly ? "year" : "month";
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to subscribe.",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      await onSubscribe(type);
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: isYearly ? 0.4 : 0.3 }}
    >
      <Card className="p-6 bg-black/40 backdrop-blur-lg border-white/10 hover:bg-black/50 transition-all h-full relative overflow-hidden">
        {isYearly && (
          <div className="absolute top-3 right-3">
            <span className="bg-white/10 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-full border border-white/20">
              Save 42%
            </span>
          </div>
        )}
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="h-8 w-8 text-yellow-400/80" />
            <div>
              <h3 className="text-xl font-bold text-white">{isYearly ? "Yearly" : "Monthly"} Premium</h3>
              <p className="text-2xl font-bold text-white">{price}<span className="text-sm text-white/70">/{interval}</span></p>
              {isYearly && <p className="text-sm text-white/70">$5.83/month, billed annually</p>}
            </div>
          </div>
          <ul className="space-y-2 mb-6 text-white/80">
            <li className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400/80" />
              <span>All Premium Features</span>
            </li>
            <li className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-400/80" />
              <span>Advanced Analytics</span>
            </li>
            <li className="flex items-center gap-2">
              <Target className="h-4 w-4 text-yellow-400/80" />
              <span>{isYearly ? "2 Months Free" : "Cancel Anytime"}</span>
            </li>
          </ul>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleSubscribe}
              disabled={isLoading || isSubscribed}
              className={`
                w-full relative group overflow-hidden
                ${isSubscribed 
                  ? "bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20" 
                  : `bg-gradient-to-r from-purple-500 to-blue-500 
                     hover:from-purple-600 hover:to-blue-600 
                     text-white font-semibold 
                     transform transition-all duration-200
                     shadow-lg hover:shadow-xl
                     border border-purple-400/50`
                }
              `}
            >
              {!isSubscribed && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  animate={{
                    background: [
                      "linear-gradient(to right, rgba(168,85,247,0.2), rgba(59,130,246,0.2))",
                      "linear-gradient(to right, rgba(59,130,246,0.2), rgba(168,85,247,0.2))",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              )}
              {isSubscribed ? "Currently Subscribed" : `Subscribe ${isYearly ? "Yearly" : "Monthly"}`}
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
