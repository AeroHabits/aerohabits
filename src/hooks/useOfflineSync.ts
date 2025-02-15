
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { debounce } from "lodash";
import { useOnlineStatus } from "./useOnlineStatus";
import { Habit, Goal, Challenge } from "@/types";

const SYNC_QUEUE_KEY = 'habitSyncQueue';
const BATCH_SIZE = 10;
const SYNC_DEBOUNCE_MS = 2000;

type SyncItem = {
  id?: string;
  user_id: string;
  entity_id: string;
  entity_type: 'habit' | 'goal' | 'challenge';
  action: 'add' | 'update' | 'delete';
  data?: any;
  created_at: string;
  synced_at?: string;
};

export function useOfflineSync() {
  const isOnline = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);

  // Queue sync operation
  const queueSync = async (
    entityId: string, 
    entityType: SyncItem['entity_type'], 
    action: SyncItem['action'], 
    data?: any
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const syncItem: SyncItem = {
      user_id: user.id,
      entity_id: entityId,
      entity_type: entityType,
      action,
      data,
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase
        .from('sync_queue')
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
        .from('sync_queue')
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
            const table = `${item.entity_type}s`; // habits, goals, challenges
            
            switch (item.action) {
              case 'add':
                await supabase.from(table).insert([item.data]);
                break;
              case 'update':
                await supabase.from(table).update(item.data).eq('id', item.entity_id);
                break;
              case 'delete':
                await supabase.from(table).delete().eq('id', item.entity_id);
                break;
            }

            // Mark as synced in Supabase queue
            if (item.id) {
              await supabase
                .from('sync_queue')
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
