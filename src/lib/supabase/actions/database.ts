"use server"

import { getUser } from "./auth";
import { createClient } from "../clients/server"
import { Accounts, AccountsWithBalance } from "@/lib/types/database";

// <------------------ accounts ---------------------------------->

// INSERT
export async function InsertAccount(name: string, description: string, categoryId: string | undefined) {

    const user = await getUser();

    const { data, error } = await (await createClient())
        .from("accounts")
        .insert({user_id: user?.id, name, description, category_id: categoryId})
        .select()
    if (error) return { data: null, error: error.message};
    return { data, error: null};
}

// UPDATE
export async function DeleteAccount(id: string) {
    const { data, error } = await (await createClient())
        .from("accounts")
        .delete()
        .eq('id', id)
        .select()
    if (!data) return { data: null, error: error.message}
    return { error: null };
}

// <------------------ account_categories ------------------------>

// UPDATE
export async function UpdateAccountCategoryName(name: string, uuid: string | null) {
    const { data, error } = await (await createClient())
        .from('account_categories')
        .update({ name })
        .eq('id', uuid);
    
    if (error) return{ success: false, error: error.message}
    return { success: true, data };
}
// DELETE
export async function DeleteAccountCategoryName(uuid: string) {
    const { data, error } = await (await createClient())
        .from('account_categories')
        .delete()
        .eq('id', uuid);

    if (error) return { success: false, error: error.message}

    return { success: true, data };
}
// INSERT
export async function InsertAccountCategoryName(name: string) {
    const supabase = await createClient();
    
    const user = await getUser(); // user_id

    const { error } = await supabase
        .from('account_categories')
        .insert({ name, user_id: user?.id })
    
    if (error) return { success: false, error: error.message}

    return { success: true }
}


// SELECT 
export async function FetchAccounts(currentPage: number, numberOfItems: number) {
    const [accountsResult, balancesResult, accountCategoriesResult] =
        await Promise.all([
            // use Promise.all to merge both fetches
            await (
              await createClient()
            )
              .from("accounts")
              .select(
                `*, category_id:account_categories(id, name)`,
                {
                  count: "exact",
                },
              )
              .range((currentPage - 1) * numberOfItems, (currentPage - 1) * numberOfItems + numberOfItems - 1),
            await (await createClient())
              .from("accounts_balances")
              .select(`account_id, balance::text`),
            await (await createClient())
              .from("account_categories")
              .select(`id, name`),
          ]);
    
        // deconstruct into two sets of variables
        const { data: accountsData, count, error: accountsError } = accountsResult;
        const { data: balancesData, error: balancesError } = balancesResult;
        const { data: accountCategoriesData, error: accountCategoriesError } =
          accountCategoriesResult;
    
        if (accountsError || balancesError || accountCategoriesError) return { success: false, error: "Database error"}
    
        let merged: AccountsWithBalance[] = [];
    
        if (accountsData && balancesData) {
          const balancesMap = new Map(
            balancesData.map((b) => [b.account_id, b.balance]),
          );
    
          merged = accountsData.map((a) => ({
            ...a,
            balance: balancesMap.get(a.id) ?? 0,
          }));
        }
    
        return {
            success: true,
            accountsData: merged,
            totalItems: count ?? 0,
            accountCategoriesData: accountCategoriesData,
        }
}

// <-----------------Transactions --------------------------->

// SELECT
export async function FetchTransaction(currentPage: number, numberOfItems: number) {
    const supabase = await createClient();
    const { data, error, count } = await supabase
        .from("transactions")
        .select(`id, date_time, description, amount::text, type, categories!category_id(id, name), fromAccount:accounts!account_id(id, name), toAccount:accounts!to_account_id(id, name)`, {count: "exact"})
        .order("date_time", { ascending: false})
        .range((currentPage - 1) * numberOfItems, (currentPage - 1) * numberOfItems + numberOfItems - 1);
    
    if (error) return { success: false, error: error.message};

    return  { success: true, data, totalItems: count}
}
interface InsertTransactionParams {
    account_id: string,
    amount: number,
    category_id: string,
    description: string | null,
    user_id: string,
    to_account_id: string | null,
    date_time: string,
    type: string
}

// INSERT
export async function InsertTransaction(transaction: InsertTransactionParams[]) {
    const supabase = await createClient(); // initialize client

    const { data, error } = await supabase
        .from("transactions")
        .insert(transaction);

    if (!data || error) return { data: null, error };
    
    return { error: null }  
}

// UPDATE
export async function UpdateTransaction(id: string, transaction: InsertTransactionParams[]) {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) return { data: null, error: "Unauthenticated user."}

    const { data, error } = await supabase
        .from("transactions")
        .update(transaction)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
    
    if (error) return { data: null, error };
    return { data, error: null};
}

// DELETE
export async function DeleteTransaction(id: string) {
    const {data, error } = await (await createClient()).from("transactions")
        .delete()
        .eq("id", id)
        .select()
    if (!data) return { error: error.message}
    return { data, error: null}
}

// TRANSACTIONS from an ACCOUNT 
export async function SelectTransactionsFromChosenAccount(id: string, currentPage: number, pagesToShow: number) {
    const from = (currentPage - 1) * pagesToShow;
    const to = from + pagesToShow - 1;
    const { data, error, count } = await (await createClient())
        .from("transactions")
        .select(`*, categories(name), fromAccount:accounts!account_id(name), toAccount:accounts!to_account_id(name)`, { count: "exact"})
        .or(`account_id.eq.${id},to_account_id.eq.${id}`)
        .order("date_time", { ascending: false})
        .range(from, to);
    if (!data) return { data: null, error: error.message ?? "Unknown Error", count: null}
    return { data, error: null, count };
}

// <!-------------------- SETTINGS / CONFIG -------------------->

// DELETE USER DATA
export async function DeleteUserData() {
    const supabase = await createClient();
    const { data: { user }, error: user_error } = await supabase.auth.getUser();

    if (!user || user_error ) return { success: false, error:  "Not authenticated" };

    const user_id = user.id;

    const deletes = [
        () => supabase.from("transactions").delete().eq("user_id", user_id),
        () => supabase.from("accounts").delete().eq("user_id", user_id),
        () => supabase.from("account_categories").delete().eq("user_id", user_id),
        () => supabase.from("categories").delete().eq("user_id", user_id),
    ];

    for (const del of deletes) {
        const { error } = await del();
        if (error) return { success: false, error: error.message}
    }

    return { success: true};
}

// SEARCH ACCOUNTS
export async function SearchAccounts(term: string): Promise<{success: true; data: AccountsWithBalance[]} | {success: false, error: string}> {
    if (!term.trim()) return { success: true, data: []};
    
    const supabase = await createClient();
    const { data, error } = await supabase
        .rpc('search_accounts', { search_term: term })

    if (!data || error ) return { success: false, error: error?.message ?? "Unknown error."};

    return { success: true, data};
} 