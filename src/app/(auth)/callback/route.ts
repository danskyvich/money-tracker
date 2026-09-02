import { createClient } from "@/lib/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";
import { isDeviceTrusted } from "@/lib/supabase/actions/auth";

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code")
    let next = searchParams.get("next") ?? "/overview";
    if (!next.startsWith("/")) {
        next = "/overview"
    }

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            const buildRedirectUrl = (path: string) => {
                if (isLocalEnv) return `${origin}${path}`
                if (forwardedHost) return `https://${forwardedHost}${path}`
                return `${origin}${path}`;
            } 
            
            const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
            const { data: factorsData } = await supabase.auth.mfa.listFactors();
            const verifiedTotp = factorsData?.all.find(
                (f) => f.factor_type === "totp" && f.status === "verified"
            );
            const needsMfa = aal?.currentLevel === "aal1" && aal?.nextLevel === "aal2" && !!verifiedTotp;

            if (needsMfa) {
                const { data: { user } } = await supabase.auth.getUser();
                const deviceTrusted = user ? await isDeviceTrusted() : false;

                if (!deviceTrusted) {
                    return NextResponse.redirect(
                        buildRedirectUrl(`/verify/mfa?mode=challenge&factorId=${verifiedTotp.id}`)
                    );
                }
            }
            return NextResponse.redirect(buildRedirectUrl(next));
        }
    }

    return NextResponse.redirect(`/login?error=oauth_failed`)
}