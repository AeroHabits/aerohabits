
import { Star, Gem, Crown, Award, Target, Mountain, BarChart, Clock } from "lucide-react";

export const premiumFeatures = [
  {
    title: "Advanced Analytics",
    description: "Access detailed insights and performance metrics",
    icon: <Star className="h-5 w-5 text-yellow-400" />
  },
  {
    title: "Custom Dashboards",
    description: "Create personalized views of your habit data",
    icon: <BarChart className="h-5 w-5 text-blue-400" />
  },
  {
    title: "Extended History",
    description: "Access your complete habit history without limitations",
    icon: <Clock className="h-5 w-5 text-purple-400" />
  },
  {
    title: "Unlimited Tracking",
    description: "No restrictions on the number of habits you can monitor",
    icon: <Award className="h-5 w-5 text-emerald-400" />
  },
  {
    title: "Performance Reports",
    description: "Comprehensive weekly and monthly analysis",
    icon: <Gem className="h-5 w-5 text-indigo-400" />
  },
  {
    title: "Priority Support",
    description: "Priority email support for all your questions",
    icon: <Crown className="h-5 w-5 text-amber-400" />
  }
];
