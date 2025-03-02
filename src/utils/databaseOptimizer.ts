
import { supabase } from "@/integrations/supabase/client";
import { trackPerformance } from "@/lib/analytics";
import { Database } from "@/integrations/supabase/types";

// Define valid table names to ensure type safety
type TableName = keyof Database['public']['Tables'];
type ViewName = keyof Database['public']['Views'];

// Track query performance
const trackQueryPerformance = (
  operationName: string,
  duration: number,
  recordCount?: number
) => {
  trackPerformance(`db_query_${operationName}`, duration, { recordCount });
};

// Type-safe function for selecting data from specific tables
export async function executeSelectQuery<T>(
  tableName: TableName | ViewName,
  options: {
    columns?: string;
    filters?: Record<string, any>;
    pagination?: { page: number; pageSize: number };
    sorting?: { column: string; ascending?: boolean };
  } = {}
): Promise<T[]> {
  const startTime = performance.now();
  let result: T[] = [];

  try {
    const {
      columns = '*',
      filters = {},
      pagination,
      sorting,
    } = options;

    // Initialize query
    let query = supabase.from(tableName).select(columns);

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value) && value.length > 0) {
          query = query.in(key, value);
        } else if (typeof value === 'object' && value !== null) {
          // Handle complex filter operations
          const operator = Object.keys(value)[0];
          const filterValue = value[operator];

          switch (operator) {
            case 'gt': query = query.gt(key, filterValue); break;
            case 'gte': query = query.gte(key, filterValue); break;
            case 'lt': query = query.lt(key, filterValue); break;
            case 'lte': query = query.lte(key, filterValue); break;
            case 'like': query = query.like(key, filterValue); break;
            case 'ilike': query = query.ilike(key, filterValue); break;
            case 'neq': query = query.neq(key, filterValue); break;
            default: query = query.eq(key, value);
          }
        } else {
          // Simple equality filter
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

// Type-safe insert function
export async function executeInsertQuery<T>(
  tableName: TableName,
  data: Record<string, any> | Record<string, any>[],
  returnData: boolean = true
): Promise<T[]> {
  const startTime = performance.now();
  let result: T[] = [];

  try {
    // Use type assertion to handle the case
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

// Type-safe update function
export async function executeUpdateQuery<T>(
  tableName: TableName,
  data: Record<string, any>,
  filters: Record<string, any>,
  returnData: boolean = true
): Promise<T[]> {
  const startTime = performance.now();
  let result: T[] = [];

  try {
    // Initialize query
    let query = supabase.from(tableName).update(data);
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
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

// Type-safe delete function
export async function executeDeleteQuery<T>(
  tableName: TableName,
  filters: Record<string, any>,
  returnData: boolean = false
): Promise<T[]> {
  const startTime = performance.now();
  let result: T[] = [];

  try {
    // Initialize query
    let query = supabase.from(tableName).delete();
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
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

// Function to batch insert/update records for better performance
export async function batchOperation<T>(
  tableName: TableName,
  operation: 'insert' | 'update' | 'upsert',
  records: Record<string, any>[],
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
        query = supabase.from(tableName).insert(batch);
      } else if (operation === 'update') {
        // For update, we assume records have an id field
        query = supabase.from(tableName).upsert(batch);
      } else { // upsert
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
