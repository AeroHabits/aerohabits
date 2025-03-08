
import { supabase } from "@/integrations/supabase/client";
import { SyncAction, SyncEntityType } from "@/types";
import { HabitSyncQueueItem, SYNC_QUEUE_KEY } from "./syncTypes";

export function useSyncQueue() {
  // Queue sync operation with priority support
  const queueSync = async (
    entityId: string, 
    entityType: SyncEntityType,
    action: SyncAction,
    data?: any,
    priority: number = 1 // Default priority (1=normal, 2=high, 0=low)
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Only handle habit syncs for now
    if (entityType !== 'habit') {
      console.warn('Only habit sync is currently supported');
      return;
    }

    const syncItem: HabitSyncQueueItem = {
      user_id: user.id,
      habit_id: entityId,
      action,
      data,
      created_at: new Date().toISOString(),
      priority,
      retry_count: 0
    };

    try {
      const { error } = await supabase
        .from('habit_sync_queue')
        .insert([syncItem]);

      if (error) throw error;
    } catch (error) {
      console.error('Error queuing sync:', error);
      // Fallback to local storage
      const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
      queue.push(syncItem);
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    }
  };

  return { queueSync };
}
