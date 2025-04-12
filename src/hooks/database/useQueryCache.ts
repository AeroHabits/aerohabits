
import { useState, useCallback } from 'react';
import { useErrorTracking } from '../useErrorTracking';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export function useQueryCache(defaultTTL = 30000) { // 30 seconds default TTL
  const { trackError } = useErrorTracking();
  const cache = new Map<string, CacheEntry<any>>();

  const set = useCallback(<T>(key: string, data: T, ttl = defaultTTL) => {
    const now = Date.now();
    cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
  }, [defaultTTL]);

  const get = useCallback(<T>(key: string): T | null => {
    try {
      const entry = cache.get(key);
      if (!entry) return null;

      if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return null;
      }

      return entry.data as T;
    } catch (error) {
      trackError(error, 'Query Cache Error', { severity: 'low' });
      return null;
    }
  }, [trackError]);

  const invalidate = useCallback((key: string) => {
    cache.delete(key);
  }, []);

  const clear = useCallback(() => {
    cache.clear();
  }, []);

  return {
    set,
    get,
    invalidate,
    clear,
    size: cache.size
  };
}
