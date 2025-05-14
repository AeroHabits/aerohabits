import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GoalItem } from "./goals/GoalItem";
import { GoalListEmpty } from "./goals/GoalListEmpty";
import { GoalListLoading } from "./goals/GoalListLoading";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  status: string;
  progress: number;
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
      const goal = goals.find(g => g.id === id);
      if (!goal) return;

      const newStatus = goal.status === 'completed' ? 'in_progress' : 'completed';
      const newProgress = newStatus === 'completed' ? 100 : 0;

      const { error } = await supabase
        .from('goals')
        .update({ 
          status: newStatus,
          progress: newProgress
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Goal ${newStatus === 'completed' ? 'completed' : 'reopened'}!`,
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
    return <GoalListLoading />;
  }

  if (goals.length === 0) {
    return <GoalListEmpty />;
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <GoalItem
          key={goal.id}
          goal={goal}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
