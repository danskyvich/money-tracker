'use client'

import Card from "@/components/ui/Card"
import { useEffect, useState } from "react"
import { useUser } from "@/lib/hooks/useUser"
import {CircleQuestionMark, LogOutIcon, X } from "lucide-react"

export default function Profile() {

    useEffect(() => {
        document.title = 'Profile'
    })

    const profile = [
      {item: "Change password", value: "Change", icon: <CircleQuestionMark size={15}/>},
      {item: "Sign out of your account", value: "Sign out", icon: <LogOutIcon size={15}/>},
      {item: "Delete your account", value: "Delete account", icon: <X size={15}/>},
    ]
    const t = useUser();

    return (
      <div className="flex flex-col w-full h-full">
        <p className="font-semibold text-3xl pb-5">Profile</p>
        <div className="flex w-full h-full border border-(--color-border-default) rounded-lg shadow-md">
          <div className="flex flex-col w-full h-full p-5">
            {/* User header */}
            <div className="flex flex-0 w-full h-fit gap-5 p-5 rounded-xl bg-linear-to-r mb-2 from-slate-800 to-emerald-600">
              {/* Avatar */}
              <div className="flex bg-(--color-brand-gold) h-fit rounded-[50%] px-4 py-3">
                <p className="text-black">DP</p>
              </div>

              {/* User information */}
              <div className="flex flex-col w-full h-fit">
                <p className="text-lg font-mono text-white">
                  <span>{t.user.first_name}</span>{" "}
                  <span>{t.user.last_name}</span>
                </p>
                <p className="text-sm text-white font-mono">{t.user.email}</p>
              </div>

              <div className="flex flex-auto w-auto h-fit" />
            </div>

            {profile.map((item, index) => (
              <div
                className="grid grid-cols-[1fr_1fr] w-full h-fit text-[0.9rem] px-5 py-2 items-center"
                key={index}
              >
                <p>{item.item}</p>

                <div className="flex w-fit h-fit ring ring-inset ring-(--color-brand-green) text-[0.9rem] items-center justify-self-end gap-2 hover:bg-(--color-brand-green) whitespace-nowrap hover:text-white rounded-lg shadow-md px-5 py-1 transition-all duration-100 cursor-pointer">
                  {item.icon === null ? null : item.icon}
                  <p>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}