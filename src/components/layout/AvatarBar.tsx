'use client'
import { Bell, Moon, PiggyBank, Plus, Settings, Sun } from "lucide-react";
import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import { usePathname } from "next/navigation";

export default function AvatarBar({}:{}) {
  const currentUrl = usePathname();

    return (
      <div className="relative flex w-full rounded-xl items-center justify-center gap-5 0 py-4">
        <div className="flex flex-auto w-auto" />

        <div className="flex w-fit h-full px-3 py-2 text-white rounded-[50%] border border-(--color-border-default) shadow-sm items-center justify-center bg-(--color-brand-green) hover:bg-emerald-600 hover:cursor-pointer transition-all duration-100">
          <Plus size={20}/>
        </div>

        <div className="flex w-fit h-full px-3 py-2 border border-(--color-border-default) rounded-xl shadow-sm items-center gap-2 hover:cursor-pointer hover:bg-(--color-border-subtle)">
          <PiggyBank size={20}/>
          <p className="text-[0.8rem]">Add an account</p>
        </div>

        {/* Settings + Notification icons */}
        <div className="flex border-(--color-border-default) border rounded-xl shadow-sm">
          <div className="flex w-full h-full py-3 pl-3 pr-2 rounded-l-xl transition-all duration-200">
            <Link href="./notifications/">
              <Bell
                size={20}
                className={`${currentUrl === "/notifications" ? "text-(--color-brand-green)" : null}`}
              />
            </Link>
          </div>

          <div className="flex w-full h-full py-3 pr-3 pl-2 rounded-r-xl transition-all duration-200">
            <Link href="./settings/">
              <Settings
                size={20}
                className={`${currentUrl === "/settings" ? "text-(--color-brand-green)" : null}`}
              />
            </Link>
          </div>
        </div>

        <ThemeSwitcher />
      </div>
    );
}