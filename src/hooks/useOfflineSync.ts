
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { debounce } from "lodash";
import { useOnlineStatus } from "./useOnlineStatus";
import { SyncEntityType, SyncAction } from "@/types";

const SYNC_QUEUE_KEY = 'habitSyncQueue';
const BATCH_SIZE = 10;
const SYNC_DEBOUNCE_MS = 2000;

interface HabitSyncQueueItem {
  id?: string;
  user_id: string;
  habit_id: string;  // Changed from entity_id to match DB schema
  action: string;
  data?: any;
  created_at: string;
  synced_at?: string;
}

export function useOfflineSync() {
  const isOnline = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);

  // Queue sync operation
  const queueSync = async (
    entityId: string, 
    entityType: SyncEntityType,
    action: SyncAction,
    data?: any
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
      habit_id: entityId,  // Using habit_id instead of entity_id
      action,
      data,
      created_at: new Date().toISOString()
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

  // Process sync queue
  const processSyncQueue = async () => {
    if (!isOnline || isSyncing) return;

    try {
      setIsSyncing(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get queue items from both Supabase and local storage
      const { data: queueItems } = await supabase
        .from('habit_sync_queue')
        .select('*')
        .is('synced_at', null)
        .order('created_at', { ascending: true })
        .limit(BATCH_SIZE);

      const localQueue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
      
      if (!queueItems?.length && !localQueue.length) return;

      const allItems = [...(queueItems || []), ...localQueue];
      
      // Process items in batches
      for (let i = 0; i < allItems.length; i += BATCH_SIZE) {
        const batch = allItems.slice(i, i + BATCH_SIZE);
        
        for (const item of batch) {
          try {
            switch (item.action) {
              case 'add':
                await supabase.from('habits').insert([item.data]);
                break;
              case 'update':
                await supabase.from('habits').update(item.data).eq('id', item.habit_id);
                break;
              case 'delete':
                await supabase.from('habits').delete().eq('id', item.habit_id);
                break;
            }

            // Mark as synced in Supabase queue
            if (item.id) {
              await supabase
                .from('habit_sync_queue')
                .update({ synced_at: new Date().toISOString() })
                .eq('id', item.id);
            }
          } catch (error) {
            console.error('Error processing sync item:', error);
          }
        }
      }

      // Clear local storage queue after processing
      localStorage.removeItem(SYNC_QUEUE_KEY);
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline) {
      processSyncQueue();
    }
  }, [isOnline]);

  // Debounced sync processor
  const debouncedSync = useCallback(
    debounce(processSyncQueue, SYNC_DEBOUNCE_MS),
    []
  );

  return {
    queueSync,
    processSyncQueue,
    debouncedSync,
    isOnline,
    isSyncing
  };
}
