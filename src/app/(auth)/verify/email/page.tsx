import VerifyEmailPage from "@/components/ui/VerifyEmailPage";
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