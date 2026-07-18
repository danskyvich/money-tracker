"use server"

import { createClient } from "../server"


// <------------------ account_categories ------------------------>

// UPDATE
export async function UpdateAccountCategoryName(name: string, uuid: string) {
    const { data, error } = await (await createClient())
        .from('account_categories')
        .update({ name })
        .eq('id', uuid);
    
    if (error) {
        return{ success: false, error: error.message}
    }

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
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if ( userError || !userData) return { success: false, error: "Not authenticated."}

    const { data, error } = await supabase
        .from('account_categories')
        .insert({ name, user_id: userData.user.id })
    
    if (error) return { success: false, error: error.message}

    return { success: true, data }
}
