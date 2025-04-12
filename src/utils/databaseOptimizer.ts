
import { supabase } from "@/integrations/supabase/client";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
import { useErrorTracking } from "@/hooks/useErrorTracking";
import { useConnectionPool } from "@/hooks/database/useConnectionPool";
import { useQueryCache } from "@/hooks/database/useQueryCache";
import { PostgrestQueryBuilder } from "@supabase/postgrest-js";

// Type definitions for the query builder
type TableNames = 'habits' | 'goals' | 'challenges' | 'profiles' | 'habit_categories';
type QueryMethod = 'select' | 'insert' | 'update' | 'delete' | 'upsert';
type OrderDirection = 'asc' | 'desc';

interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  filters?: Record<string, any>;
  select?: string;
  batchSize?: number;
  relations?: string[];
  cacheTime?: number; // in seconds
  returnData?: boolean;
  timeout?: number; // in milliseconds
}

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
  
  // Generate a cache key from query parameters
  const generateCacheKey = (
    table: TableNames, 
    method: QueryMethod, 
    options: QueryOptions
  ) => {
    return `${table}:${method}:${JSON.stringify(options)}`;
  };
  
  const optimizedQuery = async <T = any>(
    table: TableNames,
    method: QueryMethod = 'select',
    options: QueryOptions = {}
  ): Promise<T> => {
    const {
      limit = 100,
      offset = 0,
      orderBy = 'created_at',
      orderDirection = 'desc',
      filters = {},
      select = '*',
      batchSize = 100,
      relations = [],
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
      let queryBuilder;
      
      // Set up query based on method
      switch (method) {
        case 'select': {
          queryBuilder = supabase.from(table).select(select);
          
          // Add relations if specified
          if (relations.length > 0) {
            const relationsStr = relations.map(r => `, ${r}(*)`).join('');
            queryBuilder = supabase.from(table).select(`${select}${relationsStr}`);
          }
          
          // Apply filters
          Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              queryBuilder = queryBuilder.in(key, value);
            } else if (value !== null && typeof value === 'object') {
              // Handle special operators like gt, lt, etc.
              Object.entries(value).forEach(([op, val]) => {
                if (op === 'gt') queryBuilder = queryBuilder.gt(key, val as any);
                else if (op === 'gte') queryBuilder = queryBuilder.gte(key, val as any);
                else if (op === 'lt') queryBuilder = queryBuilder.lt(key, val as any);
                else if (op === 'lte') queryBuilder = queryBuilder.lte(key, val as any);
                else if (op === 'like') queryBuilder = queryBuilder.like(key, `%${val}%`);
                else if (op === 'ilike') queryBuilder = queryBuilder.ilike(key, `%${val}%`);
                else if (op === 'neq') queryBuilder = queryBuilder.neq(key, val as any);
              });
            } else {
              queryBuilder = queryBuilder.eq(key, value);
            }
          });
          
          // Add pagination
          queryBuilder = queryBuilder
            .order(orderBy, { ascending: orderDirection === 'asc' })
            .range(offset, offset + limit - 1);
          
          break;
        }
        
        case 'insert': {
          queryBuilder = supabase.from(table).insert(filters as any);
          break;
        }
        
        case 'update': {
          // Extract the update data and conditions
          const { conditions, ...updateData } = filters;
          queryBuilder = supabase.from(table).update(updateData as any);
          
          // Apply conditions if provided
          if (conditions) {
            Object.entries(conditions).forEach(([key, value]) => {
              queryBuilder = queryBuilder.eq(key, value);
            });
          }
          break;
        }
        
        case 'delete': {
          queryBuilder = supabase.from(table).delete();
          
          Object.entries(filters).forEach(([key, value]) => {
            queryBuilder = queryBuilder.eq(key, value);
          });
          break;
        }
        
        case 'upsert': {
          queryBuilder = supabase.from(table).upsert(filters as any);
          break;
        }
      }
      
      // Execute the query with performance monitoring
      const result = await measureAsync(`database.${table}.${method}`, async () => {
        const { data, error } = await queryBuilder;
        
        if (error) {
          throw error;
        }
        
        return data;
      }, { table, method, hasFilters: Object.keys(filters).length > 0 });
      
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
  
  const batchProcess = async <T = any>(
    table: TableNames,
    method: QueryMethod,
    items: Record<string, any>[],
    options: Omit<QueryOptions, 'filters'> = {}
  ): Promise<T[]> => {
    const { batchSize = 50 } = options;
    const results: any[] = [];
    
    // Process in batches
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      // Handle different methods
      if (method === 'insert' || method === 'upsert') {
        const result = await optimizedQuery(table, method, {
          ...options,
          filters: batch as any
        });
        
        if (result) {
          results.push(...result);
        }
      } else {
        // For update and delete, process one by one but in parallel
        const batchPromises = batch.map(item => 
          optimizedQuery(table, method, {
            ...options,
            filters: item
          })
        );
        
        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach(result => {
          if (result) {
            results.push(result);
          }
        });
      }
    }
    
    return results as T[];
  };
  
  return {
    query: optimizedQuery,
    batchProcess,
    clearCache: queryCache.clear,
    invalidateCache: queryCache.invalidate
  };
}
