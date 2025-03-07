
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocalStorage } from "./useLocalStorage";
import { toast } from "sonner";

export type UserPreference = {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notificationFrequency: 'daily' | 'weekly' | 'never';
  dailyReminderTime?: string;
  contentPreferences: string[];
};

const DEFAULT_PREFERENCES: UserPreference = {
  theme: 'system',
  language: 'en',
  notificationFrequency: 'daily',
  contentPreferences: [],
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreference>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const { loadFromStorage, saveToStorage, IMPORTANCE_LEVELS } = useLocalStorage();
  const PREFS_STORAGE_KEY = 'user_preferences';
  
  // Load preferences from Supabase or fallback to local storage
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Try to get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // User not logged in, try to load from localStorage
          const cachedPrefs = loadFromStorage<UserPreference>(PREFS_STORAGE_KEY);
          if (cachedPrefs) {
            setPreferences(cachedPrefs);
          }
          setIsLoading(false);
          return;
        }
        
        // User is logged in, fetch from Supabase
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          // If no record exists yet, create with defaults
          if (error.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('user_preferences')
              .insert([{ 
                user_id: user.id,
                ...DEFAULT_PREFERENCES
              }]);
              
            if (insertError) throw insertError;
            setPreferences(DEFAULT_PREFERENCES);
          } else {
            throw error;
          }
        } else if (data) {
          // We got preferences from the database
          const userPrefs: UserPreference = {
            theme: data.theme,
            language: data.language,
            notificationFrequency: data.notification_frequency,
            dailyReminderTime: data.daily_reminder_time,
            contentPreferences: data.content_preferences || [],
          };
          
          setPreferences(userPrefs);
          
          // Cache in local storage for offline access
          saveToStorage(PREFS_STORAGE_KEY, userPrefs, IMPORTANCE_LEVELS.HIGH);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
        
        // Fallback to local storage
        const cachedPrefs = loadFromStorage<UserPreference>(PREFS_STORAGE_KEY);
        if (cachedPrefs) {
          setPreferences(cachedPrefs);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPreferences();
  }, []);
  
  // Update preferences
  const updatePreferences = async (newPrefs: Partial<UserPreference>) => {
    try {
      const updatedPreferences = { ...preferences, ...newPrefs };
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update in Supabase
        const { error } = await supabase
          .from('user_preferences')
          .update({
            theme: updatedPreferences.theme,
            language: updatedPreferences.language,
            notification_frequency: updatedPreferences.notificationFrequency,
            daily_reminder_time: updatedPreferences.dailyReminderTime,
            content_preferences: updatedPreferences.contentPreferences,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
          
        if (error) throw error;
      }
      
      // Update local state regardless of login status
      setPreferences(updatedPreferences);
      
      // Always cache locally for offline access
      saveToStorage(PREFS_STORAGE_KEY, updatedPreferences, IMPORTANCE_LEVELS.HIGH);
      
      toast.success("Preferences updated");
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error("Failed to update preferences");
      return false;
    }
  };
  
  return {
    preferences,
    updatePreferences,
    isLoading
  };
}
