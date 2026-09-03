"use client";

import ErrorModal from "@/components/layout/error-modal";
import LoadingModal from "@/components/layout/loading-modal";
import Modal from "@/components/layout/modal";
import { DeleteUserData } from "@/lib/supabase/actions/database";
import { Eye, Trash } from "lucide-react";
import { useState } from "react";
import { IncomeCategories } from "./components/income-categories";
import ExpenseCategories from "./components/expense-categories";

export default function SettingsPage() {
  // data deletion modal
  const [loading, setLoading] = useState<boolean>(false);
  const [dataDeletionError, setDataDeletionError] = useState<string | undefined>(undefined);
  const [toggle, setToggle] = useState<string | null>(null);

  const settings = [
    {
      item: "Modify income categories",
      value: "Modify",
      icon: <Eye size={15} />,
      link: () => setToggle("income-categories"),
    },
    {
      item: "Modify expense categories",
      value: "Modify",
      icon: <Eye size={15} />,
      link: () => setToggle("expense-categories"),
    },
    {
      item: "Delete data",
      value: "Delete data",
      icon: <Trash size={15}/>,
      link: () => setToggle("data-deletion"),

    }
  ];

  const handleDataDeletion = async () => {
    setLoading(true);

    try {
      const result = await DeleteUserData();
      if (!result.success) {
      setDataDeletionError(result?.error);
      return;
      }
    } finally {
    setLoading(false);
    window.location.reload();
    };
  };

  return (
    <>
      {loading && (
        <div className="fixed z-50 inset-0 bg-black/50 flex w-full h-full items-center justify-center">
          <LoadingModal message="Deleting your data..." />
        </div>
      )}
      <div className="flex flex-col w-full h-full">
        {dataDeletionError && <ErrorModal message={dataDeletionError} />}
        <p className="text-3xl font-semibold pb-5">Settings</p>
        <div className="flex flex-col w-full h-full border border-(--color-border-default) rounded-lg shadow-md">
          {toggle === "data-deletion" && (
            <div className="absolute inset-0 z-50 flex w-full h-full bg-black/50 items-center justify-center">
              <Modal
                open
                onOpen={() => setToggle(null)}
                onConfirm={handleDataDeletion}
                loading={loading}
                onCancel={() => setToggle(null)}
                header="Delete your data"
                message="Are you really sure you want to delete your data? Data deletion includes all your transactions, accounts, and current configurations. This action is irreversible."
                icon={<Trash size={15} />}
                yesButtonText="Yes, delete my data"
                noButtonText="No, go back"
              />
            </div>
          )}
          {toggle === "income-categories" && (
            <div className="absolute inset-0 z-50 flex w-full h-full bg-black/50 items-center justify-center">
              <IncomeCategories
              open
              onOpen={() => setToggle(null)}
              />
            </div>
          )}
          {
            toggle === "expense-categories" && (
              <div className="absolute inset-0 z-50 flex w-full h-full bg-black/50 items-center justify-center">
                <ExpenseCategories
                open
                onOpen={() => setToggle(null)}
                />
              </div>
            )
          }
          {settings.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_1fr] w-full h-fit px-5 py-2 items-center"
              key={index}
            >
              <p className="text-[0.9rem]">{item.item}</p>

              <button className="flex w-fit h-fit ring ring-inset ring-(--color-brand-green) hover:text-white active:text-white active:bg-emerald-600 text-[0.9rem] rounded-lg shadow-md hover:bg-(--color-brand-green) px-4 md:x-5 py-2 md:py-1 items-center justify-center justify-self-end gap-1 duration-100 cursor-pointer transition-all" onClick={item.link}>
                {item.icon === null ? null : item.icon}
                <p className="hidden md:block whitespace-nowrap">{item.value}</p>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
