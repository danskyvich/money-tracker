import { PostgrestError } from "@supabase/supabase-js";

export interface Transaction {
    id: string,
    date_time: string,
    description: string,
    amount: string,
    type: string,
    categories: { id: string, name: string},
    fromAccount: { id: string, name: string} | null,
    toAccount: {id: string, name: string} | null,
}

export interface Accounts {
    id: string,
    name: string,
    category_id: { id: string, name: string } | null;
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

export interface AccountCategories {
    name: string,
    id: string,
}

export interface OverviewData {
    transactionData: Transaction[] | null,
    transactionError: PostgrestError | null,
    transactionCount: number | null,
    accountsData: Accounts[] | null,
    accountsError: PostgrestError | null,
    accountsCount: number | null,
    balancesData: AccountBalance[] | null,
    balancesError: PostgrestError | null,
    categoryData: Category[] | null,
    categoryError: PostgrestError | null,
    accountCategoriesData: AccountCategories[] | null,
    accountCategoriesError: PostgrestError | null,
}