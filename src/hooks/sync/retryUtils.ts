
import { useState } from 'react';
import { HabitSyncQueueItem } from './syncTypes';
import { SYNC_QUEUE_KEY, MAX_RETRY_ATTEMPTS, BACKOFF_CONFIG } from './syncConstants';

export function useRetryLogic() {
  const [retryTimeouts, setRetryTimeouts] = useState<NodeJS.Timeout[]>([]);

  // Exponential backoff for retries
  const scheduleRetry = (item: HabitSyncQueueItem, processSyncQueue: () => void) => {
    const retryCount = item.retry_count || 0;
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      console.error('Max retry attempts reached for sync item:', item);
      return;
    }

    // Exponential backoff with jitter
    const delay = Math.min(
      BACKOFF_CONFIG.MAX_DELAY,
      BACKOFF_CONFIG.BASE_DELAY * Math.pow(2, retryCount) + 
      Math.random() * BACKOFF_CONFIG.MAX_JITTER
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
      
      // Try processing again
      processSyncQueue();
    }, delay);
    
    setRetryTimeouts(prev => [...prev, timeout]);
  };

  return {
    retryTimeouts,
    scheduleRetry
  };
}
