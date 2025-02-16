
export interface User {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
}

export interface HabitCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  user_id: string;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  streak: number;
  completed: boolean;
  category_id?: string;
  created_at: string;
  updated_at: string;
  streak_broken?: boolean;
  last_streak?: number;
  habit_categories?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_date?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  created_at: string;
  updated_at: string;
}

export interface HabitNotification {
  id: string;
  habit_id: string;
  user_id: string;
  reminder_time: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
  total_points?: number;
  current_difficulty?: string;
  current_challenge_id?: string;
  push_notifications?: boolean;
  email_notifications?: boolean;
  has_seen_tour?: boolean;
  stripe_customer_id?: string;
  subscription_status?: string;
  subscription_id?: string;
  is_subscribed?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'master';
  category?: string;
  duration_days: number;
  reward_points?: number;
  completion_criteria?: string;
  created_at: string;
  updated_at: string;
  milestones?: any[];
  tips?: string[];
  is_premium?: boolean;
  sequence_order: number;
  motivation_text?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price_id: string;
  amount: number;
  currency: string;
  interval: string;
  features?: any;
  is_active?: boolean;
  created_at: string;
}

export type SyncEntityType = 'habit' | 'goal' | 'challenge';
export type SyncAction = 'add' | 'update' | 'delete';

export interface SyncQueueItem {
  id?: string;
  user_id: string;
  entity_id: string;
  entity_type: SyncEntityType;
  action: SyncAction;
  data?: any;
  created_at: string;
  synced_at?: string;
}
