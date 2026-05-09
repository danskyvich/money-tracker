"use client"

import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import { LoginFormData, loginSchema } from "../../../lib/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, MailIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import {useForm} from "react-hook-form";

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
        <Card
          header={
            <div className="flex flex-col items-center justify-center">
              <p className="text-[var(--color-text-primary)] font-extrabold text-5xl mt-10 mb-2">
                Money{" "}
                <span className="bg-brand-gradient bg-clip-text text-transparent">
                  Tracker
                </span>
              </p>
              <p className="font-mono text-center my-3 mx-10 text-[var(--color-text-secondary)]">
                An average money tracker app for an average man.
              </p>
            </div>
          }
          content={
            <>
              <form className="w-full">
                <Input
                  placeholder="sample@email.com"
                  label="Email"
                  id="email"
                  type="email"
                  icon={<MailIcon size={18} />}
                  register={register}
                  name={"username"}
                  error={errors.username}
                  className=""
                />
                <Input
                  placeholder="min. 3 characters"
                  label="Password"
                  id="password"
                  type="password"
                  icon={<Lock size={18} />}
                  register={register}
                  name={"password"}
                  error={errors.password}
                  className=""
                />

                <div className="gap-2 px-6">
                  <Button
                    text="Log in"
                    type="button"
                    icon={<></>}
                    className=""
                    link="/overview"
                  >
                  </Button>
                </div>
              </form>

              <div className="relative my-5 block px-6 w-full">
                <hr className="border-[var(--color-border-strong)]" />
                <span className="text-[var(--color-border-strong)] text-[0.9rem] absolute pt-0 px-3.75 top-[50%] left-[50%] translate-[-50%] bg-[var(--color-bg-secondary)]">
                  or
                </span>
              </div>

              <div className="flex flex-col px-6 gap-5 w-full">
                <Button
                  variant="secondary"
                  text="Sign in using Google"
                  icon={<GoogleIcon width={20} height={20} />}
                  className=""
                  link=""
                />
                <Button
                  variant="secondary"
                  text="Sign in using Facebook"
                  icon={<FacebookIcon width={20} height={20} />}
                  className=""
                  link=""
                />
              </div>
            </>
          }
          footer={
            <div className="flex items-center font-light justify-center mt-5 text-[0.85rem]">
              <p className="text-[var(--color-text-secondary)]">
                No account?{" "}
                <Link
                  className="hover:cursor-pointer hover:underline duration-200 font-semibold"
                  href="/register/"
                >
                  Create a new account
                </Link>{" "}
                instead
              </p>
            </div>
          }
        />
      </div>
    );
}