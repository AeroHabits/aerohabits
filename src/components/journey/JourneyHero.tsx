
import { motion } from "framer-motion";
import { TrendingUp, Award, Target, Sparkles } from "lucide-react";

export function JourneyHero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl"
    >
      <div className="relative p-8 md:p-12">
        {/* Sophisticated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-700/80 to-indigo-800/90 z-0">
          {/* Subtle pattern overlay */}
          <motion.div 
            className="absolute inset-0 opacity-10"
            initial={{ backgroundPositionX: "0%" }}
            animate={{ backgroundPositionX: "100%" }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM37.656 0l7.07 7.07-1.414 1.415L36 1.172V0h1.657zM22.344 0L15.274 7.07l1.414 1.415L24 1.172V0h-1.657zM32.656 0l7.07 7.07-1.414 1.415L31 1.172V0h1.657zM27.344 0L20.274 7.07l1.414 1.415L29 1.172V0h-1.657zm8.657 0l7.07 7.07-1.414 1.415L34.343 0h1.657zM24 0l7.071 7.07-1.414 1.415L22.343 0H24zm-4.656 0l7.07 7.07-1.414 1.415L17.686 0h1.657zM12 0l7.071 7.07-1.414 1.415L10.343 0H12zm-4.656 0l7.07 7.07-1.414 1.415L5.686 0h1.657zM2.828 0l7.071 7.07-1.414 1.415L1.172 0h1.656zM0 0l7.071 7.07-1.414 1.415L0 2.828V0zm0 5.172L5.172 10.344 3.757 11.76 0 8.001V5.173zM0 10.344L3.172 13.516 1.757 14.93 0 13.173v-2.83zm0 5.172L1.172 16.688l7.07 7.07-1.414 1.414L0 18.516v-2.999z' fill='%23fff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          {/* Icon cluster */}
          <motion.div 
            className="flex justify-center gap-6 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {[TrendingUp, Award, Target].map((Icon, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? 5 : -5 }}
                className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg"
              >
                <Icon className="w-6 h-6 text-blue-100" />
              </motion.div>
            ))}
          </motion.div>

          {/* Title with refined animation */}
          <motion.h1 
            className="text-5xl md:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block relative">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg">
                Your Habit Journey
              </span>
              <motion.span
                className="absolute -top-2 -right-2"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <Sparkles className="h-6 w-6 text-yellow-300" />
              </motion.span>
            </span>
          </motion.h1>
          
          {/* Description with improved typography */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="text-xl text-blue-100 max-w-2xl mx-auto font-medium leading-relaxed">
              Track your progress, celebrate achievements, and witness your growth transform into lasting habits.
            </p>
            <motion.div 
              className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-300/30"
              initial={{ width: 0 }}
              animate={{ width: "150px" }}
              transition={{ delay: 0.8, duration: 0.8 }}
            />
          </motion.div>
          
          {/* Motivational tag with glass effect */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="pt-2"
          >
            <span className="inline-block bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full text-blue-100 text-sm font-medium border border-white/10 shadow-xl">
              Every step counts on your path to excellence
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
