"use client"

import { useState } from "react";
import { SidebarItem } from "./SidebarItem";
import { ArrowDownUpIcon, ArrowLeftCircle, ArrowLeftCircleIcon, BarChart, LayoutDashboardIcon, PiggyBank, Repeat, Settings, Wallet2Icon } from "lucide-react";

export default function Sidebar() {
    const [currentAmount, setCurrentAmount] = useState();
    const time = "today"

    const OverviewItems = [
      { icon: <LayoutDashboardIcon size={20} />, label: "Dashboard", path: "/overview"},
      { icon: <Wallet2Icon size={20} />, label: "Transactions", path: "/transactions"},
      { icon: <ArrowDownUpIcon size={20} />, label: "Cash flow", path: "/cash-summary" },
      { icon: <PiggyBank size={20} />, label: "Budget", path: "/budget" },
    ];

    const OthersItems = [
      { icon: <BarChart size={20} />, label: "Analysis", path: "/analysis" },
      { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
    ];

    return (
      <div className="flex flex-col border-r-2 border-[var(--color-border-subtle)] w-[12.5%] h-full duration-300">
        {/**Header */}
        <header className="flex my-5 items-center justify-center">
          <p className="font-bold text-3xl mt-5">
            Money{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              Tracker
            </span>
          </p>
        </header>

        {/**Session */}
        <div className="flex my-2 mx-5 px-5 py-2 rounded-xl border border-[var(--color-border-default)] shadow-[var(--shadow-sm)] bg-linear-to-r from-teal-700 to-teal-900">
          <p className="text-[var(--color-text-secondary)] text-white font-light text-[0.85rem]">
            Last session: <span className="font-normal">{time}</span>
          </p>
        </div>

        {/**Sidebar list */}
        <div className="flex flex-col gap-1 mx-5 mt-5">
          <p className="text-[var(--color-text-secondary)] text-[0.9rem] font-light mb-2">
            Overview
          </p>
          {OverviewItems.map((overviewItem) => (
            <SidebarItem icon={overviewItem.icon} label={overviewItem.label} path={overviewItem.path}/>
          ))}
        </div>

        {/**Others */}
        <div className="flex flex-col gap-1 mx-5 mt-3">
          <p className="text-[var(--color-text-secondary)] mt-4 text-[0.9rem] font-light">
            Others
          </p>
          {OthersItems.map((otherItem) => (
            <SidebarItem
              icon={otherItem.icon}
              label={otherItem.label}
              path={otherItem.path}
            />
          ))}
        </div>

        <div className="flex flex-1 h-auto w-full" />
        <div className="flex flex-0  gap-3 items-center justify-center py-2 shover:cursor-pointer border-t-[0.5] border-[var(--color-border-default)] hover:cursor-pointer">
          <ArrowLeftCircle
            size={20}
            className="text-[var(--color-text-secondary)]"
          />
          <p className="font-normal text-[0.9rem] text-[var(--color-text-secondary)]">
            Collapse sidebar
          </p>
        </div>
      </div>
    );
}