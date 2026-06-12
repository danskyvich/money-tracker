"use client";

import ContainerComponent from "@/components/layout/ContainerComponent";
import Card from "@/components/ui/Card";
import { useEffect, useState } from "react";

export default function Settings() {
  useEffect(() => {
    document.title = "Settings";
  }, []);

  const [active, setActive] = useState<string>("/settings/profile");

  //set visited page (settings) to localStorage
  useEffect(() => {
    localStorage.setItem("settings-active-page", active);
  }, [active]);

  //retrieve visited page (settings) from localStorage
  useEffect(() => {
    const savedPath = localStorage.getItem("settings-active-page");
    setActive(savedPath || "/profile");
  }, []);

  //side menu
  const CHOICES = [
    { name: "Profile", path: "/settings/profile" },
    { name: "Backup", path: "/settings/backup" },
    { name: "Configuration", path: "/settings/configuration" },
  ];

  const handleActive = (path: string) => {
    setActive(path);
  };

  return (
    <div className="flex flex-col w-full h-full gap-5">
      <div className="flex w-fit h-fit gap-4">
        {CHOICES.map((item) => (
          <div className="border border-(--color-border-default) rounded-xl shadow-sm">
            <p
              className={`py-3 px-3 font-normal text-[0.85rem] rounded-xl hover:cursor-pointer ${active === item.path ? "text-(--color-brand-green)" : null}`}
              onClick={() => handleActive(item.path)}
            >
              {item.name}
            </p>
          </div>
        ))}
      </div>

      <Card className="flex flex-3 flex-col w-full h-full">
        <ContainerComponent path={active} />
      </Card>
    </div>
  );
}
