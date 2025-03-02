
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { debounce } from "lodash";
import { useOnlineStatus } from "./useOnlineStatus";
import { SyncEntityType, SyncAction } from "@/types";

const SYNC_QUEUE_KEY = 'habitSyncQueue';
const BATCH_SIZE = 50; // Increased from 10 to 50 for more efficient batch processing
const SYNC_DEBOUNCE_MS = 2000;
const MAX_RETRY_ATTEMPTS = 5;

interface HabitSyncQueueItem {
  id?: string;
  user_id: string;
  habit_id: string;
  action: string;
  data?: any;
  created_at: string;
  synced_at?: string;
  priority?: number; // Added priority for important operations
  retry_count?: number; // Track retry attempts
}

export function useOfflineSync() {
  const isOnline = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [retryTimeouts, setRetryTimeouts] = useState<NodeJS.Timeout[]>([]);

  // Clear any pending retries on unmount
  useEffect(() => {
    return () => {
      retryTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [retryTimeouts]);

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

  // Exponential backoff for retries
  const scheduleRetry = (item: HabitSyncQueueItem) => {
    const retryCount = item.retry_count || 0;
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      console.error('Max retry attempts reached for sync item:', item);
      return;
    }

    // Exponential backoff with jitter
    const baseDelay = 1000; // 1 second
    const maxJitter = 500; // 0.5 second jitter
    const delay = Math.min(
      30000, // Cap at 30 seconds
      baseDelay * Math.pow(2, retryCount) + Math.random() * maxJitter
    );

    const timeout = setTimeout(() => {
      const updatedItem = {
        ...item,
        retry_count: (retryCount + 1)
      };
      
      // Re-queue the item with updated retry count
      const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
      queue.push(updatedItem);
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
      
      // Try processing again if we're online
      if (isOnline) {
        processSyncQueue();
      }
    }, delay);
    
    setRetryTimeouts(prev => [...prev, timeout]);
  };

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
      const groupedItems: Record<string, HabitSyncQueueItem[]> = {
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
                  scheduleRetry(item);
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
            batch.forEach(item => scheduleRetry(item));
          }
        }
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-sync when coming back online with progressive loading
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
