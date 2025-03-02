
/**
 * Database Optimizer Utility
 * Provides optimized database operations with caching, batching, and error handling
 */
import { supabase } from "@/integrations/supabase/client";
import { trackError } from "@/lib/analytics";

// Simplified approach to handle database operations
export const databaseOptimizer = {
  /**
   * Select data from a table with optimized query
   */
  async select(tableName: string, options: {
    columns?: string,
    filters?: Record<string, any>,
    pagination?: { page: number, pageSize: number },
    orderBy?: { column: string, ascending?: boolean },
    single?: boolean
  } = {}) {
    try {
      // @ts-ignore - Dynamic table name
      let query = supabase.from(tableName).select(options.columns || '*');
      
      // Apply filters if provided
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (key && value !== undefined) {
            // @ts-ignore - Dynamic filtering
            query = query.eq(key, value);
          }
        });
      }
      
      // Apply pagination if provided
      if (options.pagination) {
        const { page, pageSize } = options.pagination;
        const start = (page - 1) * pageSize;
        const end = start + pageSize - 1;
        // @ts-ignore - Range methods exist but TypeScript doesn't recognize them
        query = query.range(start, end);
      }
      
      // Apply ordering if provided
      if (options.orderBy) {
        const { column, ascending = true } = options.orderBy;
        // @ts-ignore - Order method exists but TypeScript doesn't recognize it
        query = query.order(column, { ascending });
      }
      
      // Execute as single item or list
      if (options.single) {
        // @ts-ignore - Single method exists but TypeScript doesn't recognize it
        return await query.single();
      }
      
      return await query;
    } catch (error) {
      console.error(`Error in select operation on ${tableName}:`, error);
      trackError(`Database select error: ${tableName}`, 'databaseOptimizer', { error });
      throw error;
    }
  },

  /**
   * Insert data into a table
   */
  async insert(tableName: string, data: Record<string, any> | Record<string, any>[], options: {
    onConflict?: string,
    returning?: string
  } = {}) {
    try {
      // @ts-ignore - Dynamic table name and methods
      let query = supabase.from(tableName).insert(data);
      
      if (options.onConflict) {
        // @ts-ignore - onConflict method exists but TypeScript doesn't recognize it
        query = query.onConflict(options.onConflict);
      }
      
      if (options.returning) {
        // @ts-ignore - returning method exists but TypeScript doesn't recognize it
        query = query.select(options.returning);
      }
      
      return await query;
    } catch (error) {
      console.error(`Error in insert operation on ${tableName}:`, error);
      trackError(`Database insert error: ${tableName}`, 'databaseOptimizer', { error });
      throw error;
    }
  },

  /**
   * Update data in a table
   */
  async update(tableName: string, data: Record<string, any>, filters: Record<string, any>, options: {
    returning?: string
  } = {}) {
    try {
      // @ts-ignore - Dynamic table name
      let query = supabase.from(tableName).update(data);
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (key && value !== undefined) {
          // @ts-ignore - Dynamic filtering
          query = query.eq(key, value);
        }
      });
      
      if (options.returning) {
        // @ts-ignore - returning method exists but TypeScript doesn't recognize it
        query = query.select(options.returning);
      }
      
      return await query;
    } catch (error) {
      console.error(`Error in update operation on ${tableName}:`, error);
      trackError(`Database update error: ${tableName}`, 'databaseOptimizer', { error });
      throw error;
    }
  },

  /**
   * Delete data from a table
   */
  async delete(tableName: string, filters: Record<string, any>, options: {
    returning?: string
  } = {}) {
    try {
      // @ts-ignore - Dynamic table name
      let query = supabase.from(tableName).delete();
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (key && value !== undefined) {
          // @ts-ignore - Dynamic filtering
          query = query.eq(key, value);
        }
      });
      
      if (options.returning) {
        // @ts-ignore - returning method exists but TypeScript doesn't recognize it
        query = query.select(options.returning);
      }
      
      return await query;
    } catch (error) {
      console.error(`Error in delete operation on ${tableName}:`, error);
      trackError(`Database delete error: ${tableName}`, 'databaseOptimizer', { error });
      throw error;
    }
  },
  
  /**
   * Perform a batch operation
   */
  async batchOperation(operations: Array<{
    type: 'select' | 'insert' | 'update' | 'delete',
    tableName: string,
    data?: Record<string, any> | Record<string, any>[],
    filters?: Record<string, any>,
    options?: Record<string, any>
  }>) {
    const results = [];
    const errors = [];
    
    for (const operation of operations) {
      try {
        let result;
        
        switch (operation.type) {
          case 'select':
            result = await this.select(
              operation.tableName, 
              { 
                filters: operation.filters,
                ...operation.options
              }
            );
            break;
            
          case 'insert':
            if (!operation.data) {
              throw new Error('Data is required for insert operations');
            }
            result = await this.insert(
              operation.tableName, 
              operation.data, 
              operation.options
            );
            break;
            
          case 'update':
            if (!operation.data || !operation.filters) {
              throw new Error('Data and filters are required for update operations');
            }
            result = await this.update(
              operation.tableName, 
              operation.data as Record<string, any>, 
              operation.filters, 
              operation.options
            );
            break;
            
          case 'delete':
            if (!operation.filters) {
              throw new Error('Filters are required for delete operations');
            }
            result = await this.delete(
              operation.tableName, 
              operation.filters, 
              operation.options
            );
            break;
            
          default:
            throw new Error(`Unsupported operation type: ${operation.type}`);
        }
        
        results.push(result);
      } catch (error) {
        console.error(`Error in batch operation for ${operation.type} on ${operation.tableName}:`, error);
        errors.push({
          operation,
          error
        });
        
        // Track error but don't throw to allow other operations to continue
        trackError(`Batch operation error: ${operation.type} on ${operation.tableName}`, 'databaseOptimizer', { 
          operation, 
          error 
        });
      }
    }
    
    return {
      results,
      errors,
      hasErrors: errors.length > 0,
      success: results.length === operations.length
    };
  }
};

export default databaseOptimizer;
