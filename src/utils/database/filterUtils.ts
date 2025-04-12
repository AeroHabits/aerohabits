
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

/**
 * Applies filters to a Supabase query builder
 * 
 * @param queryBuilder The query builder to apply filters to
 * @param filters Object containing key-value pairs for filtering
 * @returns The modified query builder with applied filters
 */
export function applyFilters<T>(
  queryBuilder: PostgrestFilterBuilder<any, any, T>,
  filters: Record<string, any> = {}
): PostgrestFilterBuilder<any, any, T> {
  let filteredQuery = queryBuilder;
  
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      filteredQuery = filteredQuery.in(key, value);
    } else if (value !== null && typeof value === 'object') {
      // Handle special operators like gt, lt, etc.
      Object.entries(value).forEach(([op, val]) => {
        if (op === 'gt') filteredQuery = filteredQuery.gt(key, val as any);
        else if (op === 'gte') filteredQuery = filteredQuery.gte(key, val as any);
        else if (op === 'lt') filteredQuery = filteredQuery.lt(key, val as any);
        else if (op === 'lte') filteredQuery = filteredQuery.lte(key, val as any);
        else if (op === 'like') filteredQuery = filteredQuery.like(key, `%${val}%`);
        else if (op === 'ilike') filteredQuery = filteredQuery.ilike(key, `%${val}%`);
        else if (op === 'neq') filteredQuery = filteredQuery.neq(key, val as any);
      });
    } else {
      filteredQuery = filteredQuery.eq(key, value);
    }
  });
  
  return filteredQuery;
}
