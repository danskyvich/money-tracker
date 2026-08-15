// lib/types/derived.ts
import type { Database } from './database';

export type Accounts = Database['public']['Tables']['accounts']['Row'];
export type AccountCategories = Database['public']['Tables']['account_categories']['Row'];
export type Transactions = Database['public']['Tables']['transactions']['Row']
type RawSearchResult = Database['public']['Functions']['search_transactions']['Returns'][number];

export type TransactionSearchResults = Omit<RawSearchResult, 'description' | 'to_account_id' | 'account_id' | 'category_id'> & {
  description: string | null;
  account_id: { id: string; name: string | null };
  category_id: { id: string; name: string | null };
  to_account_id: { id: string; name: string | null } | null;
};

// derived directly from your fetch_accounts RPC's real return shape
export type AccountsWithBalance = Omit<
  Database['public']['Functions']['fetch_accounts']['Returns'][number],
  'total_count'
>
