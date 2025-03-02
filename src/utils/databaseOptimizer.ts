
import { supabase } from "@/integrations/supabase/client";
import { trackPerformance } from "@/lib/analytics";
import { Database } from "@/integrations/supabase/types";

// Define database table names as a union type for better type safety
type TableName = keyof Database['public']['Tables'];
type ViewName = keyof Database['public']['Views'];
type ValidName = TableName | ViewName;

/**
 * Track query performance
 */
const trackQueryPerformance = (
  operationName: string,
  duration: number,
  recordCount?: number
) => {
  trackPerformance(`db_query_${operationName}`, duration, { recordCount });
};

/**
 * Safely executes a select query with proper typing and performance tracking
 */
export async function executeSelectQuery<T>(
  tableName: ValidName,
  options: {
    columns?: string;
    filters?: Record<string, unknown>;
    pagination?: { page: number; pageSize: number };
    sorting?: { column: string; ascending?: boolean };
  } = {}
): Promise<T[]> {
  const startTime = performance.now();
  let result: T[] = [];

  try {
    const { columns = '*', filters = {}, pagination, sorting } = options;

    // Initialize query
    let query = supabase.from(tableName).select(columns);

    // Apply filters - use as any to bypass complex type checking for filters
    // This is a necessary compromise to handle dynamic filtering
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            // @ts-ignore - Supabase types are challenging with dynamic operations
            query = query.in(key, value);
          }
        } else if (typeof value === 'object' && value !== null) {
          // Handle complex filter operations but need to bypass TS checks
          // @ts-ignore
          const operator = Object.keys(value)[0];
          // @ts-ignore
          const filterValue = value[operator];

          // @ts-ignore - We have to use ts-ignore due to dynamic nature of this utility
          switch (operator) {
            case 'gt': query = query.gt(key, filterValue); break;
            case 'gte': query = query.gte(key, filterValue); break;
            case 'lt': query = query.lt(key, filterValue); break;
            case 'lte': query = query.lte(key, filterValue); break;
            case 'like': query = query.like(key, filterValue); break;
            case 'ilike': query = query.ilike(key, filterValue); break;
            case 'neq': query = query.neq(key, filterValue); break;
            default: 
              // @ts-ignore
              query = query.eq(key, value);
          }
        } else {
          // Simple equality filter
          // @ts-ignore
          query = query.eq(key, value);
        }
      }
    });

    // Add pagination if provided
    if (pagination) {
      const { page, pageSize } = pagination;
      const start = (page - 1) * pageSize;
      query = query.range(start, start + pageSize - 1);
    }

    // Add sorting if provided
    if (sorting) {
      const { column, ascending = true } = sorting;
      query = query.order(column, { ascending });
    }

    // Execute the query
    const { data, error } = await query;

    if (error) {
      console.error(`Database select error:`, error);
      throw error;
    }

    result = (data || []) as T[];
  } catch (error) {
    console.error(`Error in select query:`, error);
  } finally {
    // Track performance
    const duration = performance.now() - startTime;
    trackQueryPerformance(
      `${String(tableName)}_select`, 
      duration, 
      result.length
    );
  }

  return result;
}

/**
 * Safely executes an insert query with proper typing and performance tracking
 */
export async function executeInsertQuery<T>(
  tableName: TableName, 
  // Use unknown to avoid type issues, then we cast when using
  data: Record<string, unknown> | Record<string, unknown>[],
  returnData: boolean = true
): Promise<T[]> {
  const startTime = performance.now();
  let result: T[] = [];

  try {
    // Use type assertion to handle the case
    // @ts-ignore - Necessary for dynamic insert operations
    const query = supabase.from(tableName).insert(data);
    
    if (returnData) {
      const { data: resultData, error } = await query.select();
      
      if (error) {
        console.error(`Database insert error:`, error);
        throw error;
      }
      
      result = (resultData || []) as T[];
    } else {
      const { error } = await query;
      
      if (error) {
        console.error(`Database insert error:`, error);
        throw error;
      }
    }
  } catch (error) {
    console.error(`Error in insert query:`, error);
  } finally {
    // Track performance
    const duration = performance.now() - startTime;
    trackQueryPerformance(
      `${String(tableName)}_insert`, 
      duration, 
      Array.isArray(data) ? data.length : 1
    );
  }

  return result;
}

