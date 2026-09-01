'use server'

import { redirect } from "next/navigation";
import { createClient } from "../clients/server"
import { createAdminClient } from "../clients/admin";
import { Factor, User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";

// Recaptcha
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

// Passwordless Sign In
export async function generalSignIn(email: string, rememberMe: boolean, recaptchaToken: string): Promise<{ error?: string | null}> {
    const result = await sendOtp(email, recaptchaToken)
    if (result.error) return result
    
    const cookieStore = await cookies();
    cookieStore.set("pending_verification", JSON.stringify({ email, rememberMe}), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 10,
        path: "/verify/email"
    });
    redirect("verify/email")
}

// exclusively for sending OTP
export async function sendOtp(email: string, recaptchaToken: string): Promise<{ error?: string | null}> {
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) return { error: "Verification failed. Please try again"};

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({email})

    if (error) {
        return { error: error.message };
    }

    return {};
} 

// for resend email verification with OTP code
export async function resendOtp(email: string, recaptchaToken: string):Promise<{ error?: string | null}> {
    return sendOtp(email, recaptchaToken);
}

// if successful, session will give jwt + refresh token
export async function verifyOtp(email: string, token: string) {
    if (!token || !/^\d{6}$/.test(token)) {
        return { error: "Please enter a valid 6-digit code."}
    }
    const cookieStore = await cookies();

    const attemptsKey = `otp_attempts_${email}`
    const attempts = parseInt(cookieStore.get(attemptsKey)?.value ?? "0", 10);

    // limit resend code attempts to 5
    if (attempts >= 5) {
        return { error: "Too many attempts. Please request a new code"}
    }

    // get rememberMe from cookieStore and then move it to server createClient()
    const pending = cookieStore.get("pending_verification")?.value;
    const rememberMe = pending ? JSON.parse(pending).rememberMe : false;
    
    // verify Otp
    const supabase = await createClient(rememberMe);
    const { error } = await supabase.auth.verifyOtp({
        email,
        type: "email",
        token,
    })

    // if verify returns error, add 1 to attempts
    if (error) {
        cookieStore.set(attemptsKey, String(attempts + 1), {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 10,
        });
        return { error: error.message}
    }    

    cookieStore.delete("pending_verification");
    cookieStore.delete(attemptsKey);

    // check if mfa exists
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    const { data: factorsData } = await supabase.auth.mfa.listFactors();
    const verifiedTotp = factorsData?.all.find((f) => f.factor_type === "totp" && f.status === "verified");
    const needsMfa = aal?.currentLevel === "aal1" && aal?.nextLevel === "aal2" && !!verifiedTotp;

    // if user needs to mfa
    if (needsMfa) {
        const { data: {user}} = await supabase.auth.getUser();
        const deviceTrusted = user ? await isDeviceTrusted() : false;

        if (!deviceTrusted) {
            redirect(`/verify/mfa?mode=challenge&factorId=${verifiedTotp!.id}`);
        }
    }
    redirect("/overview");
}

// SIGN OUT
export async function signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        return { error: error.message}
    }

    redirect("/login")
}

// DELETE USER
export async function deleteUser() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();

    if (!data?.claims) throw new Error("No user found");

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.claims.sub);

    if (error) throw error;

    redirect("/login")
}

// list all MFA factors of the current logged in account
export async function listUserMfaFactors(): Promise<{success: false, error: string} | {success: true, totp: Factor[]}> {
    const supabase = await createClient();
    const { data, error} = await supabase.auth.mfa.listFactors();
    console.log("MFA factors:", JSON.stringify(data, null, 2)); // check for data.phone

    if (error) return { success: false, error: error.message}

    return { success: true, totp: data.totp }
}

// for multi-factor authentication
export async function enrollUserMfa() {
    const supabase = await createClient();

    // verify if user exist
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) return { success: false, error: "User not authenticated"};

    // check if the account has mfa enabled 
    const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) return { success: false, error: factorsError.message }

    const verified = factorsData.all.filter((f) => f.factor_type === "totp" && f.status === "verified");
    if (verified.length > 0) {
        return { success: false, error: "MFA is already enabled on this account." };
    }

    // check if any unverified factors are found
    const existingUnverified = factorsData.all.filter((f) => f.factor_type === "totp" && (f.status as string) === "unverified");
    for (const f of existingUnverified) {
        const { error } = await supabase.auth.mfa.unenroll({factorId: f.id});
        if (error) return { success: false, error: error.message};
    }

    // enroll mfa
    const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: `Authenticator App ${Date.now()}`,
    })

    if (error) return { success: false, error: error.message }

    const { id, totp } = data;
    return { success: true, factorId: id, qr_code: totp.qr_code, secret: totp.secret, uri: totp.uri }
}

export async function challengeUserMfa(factorId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.mfa.challenge({
        factorId
    });

    if (error)  return { error: error.message}

    return { challengeId: data.id };
}

export async function verifyUserMfa(factorId: string, challengeId: string, code: string, trustedDevice: boolean, redirectTo: string = "/profile") {
    const supabase = await createClient();

    const user = await getUser();
    if (!user) return { success: false, error: "User not authenticated"};
    const user_id = user?.id;

    const { error } = await supabase.auth.mfa.verify({
        factorId, challengeId, code
    });

    if (error) return { success: false, error: error.message }

    if (trustedDevice) {
        const token = randomBytes(32).toString("hex");
        const tokenHash = createHash("sha256").update(token).digest("hex");
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await supabase.from("trusted_devices").insert({
            user_id,
            device_token_hash: tokenHash,
            expires_at: expiresAt.toISOString(),
        });

        const cookieStore = await cookies();
        cookieStore.set("trusted_devices", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            expires: expiresAt,
            path: "/",
        })
    }

    redirect(redirectTo);
}

export async function isDeviceTrusted() {
    const supabase = await createClient();
    const cookieStore = await cookies();
    const token = cookieStore.get("trusted_devices")?.value;
    if (!token) return false;

    const user = await getUser();
    if (!user) return { success: false, error: "User not authenticated"};
    const user_id = user.id;

    const tokenHash = createHash("sha256").update(token).digest("hex");

    const { data } = await supabase
        .from("trusted_devices")
        .select("id")
        .eq("user_id", user_id)
        .eq("device_token_hash", tokenHash)
        .gte("expires_at", new Date().toISOString())
        .maybeSingle();
    return !!data;
}

export async function unenrollFactor(factorId: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (error) return { error: error.message };
  return { success: true };
}

// get user details
export async function getUser(): Promise<User | null> {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if ( error || !user ) { console.error('Failed to get user', error); return null }
    return user;
}

// get MFA enable for user
export async function isUserMfaEnabled(): Promise<boolean> {
    const client = await createClient();
    const { data, error } = await client.auth.mfa.listFactors();
    if ( error) { console.error("Failed to get AAL:", error); return false}
    return data.totp.some(f => f.status === 'verified');
}

// Google authentication
export async function signInWithGoogle() {
    const client = await createClient()
    const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`
        }
    });

    if (error) { 
        console.error("Error signing in with Google:", error.message)
        redirect("/login?error=oauth_failed")
    }

    redirect(data.url)
}

// Facebook authentication
export async function signInWithFacebook() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`,
            scopes: "email public_profile",
        }
    });

    if (error) { 
        console.error("Error signing in with Facebook:", error.message)
        redirect("/login?error=oauth_failed")
    }
    if (data.url) {
        redirect(data.url);
    }

    redirect("/login?error=oauth_failed")
 }

 export async function getUserAuthenticationAssuranceLevel() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error) return { success: false, error: error.message};

    return { success: true, data };
 }