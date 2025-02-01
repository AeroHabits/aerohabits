import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trackGoalAction } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface GoalFormProps {
  onSubmit: () => void;
}

export function GoalForm({ onSubmit }: GoalFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Enter your goal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />
      </div>
      <div>
        <Textarea
          placeholder="Describe your goal (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full">
        Add Goal
      </Button>
    </form>
  );
}