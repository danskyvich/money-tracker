"use client"

import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import { RegisterFormData, registerFormSchema } from "../../../lib/schemas/RegistrationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, LockIcon, MailIcon, User2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link"

export default function RegisterPage() {

  useEffect(() => {
    document.title = "Create an account"
  })

  const { register, formState: {errors}} = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    mode: "onChange",
  })
    return (
      <div className="flex flex-col items-center justify-center w-full">
        {/**Card */}
        <Card
          header={
            <header className="flex flex-col w-full">
              <div className="flex flex-col items-center justify-center">
                <p className="text-[var(--color-text-primary)] font-extrabold text-5xl mt-10 mb-2">
                  Money{" "}
                  <span className="bg-brand-gradient bg-clip-text text-transparent">
                    Tracker
                  </span>
                </p>
                <p className="font-mono text-center my-3 mx-10 text-[var(--color-text-secondary)]">
                  Create a new account
                </p>
              </div>
            </header>
          }
          content={
            <div className="flex flex-col w-full">
              <Input
                id="email"
                register={register}
                name={"email"}
                label={"Email"}
                placeholder={"sample@email.com"}
                icon={<MailIcon size={18} />}
                type={"text"}
                className=""
                error={errors.email}
              />
              <Input
                id="username"
                register={register}
                name={"username"}
                label={"Username"}
                placeholder={"Enter your username here"}
                icon={<User2 size={18} />}
                type={"text"}
                className=""
                error={errors.username}
              />
              <Input
                id="password"
                register={register}
                name={"password"}
                label={"Password"}
                placeholder={"Minimum of 8 characters"}
                icon={<LockIcon size={18} />}
                type={"password"}
                className=""
                error={errors.password}
              />
              <Input
                id="retypePassword"
                register={register}
                name={"retypePassword"}
                label={"Retype password"}
                placeholder={"Minimum of 8 characters"}
                icon={<LockIcon size={18} />}
                type={"password"}
                className=""
                error={errors.retypePassword}
              />
              <div className="flex flex-col w-full">
                <Button
                  text="Create your account"
                  icon={<ArrowRightIcon/>}
                  className=""
                  link=""
                />
              </div>
            </div>
          }
          footer={<footer className="flex flex-col w-full items-center">
            <p className="mt-3 font-light text-[0.85rem] text-[var(--color-text-secondary)]">Already have an account? <Link href="/login/" className="font-bold hover:underline">Sign in</Link>{" "}instead</p>
          </footer>}
        />
      </div>
    );
}