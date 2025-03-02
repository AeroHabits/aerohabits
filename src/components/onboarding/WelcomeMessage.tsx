
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeMessageProps {
  primaryGoal: string;
  onContinue: () => void;
  isLoading: boolean;
}

export function WelcomeMessage({ primaryGoal, onContinue, isLoading }: WelcomeMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900 border-white/30 shadow-xl backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 z-0"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        
        <CardContent className="pt-6 pb-8 space-y-6 relative z-10">
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
          >
            <div className="p-4 bg-gradient-to-br from-white/30 to-white/10 rounded-full ring-1 ring-white/50 shadow-lg">
              <Award className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <div className="text-center space-y-4">
            <motion.h2 
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              Congratulations!
            </motion.h2>
            
            <motion.p 
              className="text-white text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              You've completed the first step toward achieving your goals.
            </motion.p>
            
            <motion.div 
              className="py-5 px-6 bg-gradient-to-r from-white/20 to-white/5 rounded-lg border border-white/30 shadow-inner my-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <p className="text-white text-sm leading-relaxed">
                <span className="font-semibold text-white">Premium:</span> Advanced tracking, personalized insights, and accountability tools.
              </p>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <Button
              onClick={onContinue}
              disabled={isLoading}
              className="w-full bg-white hover:bg-white/90 text-gray-900 font-medium py-6 transition-all shadow-md hover:shadow-lg group"
              size="lg"
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  Start Free Trial
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
            
            <p className="text-white text-xs text-center mt-4">
              3-day free trial. Cancel anytime.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
