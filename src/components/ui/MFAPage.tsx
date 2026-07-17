"use client"

import { challengeUserMfa, enrollUserMfa } from "@/services/supabase/actions";
import { CircleAlert, NfcIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function MFAPage() {
    const router = useRouter();
    const [challengeId, setChallengeId] = useState<string | null>(null);
    const [qrCode, setQrCode] = useState<string | null>(null)
    const [factorId, setFactorId] = useState<string | null>(null);
    const [secret, setSecret] = useState<string | null>(null);
    const [setupError, setSetupError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true)
    const hasRun = useRef(false)

    // begin mfa enrollment on page load
    useEffect(() => {
      if (hasRun.current) return;
      hasRun.current = true;

      let cancelled = false;

      // begin mfa implemention by enrolling the current device
      async function setup() {
        const enrollRes = await enrollUserMfa();
        if (cancelled) return;
        if (enrollRes.error) {
          setSetupError(enrollRes.error);
          setLoading(false)
          return
        }

        setFactorId(enrollRes.factorId as string);
        setQrCode(enrollRes.qr_code as string)
        setSecret(enrollRes.secret as string)

        // begin mfa challenge
        const challengeRes = await challengeUserMfa(enrollRes.factorId as string);
        if (cancelled) return;
        if (challengeRes.error) {
          setSetupError(challengeRes.error)
          setLoading(false)
          return
        }
        setChallengeId(challengeRes.challengeId as string)
        setLoading(false)
      }

      setup()
      return () => {
        cancelled = true;
      };
    }, [])

    if (loading) return <div className="flex flex-col items-center justify-center w-full h-full"><p className="text-[0.9rem] font-mono">Setting up multi-factor authentication...</p></div>
    if (setupError) return (
      <div className="flex flex-col w-full h-full items-center justify-center gap-10">

        <p className="font-bold text-4xl">
          Money{" "}
          <span className="bg-brand-gradient bg-clip-text text-transparent">
            Tracker
          </span>
        </p>

        <div className="flex flex-col bg-(--color-bg-secondary) gap-2 w-100 border border-(--color-border-strong) rounded-lg p-5 shadow-md">
          {/* Header */}
          <div className="flex gap-2 w-full items-center">
            <CircleAlert size={20} />
            <p>MFA setup error</p>
          </div>

          <p className="font-mono text-[0.9rem]/5 text-red-500">{setupError}</p>
        </div>
      </div>
    );
    
    function handleVerify() {
      if (!factorId || !challengeId) return;
      router.push(`/verify-2fa?factorId=${factorId}&challengeId=${challengeId}`)
    }
  
    return (
      <div className="flex flex-col w-full h-full">
        {/* Card */}
        <div className="flex flex-col justify-center gap-5 w-full h-full items-center">
          <p className="font-bold text-4xl">
            Money{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              Tracker
            </span>
          </p>

          <div className="flex flex-col gap-7 mt-5 px-7 py-5 w-100 bg-(--color-bg-secondary) border border-(--color-border-subtle) rounded-xl shadow-md">
            {/* Headers */}
            <div className="flex items-center gap-2">
              <NfcIcon size={20} />
              <p className="text-2xl font-semibold">Set up your MFA</p>
            </div>

            <p className="text-[0.85rem]/5 font-mono mt-5">
              Scan this QR code or enter the code below into your preferred
              authenticator application.
            </p>

            <div className="flex flex-col w-full justify-center">
              {/* QR code */}
              <img
                src={qrCode ?? undefined}
                alt="mfaQrCode"
                className="self-center flex"
              />

              <p className="text-[0.9rem] font-mono">
                or, enter the code below manually
              </p>

              {/* Code */}
              <div className="flex w-full h-fit px-5 py-3 rounded-xl shadow-md border border-(--color-border-strong) bg-cyan-950 justify-center items-center mt-5">
                <p className="font-semibold text-[0.9rem]">{secret}</p>
              </div>
            </div>

            <div className="flex w-full h-fit gap-5 mt-5">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex flex-1 cursor-pointer transition-all duration-100 items-center justify-center w-full border border-(--color-border-strong) rounded-xl hover:bg-(--color-brand-green) active:bg-emerald-700 px-5 py-2"
              >
                <p className="text-[0.9rem]">Back</p>
              </button>
              <button
                type="button"
                className="flex flex-1 cursor-pointer transition-all duration-100 w-full bg-(--color-brand-green) items-center justify-center rounded-xl hover:bg-emerald-600 active:bg-emerald-700 px-5 py-2"
                onClick={handleVerify}
              >
                {
                  <p className="text-[0.9rem]">
                    {loading ? "Verifying..." : "Verify"}
                  </p>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}