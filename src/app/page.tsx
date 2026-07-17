import { redirect } from "next/navigation";
import { createClient } from "@/services/supabase/server";

export default async function RootPage() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();

    redirect(data?.claims ? "/overview" : "/login")
}