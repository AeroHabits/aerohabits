import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

export interface Habit {
  id: string;
  title: string;
  description: string;
  streak: number;
  completed: boolean;
  category?: string;
}

export function useHabits() {
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: habits = [], isLoading, error, refetch } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const deleteHabit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

      if (error) throw error;

      refetch();
      toast({
        title: "Success",
        description: "Habit deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive",
      });
    }
  };

  const toggleHabit = async (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    try {
      // Get today's date at midnight UTC
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      
      // If the habit was already completed today, uncomplete it and decrease streak
      if (habit.completed) {
        const { error } = await supabase
          .from('habits')
          .update({ 
            completed: false,
            streak: Math.max(0, (habit.streak || 0) - 1)
          })
          .eq('id', id);

        if (error) throw error;
      } else {
        // If completing the habit, increase the streak
        const { error } = await supabase
          .from('habits')
          .update({ 
            completed: true,
            streak: (habit.streak || 0) + 1
          })
          .eq('id', id);

        if (error) throw error;
      }

      refetch();
      toast({
        title: "Success",
        description: `Habit ${!habit.completed ? 'completed' : 'uncompleted'} for today!`,
      });
    } catch (error) {
      console.error('Error toggling habit:', error);
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive",
      });
    }
  };

  const addHabit = async ({ title, description, category }: { title: string; description: string; category?: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from('habits')
        .insert([
          {
            title,
            description,
            category,
            streak: 0,
            completed: false,
            user_id: user.id
          }
        ]);

      if (error) throw error;

      refetch();
      toast({
        title: "Success",
        description: "New habit added successfully!",
      });
    } catch (error) {
      console.error('Error adding habit:', error);
      toast({
        title: "Error",
        description: "Failed to add habit",
        variant: "destructive",
      });
    }
  };

  return {
    habits,
    isLoading,
    error,
    habitToDelete,
    setHabitToDelete,
    deleteHabit,
    toggleHabit,
    addHabit,
  };
}