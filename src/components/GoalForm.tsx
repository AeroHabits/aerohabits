
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trackGoalAction } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Target, CircuitBoard } from "lucide-react";

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
      className="space-y-6 bg-[#2A2F3C] backdrop-blur-lg p-8 rounded-xl shadow-2xl border-2 border-[#403E43] hover:border-[#8B5CF6]/50 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-center space-x-4 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="p-3 bg-[#8B5CF6] rounded-full shadow-lg"
        >
          <Target className="w-6 h-6 text-white" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-white"
        >
          Create New Goal
        </motion.div>
      </div>

      <div className="space-y-4">
        <motion.div
          animate={isTitleFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative"
        >
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Target className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <Input
            type="text"
            placeholder="Enter your goal..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsTitleFocused(true)}
            onBlur={() => setIsTitleFocused(false)}
            className="pl-10 bg-[#1A1F2C] border-2 border-[#403E43] focus:border-[#8B5CF6] text-white placeholder:text-gray-400 text-lg font-medium rounded-lg transition-all duration-300 hover:border-[#8B5CF6]/50 focus:ring-2 focus:ring-[#8B5CF6]/30"
          />
        </motion.div>
        
        <motion.div
          animate={isDescriptionFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative"
        >
          <div className="absolute top-3 left-3 pointer-events-none">
            <CircuitBoard className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <Textarea
            placeholder="Describe your goal..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={() => setIsDescriptionFocused(true)}
            onBlur={() => setIsDescriptionFocused(false)}
            className="pl-10 bg-[#1A1F2C] border-2 border-[#403E43] focus:border-[#8B5CF6] text-white placeholder:text-gray-400 text-base rounded-lg min-h-[100px] transition-all duration-300 hover:border-[#8B5CF6]/50 focus:ring-2 focus:ring-[#8B5CF6]/30"
          />
        </motion.div>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative"
      >
        <Button 
          type="submit"
          className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#7C3AED] hover:to-[#C026D3] text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden rounded-lg"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></span>
          <span className="relative flex items-center justify-center gap-2">
            Create Goal
          </span>
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-white text-sm mt-4"
      >
        Transform your aspirations into achievements
      </motion.div>
    </motion.form>
  );
}
