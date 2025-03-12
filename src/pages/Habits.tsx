
import { HabitList } from "@/components/HabitList";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/UserMenu";
import { PageHeader } from "@/components/layout/PageHeader";
import { Sparkles, Star, Fire } from "lucide-react";

const Habits = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900 overflow-hidden">
      {/* Enhanced floating elements for visual excitement */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
        <div className="absolute top-10 right-10 w-36 h-36 bg-blue-400 rounded-full filter blur-[100px] animate-float" />
        <div className="absolute bottom-40 left-20 w-48 h-48 bg-purple-400 rounded-full filter blur-[120px] animate-float" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-indigo-500 rounded-full filter blur-[80px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-400 rounded-full filter blur-[100px] animate-float" />
        <div className="absolute top-1/4 left-10 w-24 h-24 bg-indigo-300 rounded-full filter blur-[60px] animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className={cn(
          "container mx-auto px-4 pt-16 pb-32 md:py-16 space-y-8 md:space-y-12 safe-top relative z-10",
          isMobile && "pb-36"
        )}
      >
        <div className="flex justify-between items-center mb-8">
          <PageHeader />
          <UserMenu />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
        >
          <div className="mb-8 text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-3 inline-flex gap-2"
            >
              <Star className="h-5 w-5 text-yellow-300 animate-pulse" />
              <Fire className="h-5 w-5 text-orange-400 animate-pulse" />
              <Sparkles className="h-5 w-5 text-blue-300 animate-pulse" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-3">
              <span className="relative">
                <span className="text-gradient bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
                  Your Daily Habits
                </span>
                <motion.span 
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto text-lg">
              Build consistency and watch your streaks grow! ✨
            </p>
          </div>
          <HabitList />
        </motion.div>
      </motion.div>
      
      {/* Floating sparkle effects */}
      <div className="absolute bottom-10 left-10 z-0 opacity-70">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
        >
          <Sparkles className="h-6 w-6 text-purple-200 animate-pulse" />
        </motion.div>
      </div>
      <div className="absolute top-40 right-10 z-0 opacity-70">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 2 }}
        >
          <Sparkles className="h-5 w-5 text-blue-200 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};

export default Habits;
