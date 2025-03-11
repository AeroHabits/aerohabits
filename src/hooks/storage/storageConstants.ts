
export const STORAGE_KEYS = {
  HABITS: 'offlineHabits',
  GOALS: 'offlineGoals',
  CHALLENGES: 'offlineChallenges',
  SYNC_QUEUE: 'syncQueue',
  CACHE_STATS: 'cacheStats',
  LAST_CLEANUP: 'lastCacheCleanup'
} as const;

export const IMPORTANCE_LEVELS = {
  CRITICAL: 3, // User-specific data that must be preserved
  HIGH: 2,     // Important app data
  NORMAL: 1,   // Regular content
  LOW: 0       // Easily regenerated content
};

// Cache for in-memory storage to reduce localStorage reads
export const memoryCache = new Map<string, any>();

export const getTTL = (importance: number) => {
  switch (importance) {
    case IMPORTANCE_LEVELS.CRITICAL:
      return 7 * 24 * 60 * 60 * 1000; // 7 days
    case IMPORTANCE_LEVELS.HIGH:
      return 3 * 24 * 60 * 60 * 1000; // 3 days
    case IMPORTANCE_LEVELS.NORMAL:
      return 24 * 60 * 60 * 1000;     // 24 hours
    case IMPORTANCE_LEVELS.LOW:
      return 6 * 60 * 60 * 1000;      // 6 hours
    default:
      return 24 * 60 * 60 * 1000;     // Default: 24 hours
  }
};

export interface CacheStats {
  [key: string]: {
    accessCount: number;
    lastAccessed: number;
  };
}
