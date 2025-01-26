export interface User {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  streak: number;
  completed: boolean;
  category?: string;
  created_at: string;
  updated_at: string;
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
}