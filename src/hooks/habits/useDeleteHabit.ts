
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useOfflineSync } from "../useOfflineSync";
import { useLocalStorage } from "../useLocalStorage";
import { Habit } from "@/types";

export function useDeleteHabit() {
  const { toast } = useToast();
  const { queueSync } = useOfflineSync();
  const { loadOfflineHabits, saveOfflineHabits } = useLocalStorage();
  const { isOnline } = useOfflineSync();

  const deleteHabit = async (id: string) => {
    try {
      if (!isOnline) {
        const currentHabits = loadOfflineHabits();
        const updatedHabits = currentHabits.filter((h: Habit) => h.id !== id);
        saveOfflineHabits(updatedHabits);
        await queueSync(id, 'habit', 'delete');
        toast({
          title: "Success",
          description: "Habit deleted successfully (offline mode)",
        });
        return true;
      }

      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Habit deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive",
      });
      return false;
    }
  };

  return deleteHabit;
}
