
import { SyncEntityType, SyncAction } from "@/types";

export interface HabitSyncQueueItem {
  id?: string;
  user_id: string;
  habit_id: string;
  action: string;
  data?: any;
  created_at: string;
  synced_at?: string;
  priority?: number;
  retry_count?: number;
}

export const SYNC_QUEUE_KEY = 'habitSyncQueue';
export const BATCH_SIZE = 50;
export const SYNC_DEBOUNCE_MS = 2000;
export const MAX_RETRY_ATTEMPTS = 5;

export interface QueueSyncOptions {
  priority?: number;
}
