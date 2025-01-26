import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface AddHabitFormProps {
  onAddHabit: (habit: { title: string; description: string; category?: string }) => void;
}

export function AddHabitForm({ onAddHabit }: AddHabitFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
    <form onSubmit={handleSubmit} className="space-y-4 bg-gradient-to-br from-blue-400/20 to-purple-400/10 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-purple-300/20 hover:border-purple-300/30">
      <div className="space-y-2">
        <Input
          placeholder="Enter habit title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-gradient-to-r from-blue-500/10 to-purple-400/10 border-purple-300/30 focus:border-purple-300/50 text-white placeholder:text-white/70 text-lg font-medium"
        />
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Enter habit description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gradient-to-r from-blue-500/10 to-purple-400/10 border-purple-300/30 focus:border-purple-300/50 text-white placeholder:text-white/70 text-base"
        />
      </div>
      <Button 
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500/30 to-purple-400/20 hover:from-blue-500/40 hover:to-purple-400/30 text-white font-medium shadow-sm transition-colors"
      >
        Add New Habit
      </Button>
    </form>
  );
}