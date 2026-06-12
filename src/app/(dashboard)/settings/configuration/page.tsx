'use client'

import SettingItem from "@/components/layout/SettingItem";
import Switcher from "@/components/ui/Switcher";
import { ChevronDown, Eye } from "lucide-react";
import { useState } from "react";

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Configuration() {
  const [dayPressed, setDayPressed] = useState<string>('Sunday');
  const handleDayActive = (index: number) => {
    setDayPressed(DAYS[index]);
  }
    return (
      <div className="flex flex-col w-full h-full py-5 px-9 gap-3">
        {/* Main Currency */}
        <SettingItem label="Main currency">
          <div className="flex">
            <div className="flex border border-r-0 border-(--color-border-default) text-(--color-text-secondary) rounded-l-xl py-1 px-3 items-center gap-2">
              <span className="text-[1.2rem]">₱</span>
              <p className="text-[0.8rem]">Philippine Peso (PHP)</p>
            </div>
            <div className="flex border-l border border-(--color-border-default) items-center justify-center rounded-r-xl px-2">
              <ChevronDown size={25} />
            </div>
          </div>
        </SettingItem>

        {/* Sub Currency */}
        <SettingItem label="Sub currency">
          <div className="flex">
            <div className="flex border border-r-0 border-(--color-border-default) text-(--color-text-secondary) rounded-l-xl py-1 px-3 items-center gap-2">
              <span className="text-[1.2rem]">$</span>
              <p className="text-[0.8rem]">United States Dollars (USD)</p>
            </div>
            <div className="flex border-l border border-(--color-border-default) items-center justify-center rounded-r-xl px-2">
              <ChevronDown size={25} />
            </div>
          </div>
        </SettingItem>

        {/* Start Day */}
        <SettingItem label="Weekly start day">
          <div className="flex gap-2 hover:cursor-pointer">
            {DAYS.map((item, index) => (
              <div
                className={`flex border border-(--color-border-default) py-2 px-3 rounded-xl shadow-sm duration-100 transition-normal
                  ${item === dayPressed ? "bg-(--color-border-strong) text-white" : null}
                  `}
                onClick={() => handleDayActive(index)}
              >
                <p className="text-[0.8rem] text-(--color-text-secondary)">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </SettingItem>

        {/* Modify income categories */}
        <SettingItem label="Modify income categories">
          <div className="flex gap-2 hover:cursor-pointer text-(--color-text-secondary) border border-(--color-border-default) py-2 px-4 rounded-xl items-center justify-center hover:bg-(--color-border-default) active:bg-(--color-border-strong)">
            <Eye size={20} />
            <p className="text-[0.9rem]">View income categories</p>
          </div>
        </SettingItem>

        {/* Modify expense categories */}
        <SettingItem label="Modify expense categories">
          <div className="flex gap-2 hover:cursor-pointer text-(--color-text-secondary) border border-(--color-border-default) py-2 px-4 rounded-xl items-center justify-center hover:bg-(--color-border-default) active:bg-(--color-border-strong)">
            <Eye size={20} />
            <p className="text-[0.9rem]">View expense categories</p>
          </div>
        </SettingItem>

        {/* Show description */}
        <SettingItem label="Show description on transactions">
          <Switcher />
        </SettingItem>
      </div>
    );
}