import OverviewTransactionSkeleton from "@/features/overview/components/skeleton/overview-transaction-skeleton";
import { Transaction } from "@/lib/types/database";
import ConvertTimestampToDateTime from "@/utils/convertToDateTime";
import { CircleAlert } from "lucide-react";

interface TransactionListProps {
    transactionData: Transaction[] | null,
    transactionError: string | null,
    loading: boolean,
}

export default function TransactionList({transactionData, transactionError, loading}: TransactionListProps) {

    if (loading) return <OverviewTransactionSkeleton/>

    return (
      <div className="flex relative flex-col overflow-auto">
        {transactionData ? (
          <div className="flex flex-col w-full h-full">
            {transactionData?.map((item) => (
              <div className="flex w-full h-17 justify-between hover:bg-(--color-bg-subtle) border-b border-(--color-border-subtle) px-5 py-3 cursor-pointer">
                <div className="flex flex-col w-[65%]">
                  <p className="font-display text-[0.85rem] line-clamp-1">
                    {item.description}
                  </p>
                  <p className="text-(--color-text-secondary) text-[0.7rem]">
                    {ConvertTimestampToDateTime(item.date_time)}
                  </p>
                </div>

                <div className="flex w-[35%] h-full items-center justify-end">
                  <p
                    className={`text-[1rem] font-mono ${item.type === "income" ? "text-emerald-500" : item.type === "expense" ? "text-red-500" : "text-(--color-text-primary)"}`}
                  >
                    {item.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="absolute z-50 bg-black/20 flex w-full h-full inset-0 items-center justify-center">
            <div className="flex border border-(--color-border-default) bg-(--color-bg-secondary) rounded-lg shadow-md px-5 py-2">
              {loading ? (
                <div className="flex w-full items-center gap-4">
                  <p className="text-[0.9rem] font-mono">
                    Loading transactions...
                  </p>
                </div>
              ) : (
                <div className="flex w-full items-center gap-4">
                  <CircleAlert size={15} />
                  <p className="text-[0.9rem]">{"Error: " + transactionError}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
}