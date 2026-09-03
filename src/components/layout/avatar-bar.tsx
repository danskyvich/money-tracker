'use client'
import { Bell, Database, LayoutDashboard, LayoutDashboardIcon, List, Moon, PiggyBank, Plus, Settings, SettingsIcon, Sun, User2Icon, Wallet } from "lucide-react";
import Link from "next/link";
import ThemeSwitcher from "./theme-switcher";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AvatarBar() {
  const currentUrl = usePathname();

  const [navigation, setNavigation] = useState<boolean>(false);

  const links = [
    { name: "Dashboard", link: "/overview", icon: <LayoutDashboardIcon size={18} className="min-w-3 h-auto"/> },
    { name: "Transactions", link: "/transactions", icon: <Wallet size={18} className="min-w-3 h-auto"/> },
    { name: "Accounts", link: "/accounts", icon: <PiggyBank size={18} className="min-w-3 h-auto"/> },
    { name: "Profile", link: "/profile", icon: <User2Icon size={18} className="min-w-3 h-auto"/> },
    { name: "Backup", link: "/backup", icon: <Database size={18} className="min-w-3 h-auto"/> },
    { name: "Settings", link: "/settings", icon: <SettingsIcon size={18} className="min-w-3 h-auto"/> },
  ];

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) setNavigation(false);
    }
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const handleClickLink = (link: string) => {
    setNavigation(false);
    redirect(link);
  }

    return (
      <>
        <div className="relative flex w-full rounded-xl items-center justify-center gap-5 0 py-4">
          <div className="block md:hidden">
            <div
              className="flex border border-(--color-border-default) rounded-lg p-3 hover:bg-(--color-bg-subtle) active:bg-(--color-brand-green) active:text-white cursor-pointer duration-100 transition-all"
              onClick={() => setNavigation((prev) => !prev)}
            >
              <List size={20} className="min-w-3 h-auto" />
            </div>
          </div>

          <div className="flex w-full h-fit" />

          <div className={`flex gap-5 ${navigation && "hidden"}`}>
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
          {navigation && (
            <div className="fixed w-full flex md:hidden top-16 bottom-0 left-0 right-0 z-50 bg-black/70 border-b border-(--color-border-default)/20 shadow-md">
              <div className="flex flex-col bg-(--color-bg-secondary) w-full h-fit pt-3">
                <p className="text-xl font-semibold px-5 py-3 border-b border-(--color-border-subtle)">
                  Navigation
                </p>
                {links.map((item, id) => (
                  <div
                    className={`flex w-full h-fit py-3 px-5 gap-2 cursor-pointer border-b border-(--color-border-subtle) hover:bg-(--color-bg-subtle) ${item.link === currentUrl && "bg-(--color-brand-green) text-white hover:bg-emerald-600 active:bg-emerald-700"}`}
                    key={id}
                    onClick={() => handleClickLink(item.link)}
                  >
                    {item.icon}
                    <p className="text-[0.9rem] font-display flex">
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
}