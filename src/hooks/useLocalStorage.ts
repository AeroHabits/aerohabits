
import { useStorageOperations } from "./storage/useStorageOperations";
import { useOfflineData } from "./storage/useOfflineData";
import { IMPORTANCE_LEVELS } from "./storage/storageConstants";

export function useLocalStorage() {
  const { loadFromStorage, saveToStorage } = useStorageOperations();
  const { 
    loadOfflineHabits,
    saveOfflineHabits,
    loadOfflineGoals,
    saveOfflineGoals,
    loadOfflineChallenges,
    saveOfflineChallenges
  } = useOfflineData();

  return {
    // Core storage operations
    loadFromStorage,
    saveToStorage,
    
    // Offline data operations
    loadOfflineHabits,
    saveOfflineHabits,
    loadOfflineGoals,
    saveOfflineGoals,
    loadOfflineChallenges,
    saveOfflineChallenges,
    
    // Constants
    IMPORTANCE_LEVELS
  };
}
