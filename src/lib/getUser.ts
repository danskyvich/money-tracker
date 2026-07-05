"use server"

import { createClient } from "./supabase/server"

export async function getUser() {
    const client = await createClient();
    const { data: { user }, error } = await client.auth.getUser();
    return { user, error };
}
