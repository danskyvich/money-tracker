"use server"

import { getUser } from "./auth";
import { createClient } from "../clients/server"

// <------------------ accounts ---------------------------------->

// INSERT
export async function InsertAccount(name: string, description: string, categoryId: string) {

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
export async function UpdateAccountCategoryName(name: string, uuid: string) {
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
                `id, name, account_categories!category_id(name), description`,
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
    
        let merged: any[] = [];
    
        if (accountsData && balancesData) {
          const balancesMap = new Map(
            balancesData.map((b) => [b.account_id, b.balance]),
          );
    
          merged = accountsData.map((a) => ({
            ...a,
            balance: balancesMap.get(a.id) ?? 0,
          }));
        }
    
        if (merged.length > 0) return {
            success: true, accountsData: merged, totalItems: count ?? 0, accountCategoriesData: accountCategoriesData
         } 
}

// <-----------------Transactions --------------------------->

// SELECT
export async function FetchTransaction(currentPage: number, numberOfItems: number) {
    const supabase = await createClient();
    const { data, error, count } = await supabase
        .from("transactions")
        .select(`id, date_time, description, amount::text, type, categories!category_id(id, name), fromAccount:accounts!account_id(id, name), toAccount:accounts!to_account_id(id, name)`, {count: "exact"})
        .range((currentPage - 1) * numberOfItems, (currentPage - 1) * numberOfItems + numberOfItems - 1);
    
    if (!data) return { success: false, error: error.message};

    return  { success: true, data, totalItems: count, error: null}
}
interface InsertTransactionParams {
    dateTime: string,
    type: string,
    category_id: string,
    account_id: string,
    to_account_id: string | null | undefined,
    amount: number,
    description: string,
}

// INSERT
export async function InsertTransaction(params: InsertTransactionParams) {
    const {dateTime, type, category_id, account_id, to_account_id, amount, description} = params // destructure params
    const supabase = await createClient(); // initialize client
    const user = await getUser(); // user_id

    if (!user) return { data: null, error: "Unauthenticated user" }

    const { data, error } = await supabase
        .from("transactions")
        .insert(
            {
                account_id,
                amount,
                category_id,
                description,
                user_id: user.id,
                to_account_id,
                date_time: dateTime,
                type,
            }
        )

    if (!data || error) return { data: null, error };
    
    return { error: null }  
}

// UPDATE
export async function UpdateTransaction(id: string, params: InsertTransactionParams) {
    const {dateTime, type, category_id, account_id, to_account_id, amount, description} = params // destructure params
    const supabase = await createClient();
    const user = await getUser();

    if (!user) return { data: null, error: "Unauthenticated user."}

    const { data, error } = await supabase
        .from("transactions")
        .update({
            account_id,
            amount,
            category_id,
            description,
            to_account_id,
            date_time: dateTime,
            type,
        })
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