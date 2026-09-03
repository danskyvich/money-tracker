'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "@/components/layout/spinner";
import { verifyUserMfa } from "@/lib/supabase/actions/auth";
import ErrorModal from "@/components/layout/error-modal";
import { Nfc } from "lucide-react";
import Image from "next/image";

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
        {verifyError && <ErrorModal message={verifyError} />}
        <div className="flex w-full gap-2 h-fit mb-5 items-center justify-center">
          <Image src="/favicon.ico" alt="web_app_logo" width={35} height={17} />
          <p className="font-bold text-4xl text-white">
            Money{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              Tracker
            </span>
          </p>
        </div>
        <div className="flex flex-col w-75 sm:w-120 xl:w-125 px-5 sm:px-10 lg:px-10 xl:px-15 py-10 bg-(--color-bg-subtle) border border-(--color-border-default) rounded-lg shadow-lg gap-2">
          {/* Header */}
          <div className="flex-col gap-1">
            <div className="flex w-full h-fit justify-center items-center gap-2">
              <Nfc size={18} className="min-w-3 h-auto" />
              <p className="flex text-[1rem] sm:text-xl font-semibold w-full h-fit items-center">
                {mode === "enroll"
                  ? "Set up your MFA"
                  : "Multi-factor authentication"}
              </p>
            </div>

            <p className="text-[0.9rem]/5 font-display mt-2">
              Enter the generated one-time, six-digit code from your
              authenticator app into the input field below
            </p>
          </div>

          <form action={handleSubmit} className="mt-5">
            <div className="flex flex-col">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="otp"
                name="otp"
                placeholder="000000"
                value={code}
                maxLength={6}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="flex px-3 py-1 border border-(--color-border-strong) focus:outline-1 focus:outline-emerald-700 text-center rounded-lg"
              />
            </div>
            {mode !== "enroll" && (
              <div className="flex px-3 gap-2 mt-1">
                <input
                  id="trustDeviceForThirtyDays"
                  type="checkbox"
                  onChange={(e) => setTrustDeviceChecked(e.target.checked)}
                  checked={trustDeviceChecked}
                />
                <label
                  htmlFor="trustDeviceForThirtyDays"
                  className="text-[0.8rem] sm:text-[0.9rem] font-light"
                >
                  Trust this device for 30 days?
                </label>
              </div>
            )}

            <div className="flex flex-col gap-2 mt-13">
              <button
                className="flex cursor-pointer border border-(--color-brand-green) hover:bg-(--color-brand-green) hover:text-white active:text-white active:bg-emerald-600 items-center justify-center py-2 rounded-xl w-full duration-100 transition-all text-[0.9rem]"
                onClick={() => router.back()}
                type="button"
              >
                <p>Back</p>
              </button>
              <button
                className="flex cursor-pointer items-center justify-center w-full text-white py-2 bg-(--color-brand-green) hover:bg-emerald-600 active:bg-emerald-700 rounded-lg duration-100 transition-all"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex py-1">
                    <Spinner />
                  </div>
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