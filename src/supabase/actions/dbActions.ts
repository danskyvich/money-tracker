"use server"

import { getUser } from "./actions";
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

// SELECT
export async function SelectAccountTransactions(id: string, currentPage: number, pagesToShow: number) {
    const from = (currentPage - 1) * pagesToShow;
    const to = from + pagesToShow - 1;
    const { data, error, count } = await (await createClient())
        .from("transactions")
        .select(`*,categories(name), fromAccount:accounts!account_id(name), toAccount:accounts!to_account_id(name)`, { count: "exact"})
        .or(`account_id.eq.${id},to_account_id.eq.${id}`)
        .order("date_time", { ascending: false})
        .range(from, to);
    if (!data) return { data: null, error: error.message ?? "Unknown Error", count: null}
    return { data, error: null, count };
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

    const { data, error } = await supabase
        .from('account_categories')
        .insert({ name, user_id: user?.id })
    
    if (error) return { success: false, error: error.message}

    return { success: true, data }
}

// <-----------------Transactions --------------------------->
interface InsertTransactionParams {
    dateTime: string,
    type: string,
    category_id: string,
    account_id: string,
    to_account_id: string | null | undefined,
    amount: number,
    description: string,
}

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

export async function DeleteTransaction(id: string) {
    const {data, error } = await (await createClient()).from("transactions")
        .delete()
        .eq("id", id)
        .select()
    if (!data) return { error: error.message}
    return { data, error: null}
}
