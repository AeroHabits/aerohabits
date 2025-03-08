
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BATCH_SIZE, SYNC_QUEUE_KEY } from "./syncTypes";
import { useSyncRetry } from "./useSyncRetry";
import { useOnlineStatus } from "../useOnlineStatus";

export function useSyncProcessor() {
  const [isSyncing, setIsSyncing] = useState(false);
  const isOnline = useOnlineStatus();
  const { scheduleRetry } = useSyncRetry();

  // Process sync queue with batching and prioritization
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

      let localQueue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
      
      if (!queueItems?.length && !localQueue.length) return;

      // Combine and sort by priority (higher first) then by timestamp
      const allItems = [...(queueItems || []), ...localQueue]
        .sort((a, b) => {
          // Sort by priority first (high to low)
          const priorityDiff = (b.priority || 1) - (a.priority || 1);
          if (priorityDiff !== 0) return priorityDiff;
          
          // Then by creation date (old to new)
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
      
      // Group operations by type for more efficient processing
      const groupedItems: Record<string, any[]> = {
        add: [],
        update: [],
        delete: []
      };
      
      allItems.forEach(item => {
        if (groupedItems[item.action]) {
          groupedItems[item.action].push(item);
        }
      });
      
      // Process each operation type in batches
      for (const [action, items] of Object.entries(groupedItems)) {
        if (!items.length) continue;
        
        for (let i = 0; i < items.length; i += BATCH_SIZE) {
          const batch = items.slice(i, i + BATCH_SIZE);
          
          try {
            if (action === 'add') {
              // For adds, we can do a bulk insert
              const insertData = batch.map(item => item.data);
              const { error } = await supabase.from('habits').insert(insertData);
              if (error) throw error;
            } else if (action === 'update') {
              // For updates, we need to do them individually
              for (const item of batch) {
                const { error } = await supabase
                  .from('habits')
                  .update(item.data)
                  .eq('id', item.habit_id);
                
                if (error) {
                  console.error('Error updating habit:', error);
                  scheduleRetry(item, processSyncQueue);
                  continue;
                }
              }
            } else if (action === 'delete') {
              // For deletes, we can do a batch delete
              const idsToDelete = batch.map(item => item.habit_id);
              const { error } = await supabase
                .from('habits')
                .delete()
                .in('id', idsToDelete);
              
              if (error) throw error;
            }
            
            // Mark processed items in Supabase
            const supabaseIds = batch
              .filter(item => item.id)
              .map(item => item.id as string);
            
            if (supabaseIds.length) {
              await supabase
                .from('habit_sync_queue')
                .update({ synced_at: new Date().toISOString() })
                .in('id', supabaseIds);
            }
            
            // Remove processed items from local storage
            const processedLocalItems = batch.filter(item => !item.id);
            if (processedLocalItems.length) {
              const processedIds = new Set(processedLocalItems.map(item => item.habit_id));
              localQueue = localQueue.filter(item => !processedIds.has(item.habit_id));
              localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(localQueue));
            }
          } catch (error) {
            console.error(`Error processing ${action} batch:`, error);
            // Schedule retries for the whole batch
            batch.forEach(item => scheduleRetry(item, processSyncQueue));
          }
        }
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return { processSyncQueue, isSyncing };
}
