'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "@/components/layout/spinner";
import { verifyUserMfa } from "@/lib/supabase/actions/auth";
import ErrorModal from "@/components/layout/error-modal";

interface VerifyQRPage {
  challengeId: string,
  factorId: string,
  mode: string,
}

export default function VerifyQRPage({challengeId, factorId, mode}:VerifyQRPage) {
    const router = useRouter();
    const [trustDeviceChecked, setTrustDeviceChecked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [code, setCode] = useState<string>("");
    const [verifyError, setVerifyError] = useState<string | null>(null);

    const handleSubmit = async() => {
      setLoading(true);
      setVerifyError(null);
      const redirectTo = mode === "enroll" ? "/profile" : "/overview";
      const result = await verifyUserMfa(factorId, challengeId, code, trustDeviceChecked, redirectTo);
      setVerifyError(result.error ?? "Verification failed");
      setLoading(false);
    }
    return (
      <div className="flex flex-col w-full h-full items-center justify-center gap-10">
        {
          verifyError && (
            <ErrorModal message={verifyError}/>
          )
        }
        <div className="flex flex-col w-150 px-15 py-20 bg-(--color-bg-subtle) border border-(--color-border-default) rounded-lg shadow-md gap-2">
          {/* Header */}
          <div className="flex-col gap-1">
            <p className="text-3xl text-(--color-text-primary) font-bold">
              Check your{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                authentication
              </span>{" "}
              app
            </p>

            <p className="text-[0.85rem]/5 font-mono mt-5">
              Enter the generated one-time, six-digit code from your
              authenticator app into the input field below
            </p>
          </div>

          <form action={handleSubmit} className="mt-5">
            <div className="flex flex-col">
              <input
              type="text"
                id="otp"
                name="otp"
                placeholder="000000"
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            {mode !== "enroll" && (
              <div className="flex px-3 gap-2">
                <input
                  id="trustDeviceForThirtyDays"
                  type="checkbox"
                  onChange={(e) => setTrustDeviceChecked(e.target.checked)}
                  checked={trustDeviceChecked}
                />
                <label
                  htmlFor="trustDeviceForThirtyDays"
                  className="text-[0.9rem] font-light"
                >
                  Trust this device for 30 days?
                </label>
              </div>
            )}

            <div className="flex flex-col gap-2 mt-13">
              <button
                className="flex cursor-pointer hover:bg-(--color-brand-gold) hover:ring-(--color-brand-gold) active:ring-yellow-600 active:bg-yellow-700 items-center justify-center py-2 ring ring-inset ring-(--color-brand-gold) rounded-xl w-full duration-100 transition-all text-[0.9rem]"
                onClick={() => router.back()}
                type="button"
              >
                <p>Back</p>
              </button>
              <button
                className="flex cursor-pointer items-center justify-center w-full py-2 bg-(--color-brand-green) hover:bg-emerald-600 active:bg-emerald-700 rounded-lg duration-100 transition-all"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <p className="text-[0.9rem]">Verify</p>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}