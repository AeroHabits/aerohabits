
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trackGoalAction } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Target, CircuitBoard, ArrowLeft } from "lucide-react";

interface GoalFormProps {
  onSubmit: () => void;
}

export function GoalForm({ onSubmit }: GoalFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Error",
            description: "You must be logged in to create goals",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from('goals')
          .insert([
            {
              title,
              description: description.trim() || null,
              user_id: user.id,
              status: 'in_progress',
              progress: 0
            }
          ]);

        if (error) throw error;

        trackGoalAction('create', title);
        onSubmit();
        setTitle("");
        setDescription("");
        
        toast({
          title: "Success",
          description: "Goal created successfully!",
        });
      } catch (error) {
        console.error('Error creating goal:', error);
        toast({
          title: "Error",
          description: "Failed to create goal",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6 bg-[#1e2030] backdrop-blur-lg p-8 rounded-xl shadow-2xl border border-[#33354a]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center mb-6 relative">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="absolute left-0 text-gray-400 hover:text-white"
          onClick={() => onSubmit()}
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </Button>
        
        <div className="flex items-center justify-center w-full">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="p-4 bg-[#9d6ff8] rounded-full shadow-lg mr-4"
          >
            <Target className="w-7 h-7 text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-white"
          >
            Create New Goal
          </motion.h2>
        </div>
      </div>

      <div className="space-y-5 mt-10">
        <motion.div
          animate={isTitleFocused ? { scale: 1.01 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative"
        >
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Target className="w-6 h-6 text-[#9d6ff8]" />
          </div>
          <Input
            type="text"
            placeholder="Enter your goal..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsTitleFocused(true)}
            onBlur={() => setIsTitleFocused(false)}
            className="pl-12 py-6 text-lg bg-[#242738] border-[#33354a] border focus:border-[#9d6ff8] text-white placeholder:text-gray-400 rounded-xl transition-all duration-300 hover:border-[#9d6ff8]/50 focus:ring-2 focus:ring-[#9d6ff8]/30"
          />
        </motion.div>
        
        <motion.div
          animate={isDescriptionFocused ? { scale: 1.01 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative"
        >
          <div className="absolute top-3 left-3 pointer-events-none">
            <CircuitBoard className="w-6 h-6 text-[#9d6ff8]" />
          </div>
          <Textarea
            placeholder="Describe your goal..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={() => setIsDescriptionFocused(true)}
            onBlur={() => setIsDescriptionFocused(false)}
            className="pl-12 bg-[#242738] border-[#33354a] border focus:border-[#9d6ff8] text-white placeholder:text-gray-400 rounded-xl min-h-[160px] transition-all duration-300 hover:border-[#9d6ff8]/50 focus:ring-2 focus:ring-[#9d6ff8]/30"
          />
        </motion.div>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="pt-4"
      >
        <Button 
          type="submit"
          className="w-full bg-[#9d6ff8] hover:bg-[#8a5ff0] text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
        >
          Create Goal
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-[#9d6ff8]/90 text-sm mt-4 font-medium"
      >
        Transform your aspirations into achievements
      </motion.div>
    </motion.form>
  );
}
