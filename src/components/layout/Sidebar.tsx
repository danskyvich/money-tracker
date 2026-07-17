"use client"

import { usePathname } from "next/navigation";
import { SidebarItem } from "./SidebarItem";
import { BaggageClaimIcon, Database, LayoutDashboardIcon, LogInIcon, Settings, User, UserIcon, Wallet2Icon } from "lucide-react";
import { useState } from "react";

export default function Sidebar({className, email, lastLogIn}:{className?: string, email: string, lastLogIn: string}) {

    // states
    const path = usePathname();
    const [isMinimized, setIsMinimized] = useState(false);

    const OverviewItems = [
      {
        icon: <LayoutDashboardIcon size={20} />,
        label: "Dashboard",
        path: "/overview",
        isActive: false,
      },
      {
        icon: <Wallet2Icon size={20} />,
        label: "Transactions",
        path: "/transactions",
        isActive: false,
      },
      {
        icon: <BaggageClaimIcon size={20} />,
        label: "Accounts",
        path: "/accounts",
        isActive: false,
      },
    ];

    const OthersItems = [
      { icon: <User size={20} />, label: "Profile", path: "/profile", otherData: {email}},
      { icon: <Database size={20} />, label: "Backup", path: "/backup", otherData: "" },
      { icon: <Settings size={20} />, label: "Settings", path: "/settings", otherData: "" },
    ];

    return (
      <div
        className={`${className} hidden md:flex px-5 py-2 flex-col border-r-2 border-(--color-bg-base) h-full w-fit duration-300 bg-(--color-bg-subtle) transition-all`}
      >
        {/* Header */}
        <header className="flex flex-0 my-5 items-center justify-center">
          <p className="hidden md:block font-bold text-3xl mt-5 text-[1.2rem]">
            Money{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              Tracker
            </span>
          </p>
        </header>

        {/* Sidebar list */}
        <div className="flex flex-0 flex-col gap-1">
          <>
            <p className="hidden md:block text-(--color-text-secondary) text-[0.9rem] font-light mb-2">
              Overview
            </p>
            {OverviewItems.map((overviewItem) => (
              <SidebarItem
                key={overviewItem.path}
                icon={overviewItem.icon}
                label={overviewItem.label}
                path={overviewItem.path}
                isActive={path === overviewItem.path}
              />
            ))}
          </>
        </div>

        {/* Others */}
        <div className="flex flex-1 flex-col gap-1">
          {!isMinimized && (
            <p className="hidden md:block mt-4 text-[0.9rem] font-light">
              Others
            </p>
          )}
          {OthersItems.map((otherItem) => (
            <SidebarItem
              icon={otherItem.icon}
              label={isMinimized ? "" : otherItem.label}
              path={otherItem.path}
              key={otherItem.path}
              isActive={path === otherItem.path}
            />
          ))}
        </div>

        <div className="flex flex-auto h-auto w-full" />

        {/* Session information */}
        <div className="relative hidden xl:block w-full px-2 py-3 border-t-2 border-(--color-border-subtle)">
          <div className="flex flex-col items-center">
            
            <div className="flex items-center gap-2">
              <span>{<LogInIcon size={15}/>}</span>
              <p className="whitespace-nowrap font-mono text-[0.8rem]">
                Last sign in:{" "}
              </p>
            </div>

            <p className="text-[0.8rem] mt-1 font-display font-light">
              <span>{`${new Date(lastLogIn).toLocaleDateString()} | ${new Date(lastLogIn).toLocaleTimeString()}`}</span>
            </p>
          </div>
        </div>
      </div>
    );
}