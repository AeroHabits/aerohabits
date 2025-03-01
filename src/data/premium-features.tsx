
import { Star, Sparkles, Rocket, Award, Gem, Crown, Mountain, Target } from "lucide-react";

export const premiumFeatures = [
  {
    title: "Advanced tracking",
    description: "Get detailed insights about your habits",
    icon: <Star className="h-5 w-5 text-yellow-400" />
  },
  {
    title: "Smart suggestions",
    description: "Personalized AI recommendations that evolve with your habits and goals",
    icon: <Sparkles className="h-5 w-5 text-blue-400" />
  },
  {
    title: "Fast support",
    description: "Get help when you need it",
    icon: <Rocket className="h-5 w-5 text-purple-400" />
  },
  {
    title: "Track unlimited habits",
    description: "No limits on what you can track",
    icon: <Award className="h-5 w-5 text-emerald-400" />
  },
  {
    title: "Progress reports",
    description: "Weekly and monthly summaries of your progress",
    icon: <Gem className="h-5 w-5 text-indigo-400" />
  },
  {
    title: "Custom reminders",
    description: "Set notifications that work for you",
    icon: <Crown className="h-5 w-5 text-amber-400" />
  }
];

export const premiumChallenges = [
  {
    title: "Master Challenges",
    description: "Access exclusive premium difficulty challenges designed to push your limits",
    icon: <Mountain className="h-5 w-5 text-red-500" />
  },
  {
    title: "Custom Challenge Creation",
    description: "Create personalized challenges tailored to your specific goals and needs",
    icon: <Target className="h-5 w-5 text-blue-500" />
  },
  {
    title: "Challenge Analytics",
    description: "Get detailed performance metrics and insights for all your challenges",
    icon: <Award className="h-5 w-5 text-amber-500" />
  }
];
