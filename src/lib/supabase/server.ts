import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getEnvironmentVariables() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    }

    return { supabaseUrl, supabaseAnonKey }
}

export async function createClient(rememberMe: boolean = true) {
    const { supabaseUrl, supabaseAnonKey } = getEnvironmentVariables();

    const cookieStore = await cookies();

    return createServerClient(
        supabaseUrl!,
        supabaseAnonKey!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet, _headers) {
                    try {
                        cookiesToSet.forEach(({name, value, options}) => {
                            if (rememberMe) {
                                cookieStore.set(name, value, options)
                            } else {
                                // strip expiry down to session cookie, lifetime ends when the browser close
                                const { maxAge, expires, ...rest} = options
                                cookieStore.set(name, value, rest)
                            }
                        })
                    } catch {
                        // ignored since middleware.ts exist
                    }
                }
            }
        }
    )
}