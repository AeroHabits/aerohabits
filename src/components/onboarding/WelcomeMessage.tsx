
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight, Star, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeMessageProps {
  primaryGoal: string;
  onContinue: () => void;
  isLoading: boolean;
}

export function WelcomeMessage({ primaryGoal, onContinue, isLoading }: WelcomeMessageProps) {
  // Use a more general message without specifying the exact goal
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900 border-gray-700/50 shadow-xl backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/5 to-purple-900/10 z-0"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>
        
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
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-full ring-1 ring-purple-500/30 shadow-lg">
              <Award className="w-10 h-10 text-purple-400" />
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
              className="text-gray-300 text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              You've completed the first step toward achieving your goals.
            </motion.p>
            
            <motion.div 
              className="py-5 px-6 bg-gradient-to-r from-gray-800/80 to-gray-800/40 rounded-lg border border-gray-700/50 shadow-inner my-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-200 text-sm leading-relaxed">
                  With AeroHabits Premium, you'll get personalized recommendations, 
                  advanced tracking tools, and accountability features to help you stay on track.
                </p>
              </div>
            </motion.div>
            
            <motion.p 
              className="text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            >
              Start your free trial today and unlock the full potential of your journey.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.3 }}
          >
            <Button
              onClick={onContinue}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-6 transition-all shadow-md hover:shadow-lg group"
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
            
            <p className="text-gray-400 text-xs text-center mt-4">
              Your 3-day free trial starts now. Cancel anytime.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
