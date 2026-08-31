import VerifyQRPage from "@/features/mfa/components/verify-qr-page";
import { challengeUserMfa } from "@/lib/supabase/actions/auth";
import { createClient } from "@/lib/supabase/clients/server";
import { redirect } from "next/navigation";

export default async function VerifyMFA({searchParams}: {searchParams: Promise<{mode?: string; factorId?: string}>}) {
  const { mode, factorId: factorIdParams } = await searchParams;
  const isEnrollment = mode === "enroll";
  const supabase = await createClient();

  let factorId: string | undefined;

  //if user came from login, receive new factorId
  if (!isEnrollment) {
    factorId = factorIdParams;
  } else {
    // if user would be enrolling mfa
    const { data: factorsData } = await supabase.auth.mfa.listFactors();
    factorId = factorsData?.totp.find((f) => f.id === factorIdParams && (f.status as string) === "unverified")?.id;
  }
  if (!factorId) redirect(isEnrollment ? "/profile" : "/overview");

  const { challengeId, error } = await challengeUserMfa(factorId);
  if (error || !challengeId) {
    redirect(isEnrollment ? "/profile" : "/overview");
  }

    return (
      <div className="flex flex-col w-full h-full">
        <VerifyQRPage factorId={factorId} challengeId={challengeId} mode={isEnrollment ? "enroll" : "challenge"}/>
      </div>
    );
}