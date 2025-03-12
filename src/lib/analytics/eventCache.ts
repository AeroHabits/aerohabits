
// Memory cache to avoid duplicate events in short time periods
export const eventCache = new Map<string, number>();
export const EVENT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Clean up event cache periodically
setInterval(() => {
  const now = Date.now();
  eventCache.forEach((timestamp, key) => {
    if (now - timestamp > EVENT_CACHE_DURATION) {
      eventCache.delete(key);
    }
  });
}, 15 * 60 * 1000); // Clean every 15 minutes

// Check for duplicate events if deduplicationKey is provided
export const checkDuplicateEvent = (
  category: string,
  action: string,
  deduplicationKey?: string,
  deduplicationWindow: number = EVENT_CACHE_DURATION
): boolean => {
  if (!deduplicationKey) return false;
  
  const cacheKey = `${category}:${action}:${deduplicationKey}`;
  const lastTimestamp = eventCache.get(cacheKey);
  
  if (lastTimestamp && Date.now() - lastTimestamp < deduplicationWindow) {
    return true; // Is a duplicate event
  }
  
  // Update event cache
  eventCache.set(cacheKey, Date.now());
  return false;
};
