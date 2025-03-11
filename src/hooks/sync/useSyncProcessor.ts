
import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BATCH_SIZE, SYNC_QUEUE_KEY } from "./syncTypes";
import { useSyncRetry } from "./useSyncRetry";
import { useOnlineStatus } from "../useOnlineStatus";
import { toast } from "sonner";

export function useSyncProcessor() {
  const [isSyncing, setIsSyncing] = useState(false);
  const syncInProgressRef = useRef(false);
  const isOnline = useOnlineStatus();
  const { scheduleRetry } = useSyncRetry();
  const lastSyncTimeRef = useRef<number | null>(null);

  // Process sync queue with batching and prioritization - with debouncing
  const processSyncQueue = useCallback(async () => {
    // Prevent concurrent sync operations
    if (syncInProgressRef.current || !isOnline) return;
    
    // Rate limiting - don't sync more than once every 30 seconds unless forced
    const now = Date.now();
    if (lastSyncTimeRef.current && (now - lastSyncTimeRef.current < 30000)) {
      return;
    }

    try {
      syncInProgressRef.current = true;
      setIsSyncing(true);
      lastSyncTimeRef.current = now;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get queue items from local storage first - more efficient
      let localQueue = [];
      try {
        const queueJson = localStorage.getItem(SYNC_QUEUE_KEY);
        localQueue = queueJson ? JSON.parse(queueJson) : [];
      } catch (error) {
        console.error("Error parsing sync queue:", error);
        localQueue = [];
      }
      
      // Only fetch from Supabase if we have a user and there are potential items to sync
      let supabaseItems = [];
      
      try {
        const { data: queueItems } = await supabase
          .from('habit_sync_queue')
          .select('*')
          .is('synced_at', null)
          .order('created_at', { ascending: true })
          .limit(BATCH_SIZE);
          
        supabaseItems = queueItems || [];
      } catch (error) {
        console.error("Error fetching sync queue from Supabase:", error);
      }
      
      const allItems = [...supabaseItems, ...localQueue];
      
      if (!allItems.length) return;

      // Group by operation type and create a processing map
      const processingGroups: Record<string, any[]> = {
        add: [],
        update: [],
        delete: []
      };
      
      // Track processed IDs to avoid duplicates
      const processedIds = new Set<string>();
      
      allItems.forEach(item => {
        // Skip if we've already processed this item (could be duplicated between local and server)
        if (item.habit_id && processedIds.has(item.habit_id)) {
          return;
        }
        
        if (processingGroups[item.action]) {
          processingGroups[item.action].push(item);
          if (item.habit_id) {
            processedIds.add(item.habit_id);
          }
        }
      });
      
      // Process each operation type in priority order: delete, update, add
      const processingOrder = ['delete', 'update', 'add'];
      const successfulItems: any[] = [];
      
      for (const action of processingOrder) {
        const items = processingGroups[action];
        if (!items.length) continue;
        
        for (let i = 0; i < items.length; i += BATCH_SIZE) {
          const batch = items.slice(i, i + BATCH_SIZE);
          
          try {
            if (action === 'add') {
              const insertData = batch.map(item => item.data);
              const { error } = await supabase.from('habits').insert(insertData);
              if (error) {
                console.error('Batch error adding habits:', error);
                // Individual retry will be scheduled below
                continue;
              }
              
              successfulItems.push(...batch);
            } else if (action === 'update') {
              // For updates, process in parallel with Promise.all
              const updatePromises = batch.map(item => 
                supabase
                  .from('habits')
                  .update(item.data)
                  .eq('id', item.habit_id)
                  .then(({ error }) => {
                    if (error) {
                      throw { item, error };
                    }
                    return item;
                  })
              );
              
              const results = await Promise.allSettled(updatePromises);
              
              results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                  successfulItems.push(result.value);
                } else {
                  // Schedule retry for failed items
                  const { item, error } = result.reason;
                  console.error(`Error updating habit ${item.habit_id}:`, error);
                  scheduleRetry(item, processSyncQueue);
                }
              });
            } else if (action === 'delete') {
              const idsToDelete = batch.map(item => item.habit_id);
              const { error } = await supabase
                .from('habits')
                .delete()
                .in('id', idsToDelete);
              
              if (error) {
                console.error('Batch error deleting habits:', error);
                continue;
              }
              
              successfulItems.push(...batch);
            }
          } catch (error) {
            console.error(`Error processing ${action} batch:`, error);
            // Schedule retries for the whole batch
            batch.forEach(item => scheduleRetry(item, processSyncQueue));
          }
        }
      }
      
      // Mark processed supabase items
      if (successfulItems.length) {
        const supabaseIds = successfulItems
          .filter(item => item.id)
          .map(item => item.id);
          
        if (supabaseIds.length) {
          await supabase
            .from('habit_sync_queue')
            .update({ synced_at: new Date().toISOString() })
            .in('id', supabaseIds);
        }
        
        // Remove processed local items
        const processedLocalItemIds = new Set(
          successfulItems
            .filter(item => !item.id && item.habit_id)
            .map(item => item.habit_id)
        );
        
        if (processedLocalItemIds.size > 0) {
          const updatedQueue = localQueue.filter(
            item => !processedLocalItemIds.has(item.habit_id)
          );
          
          localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updatedQueue));
        }
        
        // Show success toast only if there were substantial syncs
        if (successfulItems.length > 2) {
          toast.success(`Synced ${successfulItems.length} items`, {
            description: "Your data is now up to date",
            duration: 3000,
          });
        }
      }
      
    } catch (error) {
      console.error("Error processing sync queue:", error);
    } finally {
      syncInProgressRef.current = false;
      setIsSyncing(false);
    }
  }, [isOnline, scheduleRetry]);

  return { 
    processSyncQueue, 
    isSyncing,
    lastSyncTime: lastSyncTimeRef.current
  };
}
