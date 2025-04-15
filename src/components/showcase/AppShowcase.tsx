
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
      gradient: "from-amber-500/30 via-amber-400/20 to-amber-300/10"
    },
    {
      icon: <Flame className="h-7 w-7 text-orange-400" />,
      title: "Join Challenges",
      description: "Participate in community challenges",
      route: "/challenges",
      gradient: "from-orange-500/30 via-orange-400/20 to-orange-300/10"
    },
    {
      icon: <Target className="h-7 w-7 text-blue-400" />,
      title: "Set Goals",
      description: "Define and achieve your personal goals",
      route: "/goals",
      gradient: "from-blue-500/30 via-blue-400/20 to-blue-300/10"
    },
    {
      icon: <Award className="h-7 w-7 text-purple-400" />,
      title: "Track Progress",
      description: "Visualize your journey with detailed statistics",
      route: "/journey",
      gradient: "from-purple-500/30 via-purple-400/20 to-purple-300/10"
    }
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12"
    >
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.15,
              duration: 0.5,
              type: "spring",
              stiffness: 100
            }}
            onClick={() => handleCardClick(feature.route)}
            className="group cursor-pointer"
          >
            <div className="relative h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-black/20 border border-white/30 shadow-xl transition-all duration-300 hover:border-white/50 hover:shadow-2xl hover:shadow-blue-500/30 hover:translate-y-[-4px]">
              {/* Enhanced Gradient Background with better opacity */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-100 group-hover:opacity-100 transition-all duration-300`} />
              
              {/* Light Effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.2),_transparent_50%)] opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative p-8 h-full">
                <motion.div 
                  className="flex flex-col items-start gap-5"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {/* Improved Icon container with better contrast */}
                  <div className="p-4 rounded-xl bg-white/15 backdrop-blur-md border border-white/30 shadow-lg group-hover:border-white/40 group-hover:bg-white/20 transition-all duration-300">
                    {feature.icon}
                  </div>
                  
                  <div className="space-y-3">
                    {/* Enhanced title with stronger text shadow */}
                    <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]">
                      {feature.title}
                    </h3>
                    {/* Enhanced description with increased contrast */}
                    <p className="text-sm text-white leading-relaxed font-medium drop-shadow-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
                
                {/* Enhanced Hover Effect with better visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
