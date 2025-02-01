import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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
      className="space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-blue-100 hover:border-blue-200 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2 relative">
        <motion.div
          animate={isTitleFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Input
            placeholder="✨ Enter an amazing habit..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsTitleFocused(true)}
            onBlur={() => setIsTitleFocused(false)}
            className="bg-white/80 border-2 border-blue-100 focus:border-blue-400 text-gray-900 placeholder:text-gray-500 text-lg font-medium rounded-lg transition-all duration-300 hover:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
          />
        </motion.div>
      </div>
      
      <div className="space-y-2">
        <motion.div
          animate={isDescriptionFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Textarea
            placeholder="🌟 Describe your awesome habit..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={() => setIsDescriptionFocused(true)}
            onBlur={() => setIsDescriptionFocused(false)}
            className="bg-white/80 border-2 border-blue-100 focus:border-blue-400 text-gray-900 placeholder:text-gray-500 text-base rounded-lg min-h-[100px] transition-all duration-300 hover:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
          />
        </motion.div>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Add New Habit
          </span>
        </Button>
      </motion.div>
    </motion.form>
  );
}