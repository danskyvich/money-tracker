import VerifyEmailPage from "@/components/ui/VerifyEmailPage";

export default async function VerifyEmail({searchParams}: {searchParams: Promise<{ email?: string, rememberMe?: string}>}) {
    const params = await searchParams;
    
    return(
        <div>
            <VerifyEmailPage searchParams={params}/>
        </div>
    )
}