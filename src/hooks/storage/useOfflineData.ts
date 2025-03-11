
import { useCallback } from "react";
import { Habit, Goal, Challenge } from "@/types";
import { STORAGE_KEYS, IMPORTANCE_LEVELS } from "./storageConstants";
import { useStorageOperations } from "./useStorageOperations";

export function useOfflineData() {
  const { loadFromStorage, saveToStorage, IMPORTANCE_LEVELS } = useStorageOperations();

  // Habit operations
  const loadOfflineHabits = useCallback(() => 
    loadFromStorage<Habit[]>(STORAGE_KEYS.HABITS, IMPORTANCE_LEVELS.CRITICAL) || [],
  [loadFromStorage]);
  
  const saveOfflineHabits = useCallback((habits: Habit[]) => 
    saveToStorage(STORAGE_KEYS.HABITS, habits, IMPORTANCE_LEVELS.CRITICAL),
  [saveToStorage]);
  
  // Goal operations
  const loadOfflineGoals = useCallback(() => 
    loadFromStorage<Goal[]>(STORAGE_KEYS.GOALS, IMPORTANCE_LEVELS.HIGH) || [],
  [loadFromStorage]);
  
  const saveOfflineGoals = useCallback((goals: Goal[]) => 
    saveToStorage(STORAGE_KEYS.GOALS, goals, IMPORTANCE_LEVELS.HIGH),
  [saveToStorage]);
  
  // Challenge operations
  const loadOfflineChallenges = useCallback(() => 
    loadFromStorage<Challenge[]>(STORAGE_KEYS.CHALLENGES, IMPORTANCE_LEVELS.NORMAL) || [],
  [loadFromStorage]);
  
  const saveOfflineChallenges = useCallback((challenges: Challenge[]) => 
    saveToStorage(STORAGE_KEYS.CHALLENGES, challenges, IMPORTANCE_LEVELS.NORMAL),
  [saveToStorage]);

  return {
    loadOfflineHabits,
    saveOfflineHabits,
    loadOfflineGoals,
    saveOfflineGoals,
    loadOfflineChallenges,
    saveOfflineChallenges
  };
}
