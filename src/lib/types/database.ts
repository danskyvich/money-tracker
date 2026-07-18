import { PostgrestError } from "@supabase/supabase-js";

export interface Transaction {
    id: string,
    date_time: string,
    description: string,
    amount: string,
    type: string,
    categories: {name: string} | null,
    fromAccount: {name: string} | null,
    toAccount: {name: string} | null,
}

export interface Accounts {
    id: string,
    name: string,
    category_id: { name: string }[] | null;
    description: string,
}

export interface AccountBalance {
    account_id: string,
    balance: string,
}

export interface Category {
    name: string,
    id: string,
}

export interface OverviewData {
    transactionData: Transaction[] | null,
    transactionError: PostgrestError | null,
    transactionCount: number | null,
    accountsData: Accounts[] | null,
    accountsError: PostgrestError | null,
    balancesData: AccountBalance[] | null,
    balancesError: PostgrestError | null,
    categoryData: Category[] | null,
    categoryError: PostgrestError | null,
}