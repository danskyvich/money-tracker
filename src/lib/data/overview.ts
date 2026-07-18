import { createClient } from "@/services/supabase/client";
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
        { data: accountsData, error: accountsError },
        { data: balancesData, error: balancesError },
        { data: categoryData, error: categoryError },
    ] = await Promise.all([
        supabase.from("transactions").select(`id, date_time, description, amount::text, type, categories!category_id(name), fromAccount:accounts!account_id(name), toAccount:accounts!to_account_id(name)`, {count: "exact"}).range(from, to),
        supabase.from("accounts").select(`id, name, account_categories!category_id(name), description`).range(Accountsfrom, AccountsTo),
        supabase.from("accounts_balances").select(`account_id, balance::text`),
        supabase.from('categories').select(`id, name`),
    ])

    return {
        transactionData,
        transactionError,
        transactionCount,
        accountsData,
        accountsError,
        balancesData,
        balancesError,
        categoryData,
        categoryError
    }
}