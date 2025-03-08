
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useOfflineSync } from "./useOfflineSync";
import { useLocalStorage } from "./useLocalStorage";

export function useHabitAdd() {
  const { toast } = useToast();
  const { queueSync, debouncedSync } = useOfflineSync();
  const { loadOfflineHabits, saveOfflineHabits } = useLocalStorage();
  const { isOnline } = useOfflineSync();

  const addHabit = async ({ title, description, category_id }: { title: string; description: string; category_id?: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const newHabit = {
        id: crypto.randomUUID(),
        title,
        description,
        category_id,
        streak: 0,
        completed: false,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        offline_created: !isOnline
      };

      if (!isOnline) {
        const currentHabits = loadOfflineHabits();
        saveOfflineHabits([newHabit, ...currentHabits]);
        await queueSync(newHabit.id, 'habit', 'add', newHabit);
        debouncedSync();
        toast({
          title: "Success",
          description: "New habit added successfully! (offline mode)",
        });
        return true;
      }

      const { error } = await supabase
        .from('habits')
        .insert([newHabit]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "New habit added successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error adding habit:', error);
      toast({
        title: "Error",
        description: "Failed to add habit",
        variant: "destructive",
      });
      return false;
    }
  };

  return { addHabit };
}
