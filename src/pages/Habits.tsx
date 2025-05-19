
import { HabitList } from "@/components/HabitList";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/UserMenu";
import { PageHeader } from "@/components/layout/PageHeader";
import { Sparkles, Star, Flame } from "lucide-react";

const Habits = () => {
  const isMobile = useIsMobile();

  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Enhanced floating elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full filter blur-[120px] animate-float" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-indigo-500/5 rounded-full filter blur-[100px] animate-float" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full filter blur-[90px] animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.7 }}
        className={cn(
          "container mx-auto px-4 pt-safe pb-32 md:py-16 space-y-8 md:space-y-12 relative z-10", 
          isMobile && "pb-36"
        )}
      >
        <div className="flex justify-between items-center mb-8 pt-6">
          <PageHeader />
          <UserMenu />
        </div>
        
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.7,
        delay: 0.2
      }} className="bg-slate-900/50 backdrop-blur-2xl p-8 md:p-10 shadow-2xl border border-white/[0.05] hover:border-white/[0.08] transition-all duration-300 rounded-md">
          <div className="mb-10 text-center">
            <motion.div initial={{
            scale: 0.8,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }} className="mb-4 inline-flex gap-3">
              <Star className="h-6 w-6 text-amber-400/90" />
              <Flame className="h-6 w-6 text-orange-400/90" />
              <Sparkles className="h-6 w-6 text-blue-400/90" />
            </motion.div>
            
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 bg-clip-text text-transparent">
                  Create Daily Habits
                </span>
                <motion.span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-blue-200/0 via-blue-200/70 to-blue-200/0" initial={{
                width: "0%"
              }} animate={{
                width: "100%"
              }} transition={{
                duration: 0.8,
                delay: 0.5
              }} />
              </span>
            </h2>
            <p className="text-blue-100/80 max-w-2xl mx-auto text-lg font-medium">
              Build consistency and watch your streaks grow! ✨
            </p>
          </div>
          
          <HabitList />
        </motion.div>
      </motion.div>
      
      {/* Enhanced floating sparkle effects */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1,
      duration: 2
    }} className="absolute bottom-20 left-20 z-0">
        <Sparkles className="h-5 w-5 text-blue-300/30" />
      </motion.div>
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1.5,
      duration: 2
    }} className="absolute top-40 right-20 z-0">
        <Sparkles className="h-4 w-4 text-purple-300/30" />
      </motion.div>
    </div>;
};

export default Habits;
