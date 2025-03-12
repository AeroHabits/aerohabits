
import { supabase } from "@/integrations/supabase/client";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
import { useErrorTracking } from "@/hooks/useErrorTracking";

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
  
  // In-memory query cache
  const queryCache = new Map<string, { data: any; timestamp: number; cacheTime: number }>();
  
  // Clear expired cache entries
  const clearExpiredCache = () => {
    const now = Date.now();
    queryCache.forEach((value, key) => {
      if (now - value.timestamp > value.cacheTime * 1000) {
        queryCache.delete(key);
      }
    });
  };
  
  // Run cache cleanup periodically
  setInterval(clearExpiredCache, 60000); // Every minute
  
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
    
    // Check cache for read queries
    const cacheKey = generateCacheKey(table, method, options);
    if (method === 'select' && cacheTime > 0) {
      const cached = queryCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp < cached.cacheTime * 1000)) {
        console.log(`Using cached data for ${table}`, { cached: true });
        return cached.data;
      }
    }
    
    // Set up abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      let query = supabase.from(table);
      
      // Set up query based on method
      switch (method) {
        case 'select':
          query = query.select(select);
          
          // Add relations if specified
          if (relations.length > 0) {
            query = query.select(
              `${select}${relations.map(r => `, ${r}(*)`).join('')}`
            );
          }
          
          // Apply filters
          Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              query = query.in(key, value);
            } else if (value !== null && typeof value === 'object') {
              // Handle special operators like gt, lt, etc.
              Object.entries(value).forEach(([op, val]) => {
                if (op === 'gt') query = query.gt(key, val);
                else if (op === 'gte') query = query.gte(key, val);
                else if (op === 'lt') query = query.lt(key, val);
                else if (op === 'lte') query = query.lte(key, val);
                else if (op === 'like') query = query.like(key, `%${val}%`);
                else if (op === 'ilike') query = query.ilike(key, `%${val}%`);
                else if (op === 'neq') query = query.neq(key, val);
              });
            } else {
              query = query.eq(key, value);
            }
          });
          
          // Add pagination
          query = query
            .order(orderBy, { ascending: orderDirection === 'asc' })
            .range(offset, offset + limit - 1);
          
          break;
        
        case 'insert':
          query = query.insert(filters);
          break;
        
        case 'update':
          // Extract the update data and conditions
          const { conditions, ...updateData } = filters;
          query = query.update(updateData);
          
          // Apply conditions if provided
          if (conditions) {
            Object.entries(conditions).forEach(([key, value]) => {
              query = query.eq(key, value);
            });
          }
          break;
        
        case 'delete':
          Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
          break;
        
        case 'upsert':
          query = query.upsert(filters);
          break;
      }
      
      // Execute the query with performance monitoring
      const result = await measureAsync(`database.${table}.${method}`, async () => {
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        return data;
      }, { table, method, hasFilters: Object.keys(filters).length > 0 });
      
      // Cache the result for read queries
      if (method === 'select' && cacheTime > 0 && result) {
        queryCache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
          cacheTime
        });
      }
      
      return returnData ? result : null as any;
    } catch (error: any) {
      return trackError(error, `Database ${method} on ${table}`, {
        severity: method === 'select' ? 'medium' : 'high',
        context: { table, method, options },
        fallbackData: [] as any
      });
    } finally {
      clearTimeout(timeoutId);
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
          filters: batch
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
    batchProcess
  };
}
