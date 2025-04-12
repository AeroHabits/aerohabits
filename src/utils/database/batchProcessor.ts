
import { TableNames, QueryMethod, QueryOptions } from "./types";
import { useDatabaseOptimizer } from "../databaseOptimizer";

/**
 * Process database operations in batches to improve performance
 */
export function createBatchProcessor(optimizedQueryFn: ReturnType<typeof useDatabaseOptimizer>["query"]) {
  return async function batchProcess<T = any>(
    table: TableNames,
    method: QueryMethod,
    items: Record<string, any>[],
    options: Omit<QueryOptions, 'filters'> = {}
  ): Promise<T[]> {
    const { batchSize = 50 } = options;
    const results: any[] = [];
    
    // Process in batches
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      // Handle different methods
      if (method === 'insert' || method === 'upsert') {
        const result = await optimizedQueryFn(table, method, {
          ...options,
          filters: batch as any
        });
        
        if (result) {
          results.push(...result);
        }
      } else {
        // For update and delete, process one by one but in parallel
        const batchPromises = batch.map(item => 
          optimizedQueryFn(table, method, {
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
}
