import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, CheckCircle, Circle, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  status: string;
}

interface GoalListProps {
  onGoalUpdated: () => void;
}

export function GoalList({ onGoalUpdated }: GoalListProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to view goals",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGoals(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch goals",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleStatusUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ status: 'completed' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Goal marked as completed!",
      });
      
      fetchGoals();
      onGoalUpdated();
    } catch (error) {
      console.error('Error updating goal status:', error);
      toast({
        title: "Error",
        description: "Failed to update goal status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Goal deleted successfully",
      });
      
      fetchGoals();
      onGoalUpdated();
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading goals...</div>;
  }

  if (goals.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No goals yet. Add your first goal above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <Card key={goal.id} className="p-6 bg-white/70 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleStatusUpdate(goal.id)}
                  className="hover:bg-transparent"
                >
                  {goal.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </Button>
                <h3 className={cn(
                  "font-semibold",
                  goal.status === 'completed' && "line-through text-muted-foreground"
                )}>
                  {goal.title}
                </h3>
              </div>
              {goal.description && (
                <p className="text-sm text-muted-foreground">{goal.description}</p>
              )}
              {goal.target_date && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  {format(new Date(goal.target_date), "PPP")}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(goal.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}