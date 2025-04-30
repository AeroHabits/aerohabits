
import { motion } from "framer-motion";
import { ClipboardList, Sparkles, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const GoalListEmpty = () => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center bg-gradient-to-br from-gray-800/70 to-slate-700/70 p-8 rounded-xl border border-white/5 shadow-xl"
    >
      <div className="flex flex-col items-center gap-5 max-w-md mx-auto">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: [0.8, 1.1, 1],
            rotate: [0, -5, 0, 5, 0]
          }}
          transition={{ duration: 1.2 }}
          className="rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-5 mb-2"
        >
          <div className="relative">
            <ClipboardList className="h-10 w-10 text-blue-300" />
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute inset-0 bg-blue-400 rounded-full blur-lg -z-10"
            />
          </div>
        </motion.div>
        
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
          No Goals Yet
        </h2>
        
        <p className="text-blue-100/80 font-medium leading-relaxed">
          Setting clear goals helps you track your progress and stay motivated on your journey.
        </p>
        
        <div className={`${isMobile ? 'w-full' : 'w-4/5'} mt-2`}>
          <Button 
            variant="outline" 
            className="w-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border-blue-400/20 group"
          >
            <PlusCircle className="h-4 w-4 mr-2 text-blue-400 group-hover:text-blue-300 transition-colors" />
            <span className="font-medium">Create Your First Goal</span>
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xs text-blue-300/60 mt-2 flex items-center gap-1.5"
        >
          <Sparkles className="h-3 w-3" />
          <span>Add goals to track your progress</span>
        </motion.div>
      </div>
    </motion.div>
  );
};
