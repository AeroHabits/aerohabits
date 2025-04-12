
import { supabase } from "@/integrations/supabase/client";
import { TableNames, QueryMethod, QueryOptions } from "./types";

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

  return queryBuilder;
}
