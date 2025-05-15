
import { motion } from "framer-motion";
import { ClipboardList, Sparkles, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface GoalListEmptyProps {
  onCreateGoal: () => void;
}

export const GoalListEmpty = ({ onCreateGoal }: GoalListEmptyProps) => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center bg-gradient-to-br from-slate-900/95 to-slate-800/95 p-12 rounded-xl border border-indigo-500/20 shadow-xl relative overflow-hidden"
    >
      {/* Background effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptLTIgaDF2NEgzM3YtNHptMTEgMGgxdjRoLTF2LTR6TTQgMTBWOGgybDIgMmgtNHptMTYtMnYxoC0xMlY4aDEyem0tNi0xaDJsMiAyaC02bDItMnptOCAwaDJsMiAyaC02bDItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-15"></div>
      
      <div className="flex flex-col items-center gap-5 max-w-md mx-auto relative z-10">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: [0.8, 1.1, 1],
            rotate: [0, -5, 0, 5, 0]
          }}
          transition={{ duration: 1.2 }}
          className="rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-6 mb-2"
        >
          <div className="relative">
            <ClipboardList className="h-12 w-12 text-indigo-300" />
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
              className="absolute inset-0 bg-indigo-500 rounded-full blur-xl -z-10 opacity-30"
            />
          </div>
        </motion.div>
        
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">
          No Goals Yet
        </h2>
        
        <p className="text-indigo-100/90 font-medium leading-relaxed text-lg">
          Setting clear goals helps you track your progress and stay motivated on your journey.
        </p>
        
        <div className={`${isMobile ? 'w-full' : 'w-4/5'} mt-6`}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="outline" 
              className="w-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border-indigo-500/30 group py-6 shadow-lg hover:shadow-indigo-500/20"
              onClick={onCreateGoal}
            >
              <PlusCircle className="h-5 w-5 mr-2 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
              <span className="font-medium text-lg">Create Your First Goal</span>
            </Button>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-sm text-indigo-300/60 mt-6 flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          <span>Transform your aspirations into achievements</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
