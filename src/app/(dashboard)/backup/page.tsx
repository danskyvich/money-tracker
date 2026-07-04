'use client'

import Card from "@/components/layout/Card"
import { DatabaseBackup, MoveDownLeft, MoveUpRight } from "lucide-react"
import { useEffect } from "react"

export default function Backup() {
    useEffect(() => {
        document.title = "Your backup"
    })

    const backup = [
      {
        item: "Export data to JSON",
        value: "Export to JSON",
        icon: <MoveUpRight size={15} />,
      },
      {
        item: "Export data to Excel",
        value: "Export to Excel",
        icon: <MoveUpRight size={15} />,
      },
      {
        item: "Backup/restore on device",
        value: "Backup or restore",
        icon: <DatabaseBackup size={15} />,
      },
      {
        item: "Import from an Excel file",
        value: "Import from excel",
        icon: <MoveDownLeft size={15} />,
      },
      {
        item: "Import from a JSON file",
        value: "Import from JSON",
        icon: <MoveDownLeft size={15} />,
      },
    ];

    return (
      <div className="flex flex-col w-full h-full">
        <p className="font-semibold text-3xl pb-5">Backup</p>
        <div className="flex flex-col border border-(--color-border-default) h-full rounded-lg shadow-md">
          {backup.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_1fr] w-full h-fit items-center text-[0.9rem] px-5 py-2"
              key={index}
            >
              <p>{item.item}</p>

              <div className="flex w-fit h-fit cursor-pointer ring ring-inset ring-(--color-brand-green) items-center justify-center whitespace-nowrap rounded-lg gap-1 justify-self-end shadow-md px-5 py-1 hover:bg-(--color-brand-green) text-[0.9rem]">
                {item.icon}
                <p>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}