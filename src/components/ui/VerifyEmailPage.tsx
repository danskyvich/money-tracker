'use client'

import { useActionState, useEffect, useState } from "react"
import Input from "../layout/Input"
import { OTPData, OTPSchema } from "@/lib/schemas/OTPSchema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lock } from "lucide-react"
import Button from "../layout/Button"
import { useRouter } from "next/navigation"
import { verifyOtp } from "@/lib/auth/actions"

export default function VerifyEmailPage({searchParams}: {searchParams: {email?: string, rememberMe?: string}}) {
    useEffect(() => {
        document.title = "Verify your email"
    })

    const email = searchParams.email ?? "";
    const rememberMe = searchParams.rememberMe === "true";

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

    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
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
            <p className="font-mono text-[0.9rem]/5">
              We have sent you a verification email to {email}. Enter the
              One-time PIN (OTP) code that was sent to your email in the input
              box below.{" "}
            </p>
          </div>

          <form action={formAction}>
            <div className="flex flex-col flex-1 w-full h-full pt-13">
              <Input
                id="otp"
                name="otp"
                placeholder="000000"
                register={register}
                icon={<Lock size={15} />}
              />

              <div className="w-full h-fit flex gap-2 items-center justify-center">
                <p className="self-center">
                  <a
                    href=""
                    className={`text-[0.9rem] font-mono text-(--color-text-primary) hover:underline active:font-semibold ${resendDisabled && "text-(--color-text-secondary) pointer-events-none cursor-default"}`}
                    aria-disabled={resendDisabled === true ? true : false}
                  >
                    Resend code?
                  </a>
                </p>
                <p>
                  {timer}s
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 my-5">
              <button className="bg-(--color-brand-green) py-2 w-full h-fit rounded-xl mt-5 text-[0.9rem] hover:bg-emerald-600 active:bg-emerald-700 cursor-pointer" type="submit">
                <p>Verify email</p>
              </button>
              <Button
                text="Back"
                variant="secondary"
                className="w-full h-fit"
                onClick={() => router.back}
              />
            </div>
          </form>
        </div>
      </div>
    );
}