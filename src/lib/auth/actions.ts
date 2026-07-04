'use server'

import { redirect } from "next/navigation";
import { createClient } from "./../supabase/server"
import { createAdminClient } from "../supabase/admin";

export async function generalSignIn(email: string, rememberMe: boolean): Promise<{ error?: string | null}> {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOtp({
        email,
    })

    if (error) {
        return { error: error.message};
    }

    redirect(`/verify-email?email=${encodeURIComponent(email)}&rememberMe=${rememberMe}`);
}

// if successful, session will give jwt + refresh token
export async function verifyOtp(email: string, token: string, rememberMe: boolean = false): Promise<{ error?: string | null}> {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
        email,
        type: "email",
        token,
    })

    if (error) {
        return { error: error.message};
    }

    redirect("/overview")
}

export async function signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        return { error: error.message}
    }

    redirect("/login")
}

export async function deleteUser() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();

    if (!data?.claims) throw new Error("No user found");

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.claims.sub);

    if (error) throw error;

    redirect("/login")
}