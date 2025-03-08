
import { useState, useEffect } from "react";
import { HabitSyncQueueItem, MAX_RETRY_ATTEMPTS, SYNC_QUEUE_KEY } from "./syncTypes";

export function useSyncRetry() {
  const [retryTimeouts, setRetryTimeouts] = useState<NodeJS.Timeout[]>([]);

  // Clear any pending retries on unmount
  useEffect(() => {
    return () => {
      retryTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [retryTimeouts]);

  // Exponential backoff for retries
  const scheduleRetry = (
    item: HabitSyncQueueItem, 
    processSyncQueue: () => void
  ) => {
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
      processSyncQueue();
    }, delay);
    
    setRetryTimeouts(prev => [...prev, timeout]);
  };

  return { scheduleRetry };
}
