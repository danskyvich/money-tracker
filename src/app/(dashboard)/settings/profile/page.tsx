'use client'

import Card from "@/components/ui/Card"
import { useEffect, useState } from "react"
import { useUser } from "@/lib/hooks/useUser"
import SettingItem from "@/components/layout/SettingItem"
import Switcher from "@/components/ui/Switcher"
import Button from "@/components/ui/Button"
import { CircleQuestionMarkIcon } from "lucide-react"

export default function Profile() {

    useEffect(() => {
        document.title = 'Profile'
    })
    const t = useUser();

    // Modal states
    const [isDelete, setDelete] = useState<boolean>(false);

    return (
      <div className="flex flex-col w-full h-full p-5 gap-1">
        {/* User header */}
        <div className="flex flex-1 w-full h-fit gap-5 p-5 bg-linear-to-r from-gray-800 to-slate-900 rounded-3xl shadow-lg ">
          {/* Avatar */}
          <div className="flex bg-(--color-brand-gold) h-fit rounded-[50%] px-4 py-3">
            <p className="text-(--color-text-primary)">DP</p>
          </div>

          {/* User information */}
          <div className="flex flex-col w-full h-fit">
            <p className="text-lg font-mono">
              <span>{t.user.first_name}</span> <span>{t.user.last_name}</span>
            </p>
            <p className="text-sm text-(--color-text-secondary) font-mono">
              {t.user.email}
            </p>
          </div>

          <div className="flex flex-auto w-auto h-fit" />
        </div>

        <div className="flex flex-col p-5 w-full h-fit gap-3">
          <SettingItem label="Enable multi-factor authentication">
            <Switcher />
          </SettingItem>

          <SettingItem label="Change password" icon={<CircleQuestionMarkIcon size={20}/>} tooltip="Your password cannot be changed if you signed up using Google">
            <Button
              text="Change password"
              link="/"
              disabled
              className="px-5"
              variant="ghost"
            />
          </SettingItem>

          <SettingItem label="Sign out">
            <Button text="Sign out" link="./../login" className="px-5" variant="ghost"/>
          </SettingItem>

          <SettingItem label="Delete account">
            <Button
              text="Delete"
              variant="danger"
              link="./../login"
              className="px-5"
            />
          </SettingItem>
        </div>
      </div>
    );
}