
import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Target, Flame, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AppShowcase = memo(() => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Star className="h-8 w-8 text-amber-300/90" />,
      title: "Track Daily Habits",
      description: "Build lasting habits with daily tracking and reminders",
      route: "/habits",
      gradient: "from-amber-800/30 via-amber-700/20 to-amber-600/10"
    },
    {
      icon: <Flame className="h-8 w-8 text-orange-400/90" />,
      title: "Join Challenges",
      description: "Participate in community challenges",
      route: "/challenges",
      gradient: "from-orange-800/30 via-orange-700/20 to-orange-600/10"
    },
    {
      icon: <Target className="h-8 w-8 text-blue-300/90" />,
      title: "Set Goals",
      description: "Define and achieve your personal goals",
      route: "/goals",
      gradient: "from-blue-800/30 via-blue-700/20 to-blue-600/10"
    },
    {
      icon: <Award className="h-8 w-8 text-purple-300/90" />,
      title: "Track Progress",
      description: "Visualize your journey with detailed statistics",
      route: "/journey",
      gradient: "from-purple-800/30 via-purple-700/20 to-purple-600/10"
    }
  ];

  const handleCardClick = useCallback((route: string) => {
    navigate(route);
  }, [navigate]);

  // Enhanced animations with more subtle transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
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
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            onClick={() => handleCardClick(feature.route)}
            className="group cursor-pointer will-change-transform"
            whileHover={{ y: -5, scale: 1.01 }}
          >
            <div className="relative h-full rounded-2xl overflow-hidden backdrop-blur-sm bg-black/20 border border-white/5 shadow-lg transition-all duration-300 hover:border-white/10 hover:shadow-xl hover:shadow-blue-500/10">
              {/* Subtle Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-70 transition-all duration-500`} />
              
              {/* Subtle Light Effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.15),_transparent_70%)] opacity-30 group-hover:opacity-40 transition-opacity duration-500"></div>
              
              {/* Content */}
              <div className="relative p-7 h-full">
                <div className="flex flex-col items-start gap-6">
                  {/* Icon container with glass effect */}
                  <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg group-hover:border-white/15 group-hover:bg-white/10 transition-all duration-300">
                    {feature.icon}
                  </div>
                  
                  <div className="space-y-2">
                    {/* Title with more subtle styling */}
                    <h3 className="text-xl font-bold text-white/90 tracking-tight">
                      {feature.title}
                    </h3>
                    {/* Refined description */}
                    <p className="text-sm text-white/70 leading-relaxed">
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
