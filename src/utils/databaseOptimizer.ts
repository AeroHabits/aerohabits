
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
import { useErrorTracking } from "@/hooks/useErrorTracking";
import { useConnectionPool } from "@/hooks/database/useConnectionPool";
import { useQueryCache } from "@/hooks/database/useQueryCache";
import { TableNames, QueryMethod, QueryOptions } from "./database/types";
import { createQueryBuilder } from "./database/queryBuilder";
import { generateCacheKey } from "./database/cacheUtils";
import { createBatchProcessor } from "./database/batchProcessor";

/**
 * Optimized database query builder with performance monitoring
 * and connection quality-aware features
 */
export function useDatabaseOptimizer() {
  const { measureAsync } = usePerformanceMonitoring();
  const { trackError } = useErrorTracking();
  const { acquireConnection, releaseConnection } = useConnectionPool();
  const queryCache = useQueryCache();
  
  // We don't need to manually clear expired cache entries
  // The useQueryCache hook automatically checks for expired entries on get()
  
  const optimizedQuery = async <T = any>(
    table: TableNames,
    method: QueryMethod = 'select',
    options: QueryOptions = {}
  ): Promise<T> => {
    const {
      cacheTime = 30, // Default 30 seconds
      returnData = true,
      timeout = 10000 // Default 10 seconds
    } = options;
    
    const cacheKey = generateCacheKey(table, method, options);
    
    // Try cache first for SELECT operations
    if (method === 'select') {
      const cached = queryCache.get<T>(cacheKey);
      if (cached) {
        console.log(`Cache hit for ${table}`, { cached: true });
        return cached;
      }
    }

    // Acquire connection from pool
    await acquireConnection();
    
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
      
      // Cache results for SELECT operations
      if (method === 'select' && result) {
        queryCache.set(cacheKey, result, options.cacheTime ? options.cacheTime * 1000 : undefined);
      }

      return result;
    } catch (error) {
      return trackError(error, `Database ${method} on ${table}`, {
        severity: method === 'select' ? 'medium' : 'high',
        context: { table, method, options },
        fallbackData: [] as any
      });
    } finally {
      releaseConnection();
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
