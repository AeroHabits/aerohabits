
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocalStorage } from "./useLocalStorage";
import { toast } from "sonner";
import { useErrorTracking } from "./useErrorTracking";

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
  const { trackError } = useErrorTracking();
  const PREFS_STORAGE_KEY = 'user_preferences';
  
  // Load preferences from local storage
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
        
        // Try to load from localStorage first while we wait for DB
        const cachedPrefs = loadFromStorage<UserPreference>(PREFS_STORAGE_KEY);
        if (cachedPrefs) {
          setPreferences(cachedPrefs);
        }
        
        // Check if we can use table-based storage
        try {
          // Attempt to query the preferences table
          const { data, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (error) {
            // If there's an error, we'll just use localStorage
            console.warn('Could not load preferences from database:', error);
          } else if (data) {
            // We got preferences from the database
            const userPrefs: UserPreference = {
              theme: data.theme as 'light' | 'dark' | 'system',
              language: data.language,
              notificationFrequency: data.notification_frequency as 'daily' | 'weekly' | 'never',
              dailyReminderTime: data.daily_reminder_time,
              contentPreferences: data.content_preferences ? 
                (Array.isArray(data.content_preferences) ? 
                  data.content_preferences : []) : [],
            };
            
            setPreferences(userPrefs);
            
            // Cache in local storage for offline access
            saveToStorage(PREFS_STORAGE_KEY, userPrefs, IMPORTANCE_LEVELS.HIGH);
          }
        } catch (dbError) {
          console.warn('Database access error:', dbError);
          // We'll continue with localStorage preferences
        }
      } catch (error) {
        trackError(error as Error, 'loading preferences', { 
          severity: 'low', 
          silent: true 
        });
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
        // Try to update in the database if it exists
        try {
          const { error } = await supabase
            .from('user_preferences')
            .upsert({
              user_id: user.id,
              theme: updatedPreferences.theme,
              language: updatedPreferences.language,
              notification_frequency: updatedPreferences.notificationFrequency,
              daily_reminder_time: updatedPreferences.dailyReminderTime,
              content_preferences: updatedPreferences.contentPreferences,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
            
          if (error) {
            console.warn('Error updating preferences in database:', error);
          }
        } catch (dbError) {
          console.warn('Database update error:', dbError);
          // We'll continue with localStorage updates
        }
      }
      
      // Update local state regardless of login status
      setPreferences(updatedPreferences);
      
      // Always cache locally for offline access
      saveToStorage(PREFS_STORAGE_KEY, updatedPreferences, IMPORTANCE_LEVELS.HIGH);
      
      toast.success("Preferences updated");
      return true;
    } catch (error) {
      trackError(error as Error, 'updating preferences', { 
        severity: 'medium' 
      });
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
