import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AddHabitFormProps {
  onAddHabit: (habit: { title: string; description: string; category?: string }) => void;
}

export function AddHabitForm({ onAddHabit }: AddHabitFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

  const enhanceWithAI = async () => {
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
      const { data, error } = await supabase.functions.invoke('habit-ai', {
        body: {
          action: 'enhance',
          input: `Create a clear and motivating description for this habit: ${title}`
        }
      });

      if (error) throw error;
      setDescription(data.result);
      
      // Also get category suggestion
      const { data: categoryData, error: categoryError } = await supabase.functions.invoke('habit-ai', {
        body: {
          action: 'categorize',
          input: title
        }
      });

      if (!categoryError && categoryData?.result) {
        toast({
          title: "Category Suggestion",
          description: `This habit might fit in: ${categoryData.result}`,
        });
      }

    } catch (error) {
      console.error('Error enhancing habit:', error);
      toast({
        title: "Error",
        description: "Failed to enhance habit with AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

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
        <div className="flex gap-2 mb-2">
          <Textarea
            placeholder="Enter habit description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-[#D3E4FD]/50 focus:border-[#33C3F0]/60"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={enhanceWithAI}
          disabled={isEnhancing}
          className="w-full"
        >
          {isEnhancing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enhancing with AI...
            </>
          ) : (
            "✨ Enhance with AI"
          )}
        </Button>
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