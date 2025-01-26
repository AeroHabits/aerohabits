import { HabitCard } from "./HabitCard";
import { AddHabitForm } from "./AddHabitForm";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Habit {
  id: string;
  title: string;
  description: string;
  streak: number;
  completed: boolean;
  category?: string;
}

export function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "User not authenticated",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching habits:', error);
        toast({
          title: "Error",
          description: "Failed to load habits",
          variant: "destructive",
        });
        return;
      }

      setHabits(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load habits",
        variant: "destructive",
      });
    }
  };

  const toggleHabit = async (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    try {
      const { error } = await supabase
        .from('habits')
        .update({ completed: !habit.completed })
        .eq('id', id);

      if (error) throw error;

      setHabits(habits.map(habit => 
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      ));

      toast({
        title: "Success",
        description: `Habit marked as ${!habit.completed ? 'completed' : 'incomplete'}`,
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
        toast({
          title: "Error",
          description: "User not authenticated",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
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
        ])
        .select()
        .single();

      if (error) throw error;

      setHabits([data, ...habits]);
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

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            id={habit.id}
            title={habit.title}
            description={habit.description}
            streak={habit.streak}
            completed={habit.completed}
            onToggle={() => toggleHabit(habit.id)}
          />
        ))}
      </div>
      <div className="max-w-md mx-auto">
        <AddHabitForm onAddHabit={addHabit} />
      </div>
    </div>
  );
}