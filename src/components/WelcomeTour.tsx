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
import { Info, ArrowRight } from "lucide-react";

const tourSteps = [
  {
    title: "Welcome to AREOHABITS! 👋",
    description: "Let's take a quick tour to help you get started with building better habits.",
  },
  {
    title: "Track Your Habits ✅",
    description: "Add daily habits and mark them complete to build streaks. The longer your streak, the stronger your habit becomes!",
  },
  {
    title: "Set Reminders ⏰",
    description: "Enable notifications for your habits to never miss a day. We'll send you gentle reminders to keep you on track.",
  },
  {
    title: "Monitor Progress 📈",
    description: "View your journey and track your progress over time. Watch as your small daily actions add up to big changes!",
  },
];

export function WelcomeTour() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour) {
      setOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setOpen(false);
      localStorage.setItem("hasSeenTour", "true");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md animate-fade-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            {tourSteps[currentStep].title}
          </DialogTitle>
          <DialogDescription className="pt-2">
            {tourSteps[currentStep].description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {tourSteps.length}
          </div>
          <Button onClick={handleNext} className="gap-2">
            {currentStep === tourSteps.length - 1 ? "Get Started" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}