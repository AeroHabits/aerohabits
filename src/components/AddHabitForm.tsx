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
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-blue-100 hover:border-blue-200">
      <div className="space-y-2">
        <Input
          placeholder="Enter habit title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-white border-gray-200 focus:border-blue-300 text-gray-900 placeholder:text-gray-500 text-lg font-medium"
        />
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Enter habit description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-white border-gray-200 focus:border-blue-300 text-gray-900 placeholder:text-gray-500 text-base"
        />
      </div>
      <Button 
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors"
      >
        Add New Habit
      </Button>
    </form>
  );
}