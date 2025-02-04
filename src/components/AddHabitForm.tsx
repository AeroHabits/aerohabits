import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Sparkles, Target, Brain, CircuitBoard } from "lucide-react";

interface AddHabitFormProps {
  onAddHabit: (habit: { title: string; description: string; category?: string }) => void;
}

export function AddHabitForm({ onAddHabit }: AddHabitFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a habit title",
        variant: "destructive",
      });
      return;
    }

    onAddHabit({ title, description });
    setTitle("");
    setDescription("");
    
    toast({
      title: "Success",
      description: "New habit added successfully!",
    });
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-center space-x-4 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full shadow-lg"
        >
          <Brain className="w-6 h-6 text-white" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-white"
        >
          Create New Habit
        </motion.div>
      </div>

      <div className="space-y-4">
        <motion.div
          animate={isTitleFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative"
        >
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <Input
            placeholder="Enter your new habit..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsTitleFocused(true)}
            onBlur={() => setIsTitleFocused(false)}
            className="pl-10 bg-white/10 border-2 border-white/20 focus:border-blue-400 text-white placeholder:text-white/50 text-lg font-medium rounded-lg transition-all duration-300 hover:border-white/30 focus:ring-2 focus:ring-blue-400/50 focus:ring-opacity-50"
          />
        </motion.div>
        
        <motion.div
          animate={isDescriptionFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative"
        >
          <div className="absolute top-3 left-3 pointer-events-none">
            <CircuitBoard className="w-5 h-5 text-blue-400" />
          </div>
          <Textarea
            placeholder="Describe your habit..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={() => setIsDescriptionFocused(true)}
            onBlur={() => setIsDescriptionFocused(false)}
            className="pl-10 bg-white/10 border-2 border-white/20 focus:border-blue-400 text-white placeholder:text-white/50 text-base rounded-lg min-h-[100px] transition-all duration-300 hover:border-white/30 focus:ring-2 focus:ring-blue-400/50 focus:ring-opacity-50"
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
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-6 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden rounded-lg"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/40 to-indigo-400/40 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></span>
          <span className="relative flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 animate-pulse" />
            Create Habit
          </span>
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-white/60 text-sm mt-4"
      >
        Start your journey to better habits today
      </motion.div>
    </motion.form>
  );
}