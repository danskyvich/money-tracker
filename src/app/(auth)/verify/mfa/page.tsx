import VerifyQRPage from "@/features/mfa/verify-qr-page";
import { challengeUserMfa } from "@/lib/supabase/actions/auth";
import { createClient } from "@/lib/supabase/clients/server";
import { redirect } from "next/navigation";

export default async function VerifyMFA({searchParams}: {searchParams: Promise<{mode?: string; factorId?: string}>}) {
  const { mode, factorId: factorIdParams } = await searchParams;
  console.log(mode, factorIdParams);
  const isEnrollment = mode === "enroll";
  const supabase = await createClient();

  let factorId: string | undefined;

  //if user came from login, receive new factorId
  if (!isEnrollment) {
    factorId = factorIdParams;
  } else {
    // if user would be enrolling mfa
    const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
      factorId = factorsData?.all.find((f) => f.id === factorIdParams && f.factor_type === "totp" && (f.status as string) === "unverified")?.id;
  }

  // if there is no factorId, return to profile
  if (!factorId) redirect (isEnrollment ? "/profile" : "/overview");

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