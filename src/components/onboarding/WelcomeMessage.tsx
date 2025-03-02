
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Target, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeMessageProps {
  primaryGoal: string;
  onContinue: () => void;
  isLoading: boolean;
}

export function WelcomeMessage({ primaryGoal, onContinue, isLoading }: WelcomeMessageProps) {
  // Determine a personalized message based on the primary goal
  const getPersonalizedMessage = () => {
    switch (primaryGoal) {
      case "Career growth":
        return "professional aspirations";
      case "Better health":
        return "health journey";
      case "Learning new skills":
        return "learning path";
      case "Building relationships":
        return "relationship goals";
      case "Financial stability":
        return "financial targets";
      default:
        return "personal goals";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-gray-700 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-purple-500/10 bg-opacity-10 z-0"></div>
        <CardContent className="pt-6 pb-8 space-y-6 relative z-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-600/30 rounded-full">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">Congratulations!</h2>
            <p className="text-gray-300 text-lg">
              You've completed the first step toward achieving your {getPersonalizedMessage()}.
            </p>
            
            <div className="py-4 px-5 bg-gray-800/50 rounded-lg border border-gray-700 my-6">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <p className="text-gray-200 text-sm">
                  With AeroHabits Premium, you'll get personalized recommendations, 
                  advanced tracking tools, and accountability features to help you stay on track.
                </p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm">
              Start your free trial today and unlock the full potential of your habit journey.
            </p>
          </div>
          
          <Button
            onClick={onContinue}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4 transition-all group"
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
