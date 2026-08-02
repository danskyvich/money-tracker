import VerifyEmailPage from "@/feature/auth/components/verify-email-page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function VerifyEmail() {
    const cookieStore = await cookies()
    const raw = cookieStore.get("pending_verification")?.value;

    if (!raw) redirect("/login");

    const { email, rememberMe } = JSON.parse(raw);
    
    return(
        <div>
            <VerifyEmailPage email={email} rememberMe={rememberMe}/>
        </div>
    )
}