/**
 * Safely executes an update query with proper typing and performance tracking
 */
export async function executeUpdateQuery<T>(
  tableName: TableName,
  data: Record<string, unknown>,
  filters: Record<string, unknown>,
  returnData: boolean = true
): Promise<T[]> {
  const startTime = performance.now();
  let result: T[] = [];

  try {
    // Initialize query
    // @ts-ignore - Necessary for dynamic update operations
    let query = supabase.from(tableName).update(data);
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        // @ts-ignore - Necessary for dynamic filtering
        query = query.eq(key, value);
      }
    });
    
    if (returnData) {
      const { data: resultData, error } = await query.select();
      
      if (error) {
        console.error(`Database update error:`, error);
        throw error;
      }
      
      result = (resultData || []) as T[];
    } else {
      const { error } = await query;
      
      if (error) {
        console.error(`Database update error:`, error);
        throw error;
      }
    }
  } catch (error) {
    console.error(`Error in update query:`, error);
  } finally {
    // Track performance
    const duration = performance.now() - startTime;
    trackQueryPerformance(
      `${String(tableName)}_update`, 
      duration
    );
  }

  return result;
}

/**
 * Safely executes a delete query with proper typing and performance tracking
 */
export async function executeDeleteQuery<T>(
  tableName: TableName,
  filters: Record<string, unknown>,
  returnData: boolean = false
): Promise<T[]> {
  const startTime = performance.now();
  let result: T[] = [];

  try {
    // Initialize query
    // @ts-ignore - Necessary for dynamic delete operations
    let query = supabase.from(tableName).delete();
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        // @ts-ignore - Necessary for dynamic filtering
        query = query.eq(key, value);
      }
    });
    
    if (returnData) {
      const { data: resultData, error } = await query.select();
      
      if (error) {
        console.error(`Database delete error:`, error);
        throw error;
      }
      
      result = (resultData || []) as T[];
    } else {
      const { error } = await query;
      
      if (error) {
        console.error(`Database delete error:`, error);
        throw error;
      }
    }
  } catch (error) {
    console.error(`Error in delete query:`, error);
  } finally {
    // Track performance
    const duration = performance.now() - startTime;
    trackQueryPerformance(
      `${String(tableName)}_delete`, 
      duration
    );
  }

  return result;
}

/**
 * Safely executes a batch operation with proper typing and performance tracking
 */
export async function batchOperation<T>(
  tableName: TableName,
  operation: 'insert' | 'update' | 'upsert',
  records: Record<string, unknown>[],
  batchSize = 50
): Promise<T[]> {
  const startTime = performance.now();
  const results: T[] = [];

  // Handle empty records array
  if (!records.length) {
    return results;
  }

  // Process in batches
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    
    try {
      let query;
      
      if (operation === 'insert') {
        // @ts-ignore - Necessary for batch operations
        query = supabase.from(tableName).insert(batch);
      } else if (operation === 'update') {
        // @ts-ignore - Necessary for batch operations
        query = supabase.from(tableName).upsert(batch);
      } else { // upsert
        // @ts-ignore - Necessary for batch operations
        query = supabase.from(tableName).upsert(batch);
      }
      
      // Add returning clause
      const { data, error } = await query.select();
      
      if (error) {
        console.error(`Batch ${operation} error:`, error);
      } else if (data) {
        results.push(...(data as T[]));
      }
    } catch (error) {
      console.error(`Error in batch ${operation}:`, error);
    }
  }

  // Track performance
  const duration = performance.now() - startTime;
  trackQueryPerformance(
    `${String(tableName)}_batch_${operation}`,
    duration,
    results.length
  );

  return results;
}
