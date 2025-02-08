
import { useState } from "react";
import { Habit } from "@/types";

const HABITS_STORAGE_KEY = 'offlineHabits';

export function useLocalStorage() {
  // Load habits from local storage with expiration
  const loadOfflineHabits = () => {
    const stored = localStorage.getItem(HABITS_STORAGE_KEY);
    if (!stored) return [];
    
    try {
      const { habits, timestamp } = JSON.parse(stored);
      // Clear cache if older than 24 hours
      if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(HABITS_STORAGE_KEY);
        return [];
      }
      return habits;
    } catch {
      return [];
    }
  };

  // Save habits to local storage with timestamp
  const saveOfflineHabits = (habits: Habit[]) => {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify({
      habits,
      timestamp: Date.now()
    }));
  };

  return {
    loadOfflineHabits,
    saveOfflineHabits
  };
}
