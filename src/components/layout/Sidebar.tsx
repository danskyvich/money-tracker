"use client"

import { usePathname } from "next/navigation";
import { SidebarItem } from "./SidebarItem";
import { ArrowDownUpIcon, BaggageClaimIcon, BarChart, Bell, LayoutDashboardIcon, PiggyBank, Repeat, Settings, Wallet2Icon } from "lucide-react";

export default function Sidebar() {
    const path = usePathname();

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
      <div className="flex flex-col border-r-2 border-(--color-bg-base) w-[12.5%] h-full duration-300 bg-(--color-bg-subtle) hidden 2xl:lg:block min-w-10 transition-all">
        {/**Header */}
        <header className="flex my-5 items-center justify-center">
          <p className="font-bold text-3xl mt-5 md:text-[1.2rem]">
            Money{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              Tracker
            </span>
          </p>
        </header>

        {/**Sidebar list */}
        <div className="flex flex-col gap-1 mx-5 mt-5">
          <p className="text-(--color-text-secondary) text-[0.9rem] font-light mb-2">
            Overview
          </p>
          {OverviewItems.map((overviewItem) => (
            <SidebarItem key={overviewItem.path} icon={overviewItem.icon} label={overviewItem.label} path={overviewItem.path} isActive={path === overviewItem.path} />
          ))}
        </div>

        {/**Others */}
        <div className="flex flex-col gap-1 mx-5 mt-3">
          <p className="mt-4 text-[0.9rem] font-light">
            Others
          </p>
          {OthersItems.map((otherItem) => (
            <SidebarItem
              icon={otherItem.icon}
              label={otherItem.label}
              path={otherItem.path}
              key={otherItem.path}
              isActive={path === otherItem.path}
            />
          ))}
        </div>

        <div className="flex flex-1 h-auto w-full" />
      </div>
    );
}