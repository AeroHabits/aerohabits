
export interface HabitSyncQueueItem {
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
