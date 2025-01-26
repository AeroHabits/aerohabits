import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { enhanceToSmartGoal, suggestCategory } from "@/utils/openai";
import { Loader2 } from "lucide-react";

interface AddHabitFormProps {
  onAddHabit: (habit: { title: string; description: string; category?: string }) => void;
}

export function AddHabitForm({ onAddHabit }: AddHabitFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [category, setCategory] = useState<string>("");
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

    try {
      const suggestedCategory = await suggestCategory(title);
      setCategory(suggestedCategory);
      onAddHabit({ title, description, category: suggestedCategory });
      setTitle("");
      setDescription("");
      setCategory("");
      
      toast({
        title: "Success",
        description: "New habit added successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to categorize habit.",
        variant: "destructive",
      });
    }
  };

  const handleEnhanceGoal = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a habit title first",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const enhancedGoal = await enhanceToSmartGoal(title);
      setTitle(enhancedGoal);
      toast({
        title: "Success",
        description: "Goal enhanced to SMART format!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enhance goal.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
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
        <Button
          type="button"
          onClick={handleEnhanceGoal}
          disabled={isEnhancing}
          variant="outline"
          className="w-full"
        >
          {isEnhancing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enhancing...
            </>
          ) : (
            "Make SMART Goal"
          )}
        </Button>
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Enter habit description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-[#D3E4FD]/50 focus:border-[#33C3F0]/60"
        />
      </div>
      {category && (
        <div className="text-sm text-muted-foreground">
          Category: {category}
        </div>
      )}
      <Button 
        type="submit"
        className="w-full bg-gradient-to-r from-[#F97316] via-[#D946EF] to-[#0EA5E9] text-white hover:opacity-90"
      >
        Add New Habit
      </Button>
    </form>
  );
}