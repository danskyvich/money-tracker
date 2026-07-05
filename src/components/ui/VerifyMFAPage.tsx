"use client";

import { challengeUserMfa, verifyUserMfa } from "@/lib/auth/actions";
import { Code, NfcIcon, Pin } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useRef, useState } from "react";

export default function VerifyMFAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const factorId = searchParams.get("factorId");
  const [challengeId, setChallengeId] = useState(
    searchParams.get("challengeId"),
  );
  const [setupError, setSetupError] = useState<string | null>(null);

  const [state, verifyMfaAction, pending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const code = formData.get("authAppCode");
      if (!factorId || !challengeId)
        return { error: "Missing factorId or challengeId" };
      return await verifyUserMfa(factorId, challengeId, code as string);
    },
    null,
  );

  async function handleResendChallenge() {
    if (!factorId) return;
    const challengeRes = await challengeUserMfa(factorId);
    if (challengeRes.error) {
      setSetupError(challengeRes.error);
      return;
    }
    setChallengeId(challengeRes.challengeId as string);
  }

  if (pending) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-[0.9rem] font-mono">Loading the page...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* Card */}
      <div className="flex flex-col w-full h-full justify-center items-center gap-10">
        <p className="font-bold text-4xl">
          Money{" "}
          <span className="bg-brand-gradient bg-clip-text text-transparent">
            Tracker
          </span>
        </p>

        {/* Header */}
        <div className="flex flex-col w-100 px-5 py-10 bg-(--color-bg-secondary) border border-(--color-border-default) rounded-lg shadow-md gap-2">
          <div className="flex items-center gap-2">
            <NfcIcon size={20} />
            <p className="text-2xl font-semibold">Input authenticator code</p>
          </div>

          <p className="text-[0.85rem]/5 font-mono mt-5">
            Enter the six-time code in your authenticator app below to finish
            setting up your multi-factor authentication.
          </p>

          <form action={verifyMfaAction} className="mt-5">
            <div className="flex flex-col">
              <input
                placeholder="012345"
                name="authAppCode"
                id="authAppCode"
                className="border border-(--color-border-strong) rounded-lg w-full px-3 py-1"
              />
              <p
                className="hover:underline cursor-pointer text-center text-[0.9rem] mt-2"
                onClick={handleResendChallenge}
              >
                Resend code
              </p>
            </div>

            {state?.error && (
              <p className="text-red-500 text-[0.9rem]">{state?.error}</p>
            )}

            <div className="flex flex-col gap-2 mt-13">
              <button
                className="flex cursor-pointer hover:bg-yellow-600 hover:ring-yellow-600 active:ring-yellow-700 active:bg-yellow-700 items-center justify-center py-1 ring ring-inset ring-(--color-brand-gold) rounded-xl w-full duration-100 transition-all text-[0.9rem]"
                onClick={() => router.back()}
                type="button"
              >
                <p>Back</p>
              </button>
              <button
                className="flex cursor-pointer items-center justify-center w-full py-1 bg-(--color-brand-green) hover:bg-emerald-600 active:bg-emerald-700 rounded-lg duration-100 transition-all"
                type="submit"
              >
                <p className="text-[0.9rem]">
                  {pending ? "Verifying..." : "Verify"}
                </p>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
