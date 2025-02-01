import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trackGoalAction } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Minus } from "lucide-react";

interface GoalFormProps {
  onSubmit: () => void;
}

export function GoalForm({ onSubmit }: GoalFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [milestones, setMilestones] = useState<string[]>([""]);
  const { toast } = useToast();

  const handleAddMilestone = () => {
    setMilestones([...milestones, ""]);
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleMilestoneChange = (index: number, value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index] = value;
    setMilestones(newMilestones);
  };

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

        const filteredMilestones = milestones
          .filter(m => m.trim() !== "")
          .map(title => ({ title, completed: false }));

        const { error } = await supabase
          .from('goals')
          .insert([
            {
              title,
              description: description.trim() || null,
              user_id: user.id,
              status: 'in_progress',
              progress: 0,
              milestones: filteredMilestones
            }
          ]);

        if (error) throw error;

        trackGoalAction('create', title);
        onSubmit();
        setTitle("");
        setDescription("");
        setMilestones([""]);
        
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
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Milestones</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddMilestone}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Milestone
          </Button>
        </div>
        {milestones.map((milestone, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder={`Milestone ${index + 1}`}
              value={milestone}
              onChange={(e) => handleMilestoneChange(index, e.target.value)}
              className="flex-1"
            />
            {milestones.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveMilestone(index)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Minus className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <Button type="submit" className="w-full">
        Add Goal
      </Button>
    </form>
  );
}