
import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Target, Flame, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AppShowcase = memo(() => {
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

  const handleCardClick = useCallback((route: string) => {
    navigate(route);
  }, [navigate]);

  // Optimized animations with fewer properties
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="py-12 md:py-16 will-change-transform"
    >
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            transition={{ 
              duration: 0.4,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            onClick={() => handleCardClick(feature.route)}
            className="group cursor-pointer will-change-transform"
            whileHover={{ y: -4 }}
          >
            <div className="relative h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-black/30 border border-white/10 shadow-xl transition-all duration-300 hover:border-white/25 hover:shadow-2xl hover:shadow-blue-500/20">
              {/* Optimized Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-100 transition-all duration-300`} />
              
              {/* Light Effect - simplified for performance */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.2),_transparent_50%)] opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative p-8 h-full">
                <div className="flex flex-col items-start gap-6">
                  {/* Icon container with better contrast */}
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg group-hover:border-white/30 group-hover:bg-white/15 transition-all duration-300">
                    {feature.icon}
                  </div>
                  
                  <div className="space-y-3">
                    {/* Enhanced title with stronger text shadow */}
                    <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]">
                      {feature.title}
                    </h3>
                    {/* Enhanced description with increased contrast */}
                    <p className="text-sm text-white/90 leading-relaxed font-medium drop-shadow-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

AppShowcase.displayName = 'AppShowcase';
