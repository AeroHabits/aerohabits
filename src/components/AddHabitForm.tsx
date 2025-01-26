import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface AddHabitFormProps {
  onAddHabit: (habit: { title: string; description: string }) => void;
}

export function AddHabitForm({ onAddHabit }: AddHabitFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
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
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white/70 backdrop-blur-sm rounded-lg border border-[#D3E4FD]/50">
      <div className="space-y-2">
        <Input
          placeholder="Enter habit title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-[#D3E4FD]/50 focus:border-[#33C3F0]/60"
        />
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Enter habit description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-[#D3E4FD]/50 focus:border-[#33C3F0]/60"
        />
      </div>
      <Button 
        type="submit"
        className="w-full bg-gradient-to-r from-[#F97316] via-[#D946EF] to-[#0EA5E9] text-white hover:opacity-90"
      >
        Add New Habit
      </Button>
    </form>
  );
}