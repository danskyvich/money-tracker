"use client"

import { useForm } from "react-hook-form";
import Input from "../layout/Input";
import { LoginFormData, loginSchema } from "../../lib/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import {generalSignIn} from "@/lib/auth/actions";
import { useRouter } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const GoogleIcon = (
  props: React.SVGProps<SVGSVGElement>,
): React.ReactElement => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://ww.w3.org/2000/svg"
    width={20}
    height="auto"
  >
    <path d="M12 11h8.533c.044.385.067.78.067 1.184 0 2.734-.98 5.036-2.678 6.6-1.485 1.371-3.518 2.175-5.942 2.175A8.853 8.853 0 0 1 3.125 12a8.853 8.853 0 0 1 8.855-8.96c2.4 0 4.414.87 5.965 2.306L16.17 7.132C15.065 6.105 13.616 5.5 12 5.5a6.48 6.48 0 0 0-6.498 6.5A6.48 6.48 0 0 0 12 18.5c3.392 0 5.836-2.302 6.218-5.5H12v-2z" />
  </svg>
);

const FacebookIcon = (
  props: React.SVGProps<SVGSVGElement>,
): React.ReactElement => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height="auto"
  >
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
);

export default function LoginPage() {

  // states
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  // loginAction from lib/auth/actions.ts
  const [state, formAction, pending] = useActionState(
    async (prev: any, formData: FormData) => {

      //reCAPTCHA fetch token
      if (!executeRecaptcha) {
        return { error: "reCAPTCHA not yet ready, please try again."}
      }
      const recaptchaToken = await executeRecaptcha("login");

      const result = await generalSignIn(
        formData.get("email") as string,
        formData.get("rememberMe") === "on",
        recaptchaToken,
      );
      return result;
    },
    null,
  );

  // change document name
  useEffect(() => {
    document.title = "Sign in to Money Tracker";
  });

  // zod validation
  const {
    register,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Card */}
      <div className="flex w-135 h-fit flex-col rounded-2xl bg-(--color-bg-subtle) px-15 py-20 shadow-2xl">
        {/* Header */}
        <header className="text-center">
          <p className="font-bold text-5xl">
            Money{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              Tracker
            </span>
          </p>
          <p className="font-mono font-light my-3 text-(--color-text-secondary)">
            An average money tracker app for an average man
          </p>
        </header>

        {/* Main */}
        <form className="my-5" action={formAction}>
          <Input
            register={register}
            label="Email"
            placeholder="Enter your email address"
            id="email"
            icon={<MailIcon size={13} />}
            type="email"
            name="email"
            required
          />

          {/* Remember me? */}
          <div className="flex w-full gap-2 px-2 items-center">
            <label className="text-[0.9rem]">
              <input
                type="checkbox"
                name="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              Remember me?
            </label>
          </div>

          {/* Error */}
          {state?.error && (
            <p className="text-[0.9rem] text-red-500">{state.error}</p>
          )}

          {/* Recaptcha here */}


          <div className="flex w-full flex-col h-fit gap-4">
            <button
              disabled={loading}
              className="w-full text-[0.9rem] mt-10 bg-(--color-brand-green) rounded-xl py-2 cursor-pointer hover:bg-emerald-700 active:bg-emerald-800 transition-all duration-100"
            >
              {loading ? "Signing In..." : "Sign in"}
            </button>
          </div>
        </form>

        {/* --- or --- */}
        <div className="relative flex text-center items-center ">
          <hr className="flex-1 border border-(--color-border-subtle)" />
          <span className="px-3 text-sm text-(--color-text-secondary) bg-(--color-bg-subtle)">
            or
          </span>
          <hr className="flex-1 border border-(--color-border-subtle)" />
        </div>

        {/* Provider buttons for sign in */}
        <div className="flex w-full gap-2 mt-5 mb-2 items-center justify-center">
          <FacebookIcon
            className="cursor-pointer"
            onClick={() => alert("Google sign up coming soon!")}
          />
          <GoogleIcon
            className="cursor-pointer"
            onClick={() => alert("Facebook sign up coming soon!")}
          />
        </div>

        <div className="flex w-full mt-2 text-(--color-text-secondary) text-[0.8rem] font-mono items-center justify-center">
          <p className="text-center">
            By creating an account, you agree to our{" "}
            <span
              className="text-(--color-text-primary) hover:underline cursor-pointer"
              onClick={() => router.push("/privacy-policy")}
            >
              Privacy Policy
            </span>{" "}
            and{" "}
            <span
              className="hover:underline cursor-pointer text-(--color-text-primary)"
              onClick={() => router.push("/terms-and-conditions")}
            >
              Terms and Conditions
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}