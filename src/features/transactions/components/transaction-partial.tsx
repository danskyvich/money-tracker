import OverviewTransactionSkeleton from "@/features/overview/components/skeleton/overview-transaction-skeleton";
import { Transaction } from "@/lib/types/database";
import ConvertTimestampToDateTime from "@/utils/convertToDateTime";
import { useEffect } from "react";

interface TransactionListProps {
  transactionData: Transaction[] | null;
  transactionError: string | null;
  loading: boolean;
}

export default function TransactionPartialList({
  transactionData,
  transactionError,
  loading,
}: TransactionListProps) {

  return (
    <>
      {loading ? (
        <OverviewTransactionSkeleton />
      ) : (
        <div className="flex relative w-full h-full flex-col overflow-auto items-center justify-center">
          {transactionData?.length !== 0 ? (
            <div className="flex flex-col w-full h-full">
              {transactionData?.map((transaction, key) => (
                <div
                  className="flex w-full h-17 justify-between hover:bg-(--color-bg-subtle) border-b border-(--color-border-subtle) px-5 py-3 cursor-pointer"
                  key={key}
                >
                  <div className="flex flex-col w-[65%]">
                    <p className="font-display text-[0.85rem] line-clamp-1">
                      {transaction.description}
                    </p>
                    <p className="text-(--color-text-secondary) text-[0.7rem]">
                      {ConvertTimestampToDateTime(transaction.date_time)}
                    </p>
                  </div>

                  <div className="flex w-[35%] h-full items-center justify-end">
                    <p
                      className={`text-[1rem] font-mono ${transaction.type === "income" ? "text-emerald-500" : transaction.type === "expense" ? "text-red-500" : "text-(--color-text-primary)"}`}
                    >
                      {transaction.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col w-full h-full font-sans text-[0.9rem] items-center justify-center gap-1">
              <p>You don't have any transactions.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
