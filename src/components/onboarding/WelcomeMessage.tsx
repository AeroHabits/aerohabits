
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Loader2, Sparkles } from "lucide-react";

export function WelcomeMessage({ 
  primaryGoal, 
  onContinue, 
  isLoading 
}: { 
  primaryGoal: string; 
  onContinue: () => void; 
  isLoading: boolean; 
}) {
  // Get goal-specific heading
  const getHeading = () => {
    switch (primaryGoal) {
      case 'weight-loss':
        return "Ready to start your weight loss journey";
      case 'muscle-gain':
        return "Ready to build muscle and strength";
      case 'mindfulness':
        return "Your mindfulness journey starts now";
      case 'productivity':
        return "Boost your productivity starting today";
      case 'career growth':
        return "Accelerate your career growth";
      case 'better health':
        return "Your path to better health begins here";
      case 'learning new skills':
        return "Start mastering new skills today";
      case 'building relationships':
        return "Build meaningful relationships";
      case 'financial stability':
        return "Your journey to financial stability";
      default:
        return "Your personal journey begins now";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-xl border border-gray-700 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 opacity-20">
        <Sparkles className="w-64 h-64 text-cyan-300" />
      </div>
      
      <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
        {getHeading()}
      </h2>
      
      <div className="space-y-6 relative z-10">
        <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
          <h3 className="flex items-center text-lg font-semibold text-white mb-2">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Profile Created
          </h3>
          <p className="text-gray-300">
            Your personalized plan is ready based on your goals and preferences.
          </p>
        </div>
        
        <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
          <h3 className="flex items-center text-lg font-semibold text-white mb-2">
            <Clock className="w-5 h-5 mr-2 text-yellow-500" />
            Next Step: Set Up Your Account
          </h3>
          <p className="text-gray-300">
            To begin your 3-day free trial, you'll need to provide your payment information. You won't be charged until your trial ends.
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          disabled={isLoading}
          className="w-full py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold flex items-center justify-center relative overflow-hidden"
        >
          {isLoading ? (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="mr-2"
            >
              <Loader2 className="w-5 h-5 text-white" />
            </motion.div>
          ) : (
            <ArrowRight className="w-5 h-5 mr-2" />
          )}
          {isLoading ? "Processing..." : "Continue to Set Up Payment"}
        </motion.button>
      </div>
    </motion.div>
  );
}
