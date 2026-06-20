"use client"

import { usePathname } from "next/navigation";
import { SidebarItem } from "./SidebarItem";
import { ArrowDownUpIcon, BaggageClaimIcon, BarChart, Bell, ChevronLeft, ChevronRight, LayoutDashboardIcon, PiggyBank, Repeat, Settings, Wallet2Icon } from "lucide-react";
import { useState } from "react";

export default function Sidebar({className}:{className?: string}) {
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
      { icon: <BarChart size={20} />, label: "Analysis", path: "/analysis" },
      { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
    ];

    return (
      <div
        className={`${className} min-w-20 flex flex-col border-r-2 border-(--color-bg-base) h-full w-fit duration-300 bg-(--color-bg-subtle) min-w-10 transition-all`}
      >
        {/**Header */}
        <header className="flex my-5 items-center justify-center">
          <p className="hidden min-[1700px]:block font-bold text-3xl mt-5 text-[1.2rem]">
            Money{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              Tracker
            </span>
          </p>
        </header>

        {/**Sidebar list */}
        <div className="flex flex-col gap-1 mx-5 mt-5">
          <>
            <p className="hidden min-[1400px]:block text-(--color-text-secondary) text-[0.9rem] font-light mb-2">
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

        {/**Others */}
        <div className="flex flex-col gap-1 mx-5 mt-3">
          {!isMinimized && (
            <p className="hidden min-[1400px]:block mt-4 text-[0.9rem] font-light">
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

        <div className="relative flex">
          
        </div>
      </div>
    );
}