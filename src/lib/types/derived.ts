// lib/types/derived.ts
import type { Database } from './database';

export type Accounts = Database['public']['Tables']['accounts']['Row'];
export type AccountCategories = Database['public']['Tables']['account_categories']['Row'];

// derived directly from your fetch_accounts RPC's real return shape
export type AccountsWithBalance = Omit<
  Database['public']['Functions']['fetch_accounts']['Returns'][number],
  'total_count'
>