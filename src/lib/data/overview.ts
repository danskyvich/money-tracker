import { createClient } from "@/supabase/client";
import { OverviewData } from "../types/database";

const OVERVIEW_ACCOUNTS_ITEMS = 4;
const DEFAULT_ITEMS_PER_PAGE = 9

export async function getOverviewData(currentPage: number): Promise<OverviewData> {
    const supabase = await createClient();

    // # of items for accounts section in Overview
    const Accountsfrom = (currentPage - 1) * OVERVIEW_ACCOUNTS_ITEMS;
    const AccountsTo = Accountsfrom + OVERVIEW_ACCOUNTS_ITEMS - 1;

    // the default # of items
    const from = (currentPage - 1) * DEFAULT_ITEMS_PER_PAGE;
    const to = from + DEFAULT_ITEMS_PER_PAGE - 1;

    const [
        { data: transactionData, error: transactionError, count: transactionCount },
        { data: accountsData, error: accountsError, count: accountsCount  },
        { data: balancesData, error: balancesError },
        { data: categoryData, error: categoryError },
        { data: accountCategoriesData, error: accountCategoriesError },
    ] = await Promise.all([
        //fromAccount: & toAccount: are aliases for FK columns that point to the same account
        supabase.from("transactions").select(`id, date_time, description, amount::text, type, categories!category_id(id, name), fromAccount:accounts!account_id(id, name), toAccount:accounts!to_account_id(id, name)`, {count: "exact"}).range(from, to),
        supabase.from("accounts").select(`id, name, category_id:account_categories!category_id(id, name), description`, { count: "exact"}).range(Accountsfrom, AccountsTo),
        supabase.from("accounts_balances").select(`account_id, balance::text`),
        supabase.from('categories').select(`id, name`),
        supabase.from('account_categories').select(`id, name`)
    ])

    return {
        transactionData,
        transactionError,
        transactionCount,
        accountsData,
        accountsError,
        accountsCount,
        balancesData,
        balancesError,
        categoryData,
        categoryError,
        accountCategoriesData,
        accountCategoriesError,
    }
}