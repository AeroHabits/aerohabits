
import { motion } from "framer-motion";
import { OnboardingQuestionnaire } from "@/components/onboarding/OnboardingQuestionnaire";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function Onboarding() {
  useEffect(() => {
    // Show welcome toast when the component mounts
    toast.info("Welcome to AeroHabits!", {
      description: "Let's get started by setting up your profile.",
      duration: 5000,
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    >
      <OnboardingQuestionnaire />
    </motion.div>
  );
}
