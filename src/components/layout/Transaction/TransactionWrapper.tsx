import { Coins, X } from "lucide-react";
import TransactionContent from "./TransactionContent";
import { useEffect, useState } from "react";
import { Transaction } from "@/lib/types/database";

export default function TransactionWrapper(
    {
        toggle, 
        currentPage, 
        selectedTransaction, 
        onClose,
        categoryData,
        accountsData,
        onTransactionSaved,
    } : {
        toggle: boolean, 
        currentPage: number, 
        selectedTransaction?: Transaction | null, 
        onClose: () => void
        categoryData?: any[] | null
        accountsData?: any[] | null
        onTransactionSaved: () => void;
    }) {

    return (
      <>
        {toggle && (
          <div className="flex fixed z-50 inset-0 w-full h-full bg-black/50 items-center justify-center">
            <div className="flex flex-col md:w-100 xl:w-135 bg-(--color-bg-secondary) border border-(--color-border-default) rounded-lg shadow-md px-5 py-3">
              <div className="flex w-full h-fit px-5 py-2 items-center justify-between">
                <Coins size={20} />
                <p className="text-xl font-display font-semibold">
                  {selectedTransaction ? "Edit Transaction" : "Add transaction"}
                </p>
                <X
                  size={20}
                  className="cursor-pointer"
                  onClick={() => onClose()}
                />
              </div>

              <TransactionContent
                currentPage={currentPage}
                selectedTransaction={selectedTransaction}
                categoriesData={categoryData}
                accountiesData={accountsData}
                onSaved={() => {onTransactionSaved(), onClose()}}
              />
            </div>
          </div>
        )}
      </>
    );
}