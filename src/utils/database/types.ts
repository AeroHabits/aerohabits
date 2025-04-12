
import { PostgrestQueryBuilder, PostgrestFilterBuilder } from "@supabase/postgrest-js";

// Type definitions for the query builder
export type TableNames = 'habits' | 'goals' | 'challenges' | 'profiles' | 'habit_categories';
export type QueryMethod = 'select' | 'insert' | 'update' | 'delete' | 'upsert';
export type OrderDirection = 'asc' | 'desc';

export interface QueryOptions {
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
