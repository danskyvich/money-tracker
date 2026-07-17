'use client'

import { CircleQuestionMark, Code, NfcIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import Input from "../layout/Input";
import { useForm } from "react-hook-form";
import { OTPData, OTPSchema } from "@/utils/schemas/OTPSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AuthMFAPage() {
    const router = useRouter();
    const [trustDeviceChecked, setTrustDeviceChecked] = useState<boolean>(false)

    const [state, formAction, pending] = useActionState(
        async (_prevState:any, formData: FormData) => {
            const code = formData.get("secondFactorCode");
        },
        null,
    )

    const { register, formState: { errors }} = useForm<OTPData>({
        resolver: zodResolver(OTPSchema),
        mode: "onChange"
    })
    return (
      <div className="flex flex-col w-full h-full items-center justify-center gap-10">
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
              Enter the generated one-time, six-digit code from your authenticator app
              into the input field below
            </p>
          </div>

          <form action={formAction} className="mt-5">
            <div className="flex flex-col">
              <Input
                id="otp"
                name="otp"
                placeholder="000000"
                register={register}
                icon={<Code size={15} />}
              />
            </div>
            <div className="flex px-3 gap-2">
              <input id="trustDeviceForThirtyDays" type="checkbox" onChange={(e) => setTrustDeviceChecked(e.target.checked)} checked={trustDeviceChecked}/>
              <label htmlFor="trustDeviceForThirtyDays" className="text-[0.9rem] font-light">
                Trust this device for 30 days?
              </label>
            </div>

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
              >
                <p className="text-[0.9rem]">
                  {pending ? "Verifying..." : "Verify"}
                </p>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}