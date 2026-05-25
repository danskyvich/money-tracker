"use client"

import { useForm } from "react-hook-form";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import { LoginFormData, loginSchema } from "../../../lib/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosed, EyeIcon, Lock, MailIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const GoogleIcon = (
  props: React.SVGProps<SVGSVGElement>,
): React.ReactElement => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://ww.w3.org/2000/svg"
  >
    <path d="M12 11h8.533c.044.385.067.78.067 1.184 0 2.734-.98 5.036-2.678 6.6-1.485 1.371-3.518 2.175-5.942 2.175A8.853 8.853 0 0 1 3.125 12a8.853 8.853 0 0 1 8.855-8.96c2.4 0 4.414.87 5.965 2.306L16.17 7.132C15.065 6.105 13.616 5.5 12 5.5a6.48 6.48 0 0 0-6.498 6.5A6.48 6.48 0 0 0 12 18.5c3.392 0 5.836-2.302 6.218-5.5H12v-2z" />
  </svg>
);

export const FacebookIcon = (
  props: React.SVGProps<SVGSVGElement>,
): React.ReactElement => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    document.title = "Sign in to Money Tracker"
  })

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
        <div className="flex w-fit h-fit flex-col rounded-2xl bg-(--color-bg-subtle) px-15 py-20 shadow-2xl">
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
          <form className="my-5">
            <Input
              register={register}
              label="Email"
              placeholder="Enter your email address"
              id="email"
              icon={<MailIcon size={13} />}
              type="email"
              name="username"
            />
            <Input
              register={register}
              label="Password"
              placeholder="Enter your password"
              id="password"
              icon={<Lock size={13} />}
              type={showPassword ? "text" : "password"}
              name="password"
              leadingIcon={
                showPassword ? <EyeClosed size={19} onClick={() => setShowPassword(false)}/>
                :
                <EyeIcon size={19} onClick={() => setShowPassword(true)}/>
              }
            />
            <Button link="/overview" text="Log in" className="mt-4" />
          </form>

          <div className="relative flex text-center items-center ">
            <hr className="flex-1 border border-(--color-border-subtle)" />
            <span className="px-3 text-sm text-(--color-text-secondary) bg-(--color-bg-subtle)">
              or
            </span>
            <hr className="flex-1 border border-(--color-border-subtle)" />
          </div>

          {/* Register */}
          <Button text="Sign up" link="/register" variant="secondary" className="mt-4"/>
        </div>
      </div>
    );
}