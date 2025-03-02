
import { supabase } from "@/integrations/supabase/client";
import { trackPerformance } from "@/lib/analytics";

// Track query performance
const trackQueryPerformance = (
  operationName: string,
  duration: number,
  recordCount?: number
) => {
  trackPerformance(`db_query_${operationName}`, duration, { recordCount });
};

// Execute optimized database queries with performance tracking
export async function optimizeSupabaseQuery<T>(
  tableName: string,
  queryType: 'select' | 'insert' | 'update' | 'delete',
  options: {
    columns?: string;
    filters?: Record<string, any>;
    pagination?: { page: number; pageSize: number };
    sorting?: { column: string; ascending?: boolean };
    data?: Record<string, any>;
    returnData?: boolean;
  } = {}
): Promise<T[]> {
  const startTime = performance.now();
  let result;

  try {
    const {
      columns = '*',
      filters = {},
      pagination,
      sorting,
      data,
      returnData = true,
    } = options;

    // Initialize query based on operation type
    let query;

    switch (queryType) {
      case 'select':
        query = supabase.from(tableName).select(columns);
        break;
      case 'insert':
        query = supabase.from(tableName).insert(data || {});
        if (returnData) {
          query = query.select(columns);
        }
        break;
      case 'update':
        query = supabase.from(tableName).update(data || {});
        if (returnData) {
          query = query.select(columns);
        }
        break;
      case 'delete':
        query = supabase.from(tableName).delete();
        if (returnData) {
          query = query.select(columns);
        }
        break;
    }

    // Apply filters based on operation type
    if (queryType !== 'insert' && Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          query = query.in(key, value);
        } else if (typeof value === 'object' && value !== null) {
          // Handle complex filter operations
          const operator = Object.keys(value)[0];
          const filterValue = value[operator];

          if (operator === 'gt') query = query.gt(key, filterValue);
          else if (operator === 'gte') query = query.gte(key, filterValue);
          else if (operator === 'lt') query = query.lt(key, filterValue);
          else if (operator === 'lte') query = query.lte(key, filterValue);
          else if (operator === 'like') query = query.like(key, filterValue);
          else if (operator === 'ilike') query = query.ilike(key, filterValue);
          else if (operator === 'neq') query = query.neq(key, filterValue);
        } else {
          // Simple equality filter
          query = query.eq(key, value);
        }
      });
    }

    // Add pagination if provided
    if (pagination && queryType === 'select') {
      const { page, pageSize } = pagination;
      const start = (page - 1) * pageSize;
      query = query.range(start, start + pageSize - 1);
    }

    // Add sorting if provided
    if (sorting && queryType === 'select') {
      const { column, ascending = true } = sorting;
      query = query.order(column, { ascending });
    }

    // Execute the query
    const { data: resultData, error } = await query;

    if (error) {
      console.error(`Database ${queryType} error:`, error);
      throw error;
    }

    result = resultData || [];
  } catch (error) {
    console.error(`Error in optimized ${queryType} query:`, error);
    result = [];
  } finally {
    // Track performance
    const duration = performance.now() - startTime;
    trackQueryPerformance(
      `${tableName}_${queryType}`, 
      duration, 
      Array.isArray(result) ? result.length : 0
    );
  }

  return result as T[];
}

// Function to batch insert/update records for better performance
export async function batchOperation<T>(
  tableName: string,
  operation: 'insert' | 'update' | 'upsert',
  records: Record<string, any>[],
  batchSize = 50
): Promise<T[]> {
  const startTime = performance.now();
  const results: any[] = [];

  // Process in batches
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    
    try {
      let query;
      
      if (operation === 'insert') {
        query = supabase.from(tableName).insert(batch);
      } else if (operation === 'update') {
        // For update, we assume records have an id field
        // This is simplified - in a real app, you'd need to handle updates by primary key
        query = supabase.from(tableName).upsert(batch);
      } else { // upsert
        query = supabase.from(tableName).upsert(batch);
      }
      
      // Add returning clause
      query = query.select();
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`Batch ${operation} error:`, error);
      } else if (data) {
        results.push(...data);
      }
    } catch (error) {
      console.error(`Error in batch ${operation}:`, error);
    }
  }

  // Track performance
  const duration = performance.now() - startTime;
  trackQueryPerformance(
    `${tableName}_batch_${operation}`,
    duration,
    results.length
  );

  return results as T[];
}
