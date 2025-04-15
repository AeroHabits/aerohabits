
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
import { useErrorTracking } from "@/hooks/useErrorTracking";
import { useConnectionPool } from "@/hooks/database/useConnectionPool";
import { useQueryCache } from "@/hooks/database/useQueryCache";
import { TableNames, QueryMethod, QueryOptions } from "./database/types";
import { createQueryBuilder } from "./database/queryBuilder";
import { generateCacheKey } from "./database/cacheUtils";
import { createBatchProcessor } from "./database/batchProcessor";

// Optimized for mobile performance
const MOBILE_CACHE_DURATION = 60; // 60 seconds cache for mobile

/**
 * Optimized database query builder with performance monitoring
 * and connection quality-aware features specifically tuned for mobile
 */
export function useDatabaseOptimizer() {
  const { measureAsync } = usePerformanceMonitoring();
  const { trackError } = useErrorTracking();
  const { acquireConnection, releaseConnection } = useConnectionPool();
  const queryCache = useQueryCache();
  
  // Detect mobile platform for optimizations
  const isMobile = typeof navigator !== 'undefined' && 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // iOS-specific optimizations
  const isIOS = typeof navigator !== 'undefined' && 
    (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
  
  const optimizedQuery = async <T = any>(
    table: TableNames,
    method: QueryMethod = 'select',
    options: QueryOptions = {}
  ): Promise<T> => {
    const {
      cacheTime = isMobile ? MOBILE_CACHE_DURATION : 30, // Longer cache for mobile
      returnData = true,
      timeout = isMobile ? 15000 : 10000 // Longer timeout for mobile networks
    } = options;
    
    const cacheKey = generateCacheKey(table, method, options);
    
    // Try cache first for SELECT operations - prioritize cache on mobile
    if (method === 'select') {
      const cached = queryCache.get<T>(cacheKey);
      if (cached) {
        // Skip logging on mobile to reduce overhead
        if (!isMobile) {
          console.log(`Cache hit for ${table}`, { cached: true });
        }
        return cached;
      }
    }

    // Skip connection pooling on iOS for better performance
    if (!isIOS) {
      await acquireConnection();
    }
    
    try {
      // Create the query builder
      const queryBuilder = createQueryBuilder(table, method, options);
      
      // Execute the query with performance monitoring
      const result = await measureAsync(`database.${table}.${method}`, async () => {
        const { data, error } = await queryBuilder;
        
        if (error) {
          throw error;
        }
        
        return data;
      }, { table, method, hasFilters: Object.keys(options.filters || {}).length > 0 });
      
      // Cache results for SELECT operations with longer cache time for mobile
      if (method === 'select' && result) {
        queryCache.set(cacheKey, result, 
          options.cacheTime ? options.cacheTime * 1000 : 
          (isMobile ? MOBILE_CACHE_DURATION * 1000 : undefined));
      }

      return result;
    } catch (error) {
      // On mobile, only track critical errors to reduce analytics noise
      const severity = isMobile ? 
        (method === 'select' ? 'low' : 'medium') : 
        (method === 'select' ? 'medium' : 'high');
      
      return trackError(error, `Database ${method} on ${table}`, {
        severity,
        context: { table, method, options },
        fallbackData: [] as any
      });
    } finally {
      if (!isIOS) {
        releaseConnection();
      }
    }
  };
  
  const batchProcess = createBatchProcessor(optimizedQuery);
  
  return {
    query: optimizedQuery,
    batchProcess,
    clearCache: queryCache.clear,
    invalidateCache: queryCache.invalidate
  };
}
