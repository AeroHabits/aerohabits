
import { motion } from "framer-motion";
import { Star, Target, Flame, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AppShowcase() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Star className="h-7 w-7 text-amber-400" />,
      title: "Track Daily Habits",
      description: "Build lasting habits with daily tracking and reminders",
      route: "/habits",
      gradient: "from-amber-500/20 via-amber-400/10 to-amber-300/5"
    },
    {
      icon: <Flame className="h-7 w-7 text-orange-400" />,
      title: "Join Challenges",
      description: "Participate in community challenges",
      route: "/challenges",
      gradient: "from-orange-500/20 via-orange-400/10 to-orange-300/5"
    },
    {
      icon: <Target className="h-7 w-7 text-blue-400" />,
      title: "Set Goals",
      description: "Define and achieve your personal goals",
      route: "/goals",
      gradient: "from-blue-500/20 via-blue-400/10 to-blue-300/5"
    },
    {
      icon: <Award className="h-7 w-7 text-purple-400" />,
      title: "Track Progress",
      description: "Visualize your journey with detailed statistics",
      route: "/journey",
      gradient: "from-purple-500/20 via-purple-400/10 to-purple-300/5"
    }
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.4,
              type: "spring",
              stiffness: 100
            }}
            onClick={() => handleCardClick(feature.route)}
            className="group cursor-pointer"
          >
            <div className="relative h-full rounded-2xl overflow-hidden backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 hover:border-white/40 hover:shadow-lg hover:shadow-blue-500/20">
              {/* Gradient Background - Increased opacity for better visibility */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative p-6 h-full">
                <motion.div 
                  className="flex flex-col items-start gap-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Icon container - Improved contrast */}
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-inner group-hover:border-white/30 transition-all duration-300">
                    {feature.icon}
                  </div>
                  
                  <div className="space-y-2">
                    {/* Title - Increased font size and added text shadow for better visibility */}
                    <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-md">
                      {feature.title}
                    </h3>
                    {/* Description - Increased opacity and contrast */}
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
                
                {/* Hover Effect - Enhanced for better visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
