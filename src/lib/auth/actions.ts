'use server'

import { redirect } from "next/navigation";
import { createClient } from "./../supabase/server"
import { createAdminClient } from "../supabase/admin";

async function verifyRecaptcha(token: string): Promise<boolean> {
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  });
  const data = await res.json();
  console.log("recaptcha verify result:", data); 
  return data.success && data.score >= 0.5;
}

export async function generalSignIn(email: string, rememberMe: boolean, recaptchaToken: string): Promise<{ error?: string | null}> {
    const isHuman = await verifyRecaptcha(recaptchaToken) 
    if (!isHuman) {
        return { error: "Verification failed. Please try again"}
    }
    
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

export async function listUserMfaFactors() {
    const supabase = await createClient();
    const { data, error} = await supabase.auth.mfa.listFactors();

    if (error) return { error: error.message}

    const { data: { user } } = await supabase.auth.getUser();
    console.log("USER ID:", user?.id);

    return { totp: data.totp }
}

// for multi-factor authentication
export async function enrollUserMfa() {
    const supabase = await createClient();

    const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) return { error: factorsError.message }

    const verified = factorsData.totp.filter((f) => f.status === "verified");
    if (verified.length > 0) {
        return { error: "MFA is already enabled on this account." };
    }

    const existingUnverified = factorsData.totp.filter((f) => (f.status as string) === "unverified");
    for (const f of existingUnverified) {
        await supabase.auth.mfa.unenroll({ factorId: f.id });
    }

    const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: `Authenticator App ${Date.now()}`,
    })

    if (error) return { error: error.message }

    const { data: { user } } = await supabase.auth.getUser();
    console.log("USER ID:", user?.id);

    const { id, totp } = data;
    return { factorId: id, qr_code: totp.qr_code, secret: totp.secret, uri: totp.uri }
}

export async function challengeUserMfa(factorId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.mfa.challenge({
        factorId
    });

    if (error)  return { error: error.message}

    return { challengeId: data.id };
}

export async function verifyUserMfa(factorId: string, challengeId: string, code: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.mfa.verify({
        factorId, challengeId, code
    });

    if (error) return { error: error.message }

    redirect("/profile")
}

export async function unenrollFactor(factorId: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (error) return { error: error.message };
  return { success: true };
}
