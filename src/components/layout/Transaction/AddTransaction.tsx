"use client"

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { TransactionContent } from "./TransactionContent";
import { getOverviewData } from "@/lib/data/overview";

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

  // fetch data from supabase db
    const [categoryData, setCategoryData] = useState<any[] | null>(null);
    const [accountsData, setAccountsData] = useState<any[] | null>(null);
    const [categoryError, setCategoryError] = useState<string | undefined>("");
    const [accountsError, setAccountsError] = useState<string | undefined>("");
  
    const handleFetchData = async () => {
      const { categoryData, categoryError, accountsData, accountsError } = await getOverviewData(0);
      if (categoryData) setCategoryData(categoryData);
      else setCategoryError(categoryError?.message);

      if (accountsData) setAccountsData(accountsData);
      else setAccountsError(accountsError?.message);
    }
  
    useEffect(() => {
      handleFetchData();
    }, [])

  const handleModalClose = () => {
    setOpenModal(false);
  };
  return (
    <>
      {openModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 shadow-md">
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
            <TransactionContent transactionType={chosenType} categoryData={categoryData} categoryError={categoryError} accountsData={accountsData} accountsError={accountsError}/>

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
