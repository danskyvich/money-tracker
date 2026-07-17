"use client"

import { X } from "lucide-react";
import { useState } from "react";
import { TransactionContent } from "./TransactionContent";

export default function AddTransaction({
  iconLeft,
  title,
  openModal,
  setOpenModal,
}: {
  iconLeft: React.ReactNode;
  title: string;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {

  // data
  const types = ["Income", "Expense", "Transfer"];

  // states
  const [chosenType, setChosenType] = useState<string>(types[0]);

  const handleModalClose = () => {
    setOpenModal(false);
  };
  return (
    <>
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 shadow-md">
          <div className="p-5 w-50 justify-between transform:translate(-50%, -50%) md:w-100 border border-(--color-border-default) rounded-xl bg-(--color-bg-secondary) shadow-md">
            {/* Header */}
            <div className="flex w-full justify-between items-center">
              {iconLeft}
              <p className="font-semibold text-xl">{title}</p>
              <X
                size={15}
                onClick={() => handleModalClose()}
                className="cursor-pointer"
              />
            </div>

            {/* Types */}
            <div className="flex justify-around w-full mt-7 mb-2 gap-2">
              {types.map((item, index) => (
                <div
                  key={index}
                  className={`inline-flex w-full text-center ring ring-inset ring-(--color-border-strong) rounded-lg px-5 py-1 text-[0.9rem] cursor-pointer duration-100 transition-all ${chosenType === item ? (item === "Income" ? "bg-(--color-brand-green) text-white ring-(--color-brand-green)" : item === "Expense" ? "bg-red-400 ring-red-400 text-white" : "ring-blue-400 text-white bg-blue-400") : null}`}
                  onClick={() => setChosenType(item)}
                >
                  <p>{item}</p>
                </div>
              ))}
            </div>

            {/* Content - Income, Expense, Transfer goes here */}
            <TransactionContent transactionType={chosenType}/>

            <div className="flex w-full mt-10 mb-3">
              <div className="cursor-pointer hover:bg-emerald-600 active:bg-emerald-700 bg-(--color-brand-green) text-white rounded-lg text-[0.9rem] px-5 py-1 items-center justify-center w-full text-center">
                <p onClick={() => setOpenModal(false)}>
                  Add transaction
                </p>{" "}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
