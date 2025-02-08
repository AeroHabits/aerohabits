
import { motion } from "framer-motion";
import { Award, Flame, Star, Target, Trophy, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export function AppShowcase() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      title: "Track Daily Habits",
      description: "Build lasting habits with daily tracking and reminders",
      route: "/journey"
    },
    {
      icon: <Trophy className="h-6 w-6 text-amber-500" />,
      title: "Earn Achievements",
      description: "Unlock badges and rewards as you progress",
      route: "/badges"
    },
    {
      icon: <Flame className="h-6 w-6 text-orange-500" />,
      title: "Join Challenges",
      description: "Participate in community challenges",
      route: "/challenges"
    },
    {
      icon: <Target className="h-6 w-6 text-blue-500" />,
      title: "Set Goals",
      description: "Define and achieve your personal goals",
      route: "/goals"
    },
    {
      icon: <Award className="h-6 w-6 text-purple-500" />,
      title: "Track Progress",
      description: "Visualize your journey with detailed statistics",
      route: "/journey"
    },
    {
      icon: <CreditCard className="h-6 w-6 text-green-500" />,
      title: "Premium Features",
      description: "Unlock advanced features with our premium plans",
      route: "/pricing"
    }
  ];

  return (
    <div className="py-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(feature.route)}
          >
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-white/90 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/70 group-hover:text-white/80 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
