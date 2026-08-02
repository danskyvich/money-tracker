import QuickActionsSkeleton from "@/components/layout/skeleton/quick-action-skeleton";
import TransactionWrapper from "@/components/layout/transaction/TransactionWrapper";
import { getOverviewData } from "@/lib/data/overview";
import { Accounts, Category, Transaction } from "@/lib/types/database";
import { PiggyBank, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface QuickActionsProps {
    toggle: boolean,
    currentPage: number,
    accountsData: any[] | null,
    categoryData: any[] | null,
    onTransactionSaved: () => void,
    onClose: () => void,
    loading: boolean,
}

export default function QuickActions({ toggle, currentPage, accountsData, categoryData, onTransactionSaved, onClose, loading }: QuickActionsProps) {
  const [isTransactionModalOpen, setIsTransactionModalOpen] =
    useState<boolean>(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);

  if (loading) return <QuickActionsSkeleton/>

  return (
    <>
      <TransactionWrapper
        toggle={isTransactionModalOpen}
        currentPage={currentPage}
        selectedTransaction={null}
        onClose={() => onClose}
        accountsData={accountsData}
        categoryData={categoryData}
        onTransactionSaved={onTransactionSaved}
      />
      <div className="flex flex-col flex-2 border border-(--color-border-default) rounded-lg shadow-md w-full h-full p-5 gap-2">
        <p className="text-xl font-semibold">Quick Actions</p>
        <div className="flex w-full h-full gap-5 flex-col md:flex-row">
          <div
            className="flex flex-1 bg-(--color-brand-green) text-white rounded-lg shadow-md items-center justify-center text-[0.9rem] gap-1 py-2 cursor-pointer hover:bg-(--color-brand-green-accent) duration-100 transition-all active:bg-emerald-600"
            onClick={() => setIsTransactionModalOpen(toggle)}
          >
            <Plus size={20} />
            <p className="hidden lg:block whitespace-nowrap">
              Add a transaction
            </p>
          </div>

          <div
            className="flex flex-1 ring ring-inset ring-(--color-brand-green) hover:bg-(--color-brand-green) hover:text-white rounded-lg shadow-md items-center justify-center text-[0.9rem] gap-1 py-2 cursor-pointer duration-100 transition-all active:bg-emerald-600"
            onClick={() => setIsAccountModalOpen(toggle)}
          >
            <PiggyBank size={20} />
            <p className="hidden lg:block whitespace-nowrap">Add an account</p>
          </div>
        </div>
      </div>
    </>
  );
}
