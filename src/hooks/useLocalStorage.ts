
import { useState } from "react";
import { Habit, Goal, Challenge } from "@/types";

const STORAGE_KEYS = {
  HABITS: 'offlineHabits',
  GOALS: 'offlineGoals',
  CHALLENGES: 'offlineChallenges',
  SYNC_QUEUE: 'syncQueue'
} as const;

export function useLocalStorage() {
  // Generic load function with expiration
  const loadFromStorage = <T>(key: string): T | null => {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    try {
      const { data, timestamp } = JSON.parse(stored);
      // Clear cache if older than 24 hours
      if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  };

  // Generic save function with timestamp
  const saveToStorage = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  };

  // Specific functions for each data type
  const loadOfflineHabits = () => loadFromStorage<Habit[]>(STORAGE_KEYS.HABITS) || [];
  const saveOfflineHabits = (habits: Habit[]) => saveToStorage(STORAGE_KEYS.HABITS, habits);
  
  const loadOfflineGoals = () => loadFromStorage<Goal[]>(STORAGE_KEYS.GOALS) || [];
  const saveOfflineGoals = (goals: Goal[]) => saveToStorage(STORAGE_KEYS.GOALS, goals);
  
  const loadOfflineChallenges = () => loadFromStorage<Challenge[]>(STORAGE_KEYS.CHALLENGES) || [];
  const saveOfflineChallenges = (challenges: Challenge[]) => saveToStorage(STORAGE_KEYS.CHALLENGES, challenges);

  return {
    loadFromStorage,
    saveToStorage,
    loadOfflineHabits,
    saveOfflineHabits,
    loadOfflineGoals,
    saveOfflineGoals,
    loadOfflineChallenges,
    saveOfflineChallenges
  };
}
