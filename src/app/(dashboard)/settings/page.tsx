"use client";

import Card from "@/components/ui/Card";
import Switcher from "@/components/ui/Switcher";
import { monthlyIncome } from "@/lib/mocks/mockAccounts";
import { MonthlyInflowOutflows } from "@/lib/mocks/mockTransactions";
import { ChevronDown, Eye } from "lucide-react";
import { useState } from "react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const settings = [
  { item: "Main currency", value: "Philippine Peso", icon: "₱" },
  { item: "Sub currency", value: "United States Dollar", icon: "$" },
  { item: "Configure start day", value: DAYS[0], icon: null },
  {
    item: "Modify income categories",
    value: "Modify",
    icon: <Eye size={15} />,
  },
  {
    item: "Modify expense categories",
    value: "Modify",
    icon: <Eye size={15} />,
  },
];

export default function Configuration() {

  return (
    <div className="flex flex-col w-full h-full">
      <p className="text-3xl font-semibold pb-5">Settings</p>
      <div
        className="flex flex-col w-full h-full border border-(--color-border-default) rounded-lg shadow-md"
      >
        {settings.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_1fr] w-full h-fit px-5 py-2 items-center cursor-pointer min-h-0"
            key={index}
          >
            <p className="text-[0.9rem]">{item.item}</p>

            <div className="flex w-fit h-fit ring ring-inset ring-(--color-brand-green) text-[0.9rem] rounded-lg hover:bg-(--color-brand-green) hover:text-white px-5 py-1 items-center justify-center justify-self-end gap-1 duration-100 transition-all">
              {item.icon === null ? null : item.icon}
              <p className="text-[0.9rem] whitespace-nowrap">{item.value}</p>
              {item.item === "Modify income categories" ||
              item.item === "Modify expense categories" ? null : (
                <ChevronDown size={20} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
