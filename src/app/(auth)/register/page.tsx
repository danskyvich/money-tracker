"use client"

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { RegisterFormData, registerFormSchema } from "../../../lib/schemas/RegistrationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon, Lock, MailIcon, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link"

export default function RegisterPage() {
  const[showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    document.title = "Create an account"
  })

  const { register, formState: {errors}} = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    mode: "onChange",
  })
    return (
      <div className="flex flex-col items-center justify-center w-full">
        {/* Card */}
        <div className="flex flex-col w-fit h-fit px-15 py-20 bg-(--color-bg-subtle) rounded-2xl shadow-2xl">
          {/* Header */}
          <header className="text-center">
            <p className="text-5xl font-bold">
              Money{" "}
              <span className="bg-brand-gradient text-transparent bg-clip-text">
                Tracker
              </span>
            </p>
            <p className="font-mono font-light text-(--color-text-secondary) my-3">
              An average money tracker app for an average man
            </p>
          </header>

          {/* Main */}
          <form className="my-5">
            <Input
              placeholder="Create your username"
              icon={<User2 size={13} />}
              register={register}
              error={errors.username}
              label="Username"
              id="username"
              name="username"
            />
            <Input
              placeholder="Enter your email"
              icon={<MailIcon size={13} />}
              register={register}
              error={errors.email}
              label="Email"
              id="email"
              name="email"
            />
            <Input
              placeholder="Enter your password"
              icon={<Lock size={13} />}
              register={register}
              label="Password"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              leadingIcon={
                showPassword ? <EyeClosedIcon size={19} onClick={() => setShowPassword(false)}/> : <EyeIcon size={19} onClick={() => setShowPassword(true)}/>
              }
            />
            <Input
              placeholder="Retype your password"
              icon={<Lock size={13} />}
              register={register}
              error={errors.retypePassword}
              label="Retype password"
              id="retypedPassword"
              name="retypePassword"
              type={showPassword ? "text" : "password"}
              leadingIcon={
                showPassword ? <EyeClosedIcon size={19} onClick={() => setShowPassword(false)}/> : <EyeIcon size={19} onClick={() => setShowPassword(true)}/>
              }
            />
            <Button
            link="/overview"
            className="mt-4"
            text="Register"
            />
          </form>

          {/* Already had an account */}       
          <div className="flex w-full justify-center">
            <p className="text-(--color-text-secondary) font-mono text-[0.8rem]">Already had an account? <Link href="/login" className="hover:underline hover:font-bold italic">Log in</Link>{" "}instead</p>
          </div> 
        </div>
      </div>
    );
}