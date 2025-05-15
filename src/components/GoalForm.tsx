import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trackGoalAction } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Target, CircuitBoard, ArrowLeft, Calendar, Clock } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
interface GoalFormProps {
  onSubmit: () => void;
}
export function GoalForm({
  onSubmit
}: GoalFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      try {
        const {
          data: {
            user
          }
        } = await supabase.auth.getUser();
        if (!user) {
          toast.error("You must be logged in to create goals");
          return;
        }
        const {
          error
        } = await supabase.from('goals').insert([{
          title,
          description: description.trim() || null,
          user_id: user.id,
          status: 'in_progress',
          progress: 0,
          target_date: targetDate ? targetDate.toISOString() : null
        }]);
        if (error) throw error;
        trackGoalAction('create', title);
        onSubmit();
        setTitle("");
        setDescription("");
        toast.success("Goal created successfully!");
      } catch (error) {
        console.error('Error creating goal:', error);
        toast.error("Failed to create goal");
      }
    } else {
      toast.error("Please enter a title for your goal");
    }
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="relative">
      {/* Background glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-blue-600/10 rounded-xl blur-3xl -z-10"></div>
      
      <motion.form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-lg p-8 md:p-10 rounded-xl shadow-2xl border border-indigo-500/30">
        <div className="flex items-center mb-8 relative">
          <Button type="button" variant="ghost" size="sm" onClick={() => onSubmit()} className="absolute left-0 text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
          
          <div className="flex items-center justify-center w-full">
            
            <motion.h2 initial={{
            opacity: 0,
            x: -10
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.2
          }} className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">
              Create New Goal
            </motion.h2>
          </div>
        </div>

        <div className="space-y-6 mt-10">
          <motion.div animate={isTitleFocused ? {
          scale: 1.01
        } : {
          scale: 1
        }} transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }} className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Target className="w-6 h-6 text-indigo-400" />
            </div>
            <Input type="text" placeholder="Enter your goal..." value={title} onChange={e => setTitle(e.target.value)} onFocus={() => setIsTitleFocused(true)} onBlur={() => setIsTitleFocused(false)} className={cn("pl-12 py-6 text-lg bg-slate-800/80 border-slate-700/80 focus:border-indigo-500/70 text-white placeholder:text-gray-400 rounded-xl transition-all duration-300", "hover:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/30", isTitleFocused && "shadow-[0_0_15px_rgba(99,102,241,0.2)]")} />
          </motion.div>
          
          <motion.div animate={isDescriptionFocused ? {
          scale: 1.01
        } : {
          scale: 1
        }} transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }} className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <CircuitBoard className="w-6 h-6 text-indigo-400" />
            </div>
            <Textarea placeholder="Describe your goal..." value={description} onChange={e => setDescription(e.target.value)} onFocus={() => setIsDescriptionFocused(true)} onBlur={() => setIsDescriptionFocused(false)} className={cn("pl-12 bg-slate-800/80 border-slate-700/80 focus:border-indigo-500/70 text-white placeholder:text-gray-400 rounded-xl min-h-[160px]", "transition-all duration-300 hover:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/30", isDescriptionFocused && "shadow-[0_0_15px_rgba(99,102,241,0.2)]")} />
          </motion.div>

          <motion.div className="relative">
            <div className="flex flex-col space-y-2">
              <label htmlFor="target-date" className="text-sm text-gray-300 font-medium ml-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-400" />
                Target Date (Optional)
              </label>
              <DatePicker date={targetDate} setDate={setTargetDate} />
            </div>
          </motion.div>
        </div>
        
        <motion.div className="pt-6">
          <div className="relative overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-70 hover:opacity-100 transition-opacity duration-300"></div>
            
            <Button type="submit" className="relative w-full bg-transparent text-white font-semibold py-6 text-lg shadow-xl transition-all duration-500 
                         hover:shadow-[0_8px_25px_-5px_rgba(124,58,237,0.6)] group rounded-xl border-0">
              <motion.span initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.3,
              duration: 0.4
            }} className="flex items-center justify-center gap-2">
                <motion.div animate={{
                rotate: [0, 360]
              }} transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 5
              }}>
                  <Target className="w-5 h-5" />
                </motion.div>
                Create Goal
              </motion.span>
            </Button>
          </div>
        </motion.div>

        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.5
      }} className="text-center text-indigo-300/90 text-sm mt-4 font-medium flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" />
          Transform your aspirations into achievements
        </motion.div>
      </motion.form>
    </motion.div>;
}