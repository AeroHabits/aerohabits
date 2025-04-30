
import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Target, Flame, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AppShowcase = memo(() => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Star className="h-8 w-8 text-amber-300" />,
      title: "Track Daily Habits",
      description: "Build lasting habits with daily tracking and reminders",
      route: "/habits",
      gradient: "from-amber-500/40 via-amber-400/20 to-amber-300/10"
    },
    {
      icon: <Flame className="h-8 w-8 text-orange-400" />,
      title: "Join Challenges",
      description: "Participate in community challenges",
      route: "/challenges",
      gradient: "from-orange-500/40 via-orange-400/20 to-orange-300/10"
    },
    {
      icon: <Target className="h-8 w-8 text-blue-300" />,
      title: "Set Goals",
      description: "Define and achieve your personal goals",
      route: "/goals",
      gradient: "from-blue-500/40 via-blue-400/20 to-blue-300/10"
    },
    {
      icon: <Award className="h-8 w-8 text-purple-300" />,
      title: "Track Progress",
      description: "Visualize your journey with detailed statistics",
      route: "/journey",
      gradient: "from-purple-500/40 via-purple-400/20 to-purple-300/10"
    }
  ];

  const handleCardClick = useCallback((route: string) => {
    navigate(route);
  }, [navigate]);

  // Enhanced animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="py-16 md:py-20 will-change-transform"
    >
      <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            onClick={() => handleCardClick(feature.route)}
            className="group cursor-pointer will-change-transform"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="relative h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-black/30 border border-white/10 shadow-xl transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:shadow-blue-500/20">
              {/* Enhanced Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-100 transition-all duration-500`} />
              
              {/* Enhanced Light Effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.3),_transparent_60%)] opacity-40 group-hover:opacity-80 transition-opacity duration-500"></div>
              
              {/* Content */}
              <div className="relative p-8 h-full">
                <div className="flex flex-col items-start gap-7">
                  {/* Icon container with glass effect */}
                  <div className="p-5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg group-hover:border-white/40 group-hover:bg-white/20 transition-all duration-300">
                    {feature.icon}
                  </div>
                  
                  <div className="space-y-3">
                    {/* Title with more prominent styling */}
                    <h3 className="text-2xl font-bold text-white tracking-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]">
                      {feature.title}
                    </h3>
                    {/* Enhanced description */}
                    <p className="text-base text-white/95 leading-relaxed font-medium drop-shadow-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                {/* Subtle motion indicator */}
                <motion.div 
                  className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-white/40 opacity-0 group-hover:opacity-100"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

AppShowcase.displayName = 'AppShowcase';
