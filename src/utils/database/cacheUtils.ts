
import { TableNames, QueryMethod, QueryOptions } from "./types";

/**
 * Generate a cache key from query parameters
 */
export const generateCacheKey = (
  table: TableNames, 
  method: QueryMethod, 
  options: QueryOptions
) => {
  return `${table}:${method}:${JSON.stringify(options)}`;
};
