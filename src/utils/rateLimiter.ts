
import { useState, useEffect, useRef, useCallback } from 'react';

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  blockDuration?: number;
}

interface RateLimitState {
  requests: { timestamp: number }[];
  blocked: boolean;
  blockedUntil: number | null;
}

/**
 * Custom hook for client-side rate limiting to prevent API abuse
 */
export function useRateLimiter(options: RateLimitOptions) {
  const {
    maxRequests = 50,
    windowMs = 60000, // 1 minute
    blockDuration = 120000 // 2 minutes
  } = options;
  
  const [state, setState] = useState<RateLimitState>({
    requests: [],
    blocked: false,
    blockedUntil: null
  });
  
  // Use localStorage to persist rate limiting across page refreshes
  const storageKey = `rate_limiter_${maxRequests}_${windowMs}`;
  
  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
      }
    } catch (error) {
      console.error("Error loading rate limiter state from localStorage:", error);
    }
  }, [storageKey]);
  
  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving rate limiter state to localStorage:", error);
    }
  }, [state, storageKey]);
  
  // Clean up old requests periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setState(prevState => {
        const now = Date.now();
        
        // Clean up expired requests
        const validRequests = prevState.requests.filter(
          req => now - req.timestamp < windowMs
        );
        
        // Check if block should be lifted
        let blocked = prevState.blocked;
        let blockedUntil = prevState.blockedUntil;
        
        if (blocked && blockedUntil && now > blockedUntil) {
          blocked = false;
          blockedUntil = null;
        }
        
        if (validRequests.length === prevState.requests.length && 
            blocked === prevState.blocked && 
            blockedUntil === prevState.blockedUntil) {
          return prevState; // No changes needed
        }
        
        return {
          requests: validRequests,
          blocked,
          blockedUntil
        };
      });
    }, Math.min(windowMs / 4, 15000)); // Clean up every quarter window or 15 seconds max
    
    return () => clearInterval(cleanupInterval);
  }, [windowMs]);
  
  // Track a new request and determine if it should be allowed
  const checkLimit = useCallback(() => {
    const now = Date.now();
    
    // If currently blocked, reject the request
    if (state.blocked) {
      if (state.blockedUntil && now > state.blockedUntil) {
        // Block period is over, unblock
        setState(prev => ({
          ...prev,
          blocked: false,
          blockedUntil: null
        }));
        return true; // Allow this request after unblocking
      }
      
      const remainingBlockMs = state.blockedUntil ? state.blockedUntil - now : 0;
      console.warn(`Rate limit exceeded. Blocked for ${Math.ceil(remainingBlockMs / 1000)}s more.`);
      return false;
    }
    
    // Clean up old requests
    const validRequests = state.requests.filter(
      req => now - req.timestamp < windowMs
    );
    
    // Check if adding this request would exceed the limit
    if (validRequests.length >= maxRequests) {
      // Implement blocking
      const blockedUntil = now + blockDuration;
      
      setState({
        requests: validRequests,
        blocked: true,
        blockedUntil
      });
      
      console.warn(`Rate limit exceeded. Blocked for ${blockDuration / 1000}s.`);
      return false;
    }
    
    // Add the new request
    setState({
      requests: [...validRequests, { timestamp: now }],
      blocked: false,
      blockedUntil: null
    });
    
    return true;
  }, [state, maxRequests, windowMs, blockDuration]);
  
  // Wrapped version for async operations
  const limitAsync = useCallback(async <T>(operation: () => Promise<T>): Promise<T | null> => {
    if (!checkLimit()) {
      throw new Error("Rate limit exceeded");
    }
    
    return operation();
  }, [checkLimit]);
  
  return {
    checkLimit,
    limitAsync,
    remaining: maxRequests - state.requests.length,
    isBlocked: state.blocked,
    blockedUntil: state.blockedUntil
  };
}
