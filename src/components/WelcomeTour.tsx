
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smile, Target, Trophy, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const tourSteps = [
  {
    title: "Welcome to AEROHABITS! 🌟",
    description: "Your journey to better habits starts here. Let's get you set up for success!",
    icon: Smile,
  },
  {
    title: "Track Your Progress 📈",
    description: "Build lasting habits by tracking your daily activities. Watch your streaks grow as you stay consistent!",
    icon: Target,
  },
  {
    title: "Complete Challenges 🎯",
    description: "Push yourself with our challenge system. Each completed challenge brings you closer to your goals!",
    icon: Trophy,
  },
  {
    title: "Join Our Community ❤️",
    description: "You're not alone on this journey. Connect with others and share your achievements!",
    icon: Heart,
  },
];

export function WelcomeTour() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const checkUserTourStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('has_seen_tour')
        .eq('id', user.id)
        .single();

      if (profile && !profile.has_seen_tour) {
        setOpen(true);
      }
    };

    checkUserTourStatus();
  }, []);

  const handleNext = async () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ has_seen_tour: true })
          .eq('id', user.id);
      }
      setOpen(false);
    }
  };

  const CurrentIcon = tourSteps[currentStep].icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <div className="mx-auto mb-4">
              <CurrentIcon className="w-12 h-12 text-primary mx-auto" />
            </div>
            <DialogTitle className="text-2xl text-center">
              {tourSteps[currentStep].title}
            </DialogTitle>
            <DialogDescription className="text-center pt-2 text-lg">
              {tourSteps[currentStep].description}
            </DialogDescription>
          </DialogHeader>
        </motion.div>
        <DialogFooter className="flex flex-col gap-4 sm:flex-row justify-between items-center mt-8">
          <div className="flex gap-1">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep
                    ? "bg-primary"
                    : index < currentStep
                    ? "bg-primary/30"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <Button onClick={handleNext} className="min-w-[120px] gap-2">
            {currentStep === tourSteps.length - 1 ? "Get Started" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
