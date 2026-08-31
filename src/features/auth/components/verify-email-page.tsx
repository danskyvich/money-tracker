'use client'

import { useActionState, useEffect, useState } from "react"
import InputComponent from "@/components/layout/Input"
import { OTPData, OTPSchema } from "@/lib/schemas/OTPSchema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lock } from "lucide-react"
import Button from "../../../components/layout/button"
import { useRouter } from "next/navigation"
import { resendOtp, verifyOtp } from "@/lib/supabase/actions/auth"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import ErrorModal from "@/components/layout/error-modal"
import Spinner from "@/components/layout/spinner"

export default function VerifyEmailPage({email, rememberMe}:{email: string, rememberMe: boolean}) {
    useEffect(() => {
        document.title = "Verify your email"
    }, [])

    const {
        register,
        formState: {errors},
    } = useForm<OTPData>({
        resolver: zodResolver(OTPSchema),
        mode: "onChange",
    })  

    // states
    const router = useRouter();
    const [timer, setTimer] = useState(120);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [resendPending, setResendPending] = useState(false);
    const [resendError, setResendError] = useState<string | null>(null);
    const { executeRecaptcha } = useGoogleReCaptcha();

    // 120 seconds (2 minutes) timer
    useEffect(() => {

      const seconds = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(seconds);
            setResendDisabled(false)
            return 0;
          }
          return prev - 1;
        })
      }, 1000)

      return () => clearInterval(seconds);
    }, [])

    const [state, formAction, pending] = useActionState(
      async (prev: any, formData: FormData) => {
        const result = await verifyOtp(
          email,
          formData.get("otp") as string,
        )
        return result;
      },
      null
    )

    const handleResend = async () => {
      if (!executeRecaptcha || resendDisabled || resendPending) return;

      setResendPending(true);
      setResendError(null);

      const recaptchaToken = await executeRecaptcha("resend_otp");
      const result = await resendOtp(email, recaptchaToken);

      setResendPending(false);

      if (result?.error) {
        setResendError(result.error);
        return;
      }

      setTimer(120);
      setResendDisabled(true);
    }

    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        {
          resendError && <ErrorModal message={resendError}/>
        }
        {
          errors && <ErrorModal message={errors.root?.message}/>
        }
        {/* Centered modal */}
        <div className="flex flex-col bg-(--color-bg-subtle) p-10 rounded-xl w-150 shadow-md">
          {/*Header */}
          <div className="flex flex-col flex-1 w-full h-full gap-5">
            <p className="text-3xl text-(--color-text-primary) font-bold">
              Confirm{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                your email
              </span>
            </p>
            <p className="font-display text-[0.9rem]/5">
              We have sent you a verification email to<span className="font-semibold ml-1">{email}</span>. Enter the
              One-time PIN (OTP) code that was sent to your email in the input
              box below.{" "}
            </p>
          </div>

          <form action={formAction}>
            <div className="flex flex-col flex-1 w-full h-full pt-5">
              <InputComponent
                id="otp"
                name="otp"
                placeholder="000000"
                register={register}
                icon={<Lock size={15} />}
              />

              <div className="w-full h-fit flex gap-2 items-center justify-center">
                <p className="self-center">
                  <button
                    className={`text-[0.9rem] font-mono text-(--color-text-primary) hover:underline items-center justify-center active:font-semibold ${(resendDisabled || resendPending) && "text-(--color-text-secondary) pointer-events-none cursor-default"}`}
                    onClick={handleResend}
                    disabled={resendDisabled || resendPending}
                    aria-disabled={resendDisabled || resendPending}
                  >
                    {resendPending ? <Spinner/> : "Resend code"}
                  </button>
                </p>
                <p>{timer}s</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 my-5">
              <button
                disabled={pending}
                className="flex bg-(--color-brand-green) py-2 text-white text-center items-center justify-center w-full h-fit rounded-xl mt-5 text-[0.9rem] hover:bg-emerald-600 active:bg-emerald-700 cursor-pointer"
                type="submit"
              >
                {pending ? <Spinner/> : <p>Verify email</p>}
              </button>
              <button
                className="flex text-[0.9rem] border border-(--color-brand-green) rounded-lg items-center justify-center text-center py-1 hover:bg-(--color-brand-green) active:bg-emerald-600 active:text-white hover:text-white w-full h-fit"
                onClick={() => router.back()}
              >
                <p>Back</p>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}