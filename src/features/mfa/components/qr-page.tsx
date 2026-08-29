"use client"

import ErrorModal from "@/components/layout/error-modal";
import Spinner from "@/components/layout/spinner";
import { enrollUserMfa } from "@/lib/supabase/actions/auth";
import { NfcIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function QR() {
    const router = useRouter();
    const [qrCode, setQrCode] = useState<string | null>(null)
    const [factorId, setFactorId] = useState<string | null>(null);
    const [secret, setSecret] = useState<string | null>(null);
    const [setupError, setSetupError] = useState<string | null>(null);
    const [forwardError, setForwardError] = useState<string | null>(null);
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
          return;
        }

        setFactorId(enrollRes.factorId as string);
        setQrCode(enrollRes.qr_code as string)
        setSecret(enrollRes.secret as string)
        setLoading(false)
      }

      setup()
      return () => {
        cancelled = true;
      };
    }, []);
    
    function handleVerify() {
      if (!factorId) {
        setForwardError("No factor id found.");
        return;
      };
      router.push(`/verify/mfa?mode=enroll&factorId=${factorId}`)
    }
  
    return (
      <div className="flex flex-col w-full h-full bg-(--color-bg-secondary)">
        {setupError && (
          <div className="fixed inset-0 z-50 bg-(--color-bg-secondary) flex flex-col w-full h-full items-center justify-center">
            <div className="flex w-fit h-fit gap-2 my-5">
              <X size={15} className="min-w-3 h-auto text-red-500" />
              <p className="font-mono text-red-500 ">{setupError}</p>
            </div>

            <button
              onClick={() => router.back()}
              className="flex w-fit h-fit px-15 py-1 rounded-lg cursor-pointer duration-100 transition-all border border-(--color-brand-green) hover:bg-(--color-brand-green)"
            >
              <p className="text-[0.9rem]">Back</p>
            </button>
          </div>
        )}
        {
          forwardError && <ErrorModal message={forwardError}/>
        }
        {loading ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col justify-center gap-5 w-full h-full items-center">
            <p className="font-bold text-4xl">
              Money{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                Tracker
              </span>
            </p>

            <div className="flex flex-col gap-5 mt-5 px-7 py-5 w-100 bg-(--color-bg-subtle) border border-(--color-border-subtle) rounded-xl shadow-md">
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
                <div className="bg-white p-2 rounded-lg self-center">
                  <img
                    src={qrCode ?? undefined}
                    alt="mfaQrCode"
                    width={200}
                    height={200}
                  />
                </div>
              </div>

              <p className="text-[0.9rem] font-mono">
                or, enter the code below manually
              </p>

              {/* Code */}
              <div className="flex w-full h-fit px-5 py-3 rounded-xl shadow-md border border-(--color-border-strong) bg-cyan-950 justify-center items-center">
                <p className="font-semibold text-[0.9rem]">{secret}</p>
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
                  {loading ? (
                    <Spinner />
                  ) : (
                    <p className="text-[0.9rem]">Verify</p>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}