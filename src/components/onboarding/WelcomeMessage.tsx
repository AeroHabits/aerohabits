
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";

interface WelcomeMessageProps {
  primaryGoal: string;
  onContinue: () => void;
  isLoading: boolean;
}

export function WelcomeMessage({ primaryGoal, onContinue, isLoading }: WelcomeMessageProps) {
  const getGoalSpecificMessage = () => {
    switch (primaryGoal.toLowerCase()) {
      case "career growth":
        return "We'll help you build habits that accelerate your professional development.";
      case "better health":
        return "We'll help you establish routines that improve your physical and mental wellbeing.";
      case "learning new skills":
        return "We'll help you create consistent practice routines to master new abilities.";
      case "building relationships":
        return "We'll help you develop habits that strengthen your connections with others.";
      case "financial stability":
        return "We'll help you build habits that improve your financial discipline and planning.";
      default:
        return "We'll help you build consistent, life-changing habits tailored to your needs.";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-[#1F2A47] to-[#1A1F2C] border border-[#403E43]/50 hover:border-[#9b87f5]/50 rounded-xl p-8 shadow-xl"
    >
      <div className="text-center space-y-4 mb-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
          className="w-16 h-16 bg-gradient-to-br from-[#7b6acd] to-[#9b87f5] rounded-full flex items-center justify-center mx-auto"
        >
          <Star className="w-8 h-8 text-white" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-white">Perfect! We're Ready to Begin</h2>
        
        <p className="text-gray-300">
          {getGoalSpecificMessage()}
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-[#2A2F3C]/70 rounded-lg p-4 border border-[#403E43]">
          <h3 className="font-medium text-white mb-2">Your 3-Day Free Trial</h3>
          <p className="text-gray-300 text-sm">
            Start with full access to all premium features. No commitment required - you can cancel anytime before your trial ends.
          </p>
        </div>
        
        <Button
          onClick={onContinue}
          disabled={isLoading}
          className="w-full py-6 bg-gradient-to-r from-[#7b6acd] to-[#9b87f5] hover:from-[#6b5abd] hover:to-[#8a76e4] text-white font-medium rounded-lg"
        >
          {isLoading ? (
            "Setting up your account..."
          ) : (
            <span className="flex items-center justify-center gap-2">
              Start Your Free Trial <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
