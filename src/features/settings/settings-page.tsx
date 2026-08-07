"use client";

import Modal from "@/components/layout/modal";
import { DeleteUserData } from "@/lib/supabase/actions/database";
import { ChevronDown, Eye, Trash } from "lucide-react";
import { useState } from "react";

const settings = [
  { item: "Main currency", value: "Philippine Peso", icon: "₱" },
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

const [deletionLoading, setDeletionLoading] = useState<boolean>(false);
const [isDataDeletionOpen, setIsDataDeletionOpen] = useState<boolean>(false);

export default function SettingsPage() {

  const handleDataDeletion = async () => {
    setDeletionLoading(true);
    

  }

  return (
    <div className="flex flex-col w-full h-full">
      <p className="text-3xl font-semibold pb-5">Settings</p>
      <div
        className="flex flex-col w-full h-full border border-(--color-border-default) rounded-lg shadow-md"
      >
        {
          isDataDeletionOpen && (
            <div className="absolute inset-0 z-50 flex w-full h-full bg-black/50 items-center justify-center">
              <Modal
                open={isDataDeletionOpen}
                onOpen={setIsDataDeletionOpen}
                onConfirm={handleDataDeletion}
                header="Delete your data"
                message="Are you really sure you want to delete your data? Data deletion is irreversible."
                icon={<Trash size={15}/>}
              />
            </div>
          )
        }
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
        <div className="flex w-full h-fit text-[0.9rem] items-center justify-between px-5 py-2 min-h-0">
          <p>Delete data</p>

          <button
            onClick={() => setIsDataDeletionOpen(true)}
            className="flex border border-(--color-brand-green) rounded-lg items-center justify-center px-5 py-1 gap-1 text-[0.9rem] cursor-pointer hover:bg-(--color-brand-green) active:bg-emerald-600 transition-all duration-100"
          >
            <Trash size={15}/>
            <p>Delete data</p>
          </button>
        </div>
      </div>
    </div>
  );
}
