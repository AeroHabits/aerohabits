
import { supabase } from "@/integrations/supabase/client";
import { TableNames, QueryMethod, QueryOptions } from "./types";
import { applyFilters } from "./filterUtils";

/**
 * Creates and configures a query builder based on the method and options
 */
export function createQueryBuilder(
  table: TableNames,
  method: QueryMethod = 'select',
  options: QueryOptions = {}
) {
  const {
    limit = 100,
    offset = 0,
    orderBy = 'created_at',
    orderDirection = 'desc',
    filters = {},
    select = '*',
    relations = [],
  } = options;

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
      
      // Apply filters using the extracted utility function
      queryBuilder = applyFilters(queryBuilder, filters);
      
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
        queryBuilder = applyFilters(queryBuilder, conditions);
      }
      break;
    }
    
    case 'delete': {
      queryBuilder = supabase.from(table).delete();
      
      // Apply filters using the extracted utility function
      queryBuilder = applyFilters(queryBuilder, filters);
      break;
    }
    
    case 'upsert': {
      queryBuilder = supabase.from(table).upsert(filters as any);
      break;
    }
  }

  return queryBuilder;
}
