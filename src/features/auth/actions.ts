"use server"

import { createClient } from "@/lib/supabase/clients/server"
import { redirect } from "next/navigation";

export async function signInDemo(): Promise<{success: false, error: string}> {
    const supabase = await createClient();
    const  { error } = await supabase.auth.signInWithPassword({
        email: process.env.DEMO_EMAIL!,
        password: process.env.DEMO_PASSWORD!,
    });
    if (error) return { success: false, error: error.message }
    redirect("/overview");
}