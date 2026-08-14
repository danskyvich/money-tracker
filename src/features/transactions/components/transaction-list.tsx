import { FetchTransaction } from "@/lib/supabase/actions/database";
import ConvertTimestampToDateTime from "@/utils/convertToDateTime";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import ErrorModal from "@/components/layout/error-modal";
import TransactionListSkeleton from "./skeleton/transaction-list-skeleton";
import TransactionModal from "./transaction-modal";
import { Transaction } from "@/lib/types/database";
import FilterModal from "@/components/layout/filter-modal";
import { FilterTransactionField } from "../types/types";

export default function WholeTransactionList() {

  // fetch data & error
  const [transactionsError, setTransactionsError] = useState<string | null>("");
  const [transactionsData, setTransactionsData] = useState<any[] | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean>(false);

  // modals
  const [toggle, setToggle] = useState<string | null>(null);
  const [chosenTransaction, setChosenTransaction] = useState<Transaction | null>(null)

  // pagination --> edit # of items calculations on lib/data/overview.ts
  // calculation here is purely for pagination purposes
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [windowStart, setWindowStart] = useState(0);
  const [totalNumberOfItems, setTotalNumberOfItems] = useState<number>(0);
  const totalPages = totalNumberOfItems ? Math.ceil(totalNumberOfItems / 9) : 0;
  const paginationArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = paginationArray.slice(windowStart, windowStart + 5);

  // main fetch function
  const fetchData = async () => {
    setLoading(true);

    const result = await FetchTransaction(currentPage, 9);

    if (!result || !result.success) {
      setTransactionsError(result?.error ?? "Transaction fetch failed.");
    } else {
      setTransactionsError(null);
      setTransactionsData(result.data);
      setTotalNumberOfItems(Number(result.totalItems));
      setLoading;
      false;
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // get the transaction to be modified
  const handleGetTransactionToBeModified = (transaction: Transaction) => {
    setToggle("modify-transaction")
    setChosenTransaction(transaction);
  }

  const TransactionFields: FilterTransactionField[] = [
    {
      key: "order",
      label: "Order by",
      type: "select",
      options: [{name: "ascending", value: "ascending"}, {name: "descending", value: "descending"}],
    },
   
  ]

  return (
    <>
      {
        toggle === "filter-modal" && (
          <div className="fixed inset-0 z-50 flex w-full h-full items-center justify-center bg-black/50">
            <FilterModal
              open
              onOpen={() => setToggle(null)}
              onConfirm={() => ""}
              fields={TransactionFields}
            />
          </div>
        )
      }
      {toggle === "add-transaction" && (
        <div className="fixed inset-0 z-50 flex w-full h-full items-center justify-center bg-black/50">
          <TransactionModal
            open
            onOpen={() => setToggle(null)}
            onCancel={() => setToggle(null)}
            fetch={() => fetchData()}
            modalType="add"
          />
        </div>
      )}
      {toggle === "modify-transaction" && (
        <div className="fixed inset-0 z-50 flex w-full h-full items-center justify-center bg-black/50">
          <TransactionModal
            transaction={chosenTransaction ?? undefined}
            modalType="modify"
            open
            onOpen={() => setToggle(null)}
            onCancel={() => setToggle(null)}
            fetch={() => fetchData()}
          />
        </div>
      )}
      <>
        <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] h-full border border-(--color-border-default) rounded-lg">
          {/* Table header*/}
          <div className="flex w-full h-full px-5 py-2 gap-3 ">
            {/** Add transaction */}
            <div
              className="flex w-fit h-fit border items-center gap-2 border-(--color-border-default) rounded-lg p-2 bg-(--color-brand-green) cursor-pointer hover:bg-emerald-600 active:bg-emerald-700"
              onClick={() => setToggle("add-transaction")}
            >
              <Plus size={15} />
              <p className="text-[0.9rem] hidden lg:block">Add a transaction</p>
            </div>

            {/* Filter */}
            <div className="flex w-fit h-fit border border-(--color-border-default) rounded-lg gap-2 items-center p-2 hover:bg-(--color-border-subtle) active:bg-(--color-brand-green) cursor-pointer duration-100 transition-all" onClick={() => setToggle("filter-modal")}>
              <Filter size={15}/>
              <p className="text-[0.9rem] hidden lg:block">Filter</p>
            </div>

            {/* Search field */}
            <div className="px-3 py-1 flex w-fit h-full border border-(--color-border-default) rounded-md items-center gap-2">
              <Search size={15} className="flex" />
              <input
                placeholder="Search..."
                className="flex flex-3 decorations-none placeholder:text-[0.8rem] focus:outline-none focus:ring-0 focus:border-transparent text-[0.8rem]"
              />
            </div>
          </div>

          {/* Transaction Table */}
          <div className="flex flex-col w-full h-full mt-3">
            {/** Transaction headers */}
            <div className="grid grid-cols-[repeat(6,1fr)] gap-4 font-mono text-[0.9rem] py-1 px-5 pt-1 font-display border-b border-(--color-border-default)">
              <div className="line-clamp-1">Date & time</div>
              <div>Type</div>
              <div>Description</div>
              <div>Category</div>
              <div>Account</div>
              <div className="text-left">Amount</div>
            </div>

            {loading ? (
              <TransactionListSkeleton />
            ) : (
              <div className="flex flex-col relative w-full h-full overflow-hidden">
                {transactionsData && (
                  <div className="flex flex-col w-full h-fit">
                    {transactionsData.map((transaction, key) => (
                      <div
                        className="grid grid-cols-[repeat(6,1fr)] gap-4 font-display text-[0.9rem] px-5 py-5 font-display w-full h-fit cursor-pointer hover:bg-(--color-bg-subtle) border-b border-(--color-border-subtle)"
                        key={key}
                        onClick={() =>
                          handleGetTransactionToBeModified(transaction)
                        }
                      >
                        <div className="flex w-full items-center">
                          <p className="line-clamp-1">
                            {ConvertTimestampToDateTime(transaction.date_time)}
                          </p>
                        </div>
                        <div className="flex w-full items-center text-(--color-text-secondary)">
                          <p className="capitalize line-clamp-1">
                            {transaction.type}
                          </p>
                        </div>
                        <div className="flex w-full items-center">
                          <p className="line-clamp-1">
                            {transaction.description}
                          </p>
                        </div>
                        <div className="flex w-full items-center">
                          <p className="line-clamp-1">
                            {transaction.categories?.name}
                          </p>
                        </div>
                        <div className="flex w-full items-center">
                          {transaction.toAccount?.name ? (
                            <p className="line-clamp-1">
                              {transaction.fromAccount?.name} to{" "}
                              {transaction.toAccount?.name}
                            </p>
                          ) : (
                            <p>{transaction.fromAccount?.name}</p>
                          )}
                        </div>
                        <div
                          className={`flex w-full items-center font-mono ${transaction.type === "income" ? "text-emerald-500" : transaction.type === "expense" ? "text-red-500" : "text-(--color-text-primary)"}`}
                        >
                          <p className="line-clamp-1">{transaction.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {transactionsError && (
                  <div className="flex w-full h-full items-center justify-center text-[0.9rem]">
                    {transactionsError}
                  </div>
                )}

                {transactionsData?.length === 0 && (
                  <div className="flex w-full h-full items-center justify-center text-[0.9rem]">
                    <p>You have no lodged transactions</p>
                  </div>
                )}

                {transactionsError && (
                  <ErrorModal message={transactionsError} />
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex text-[0.9rem] w-full h-full px-5 py-2 font-display justify-between text-(--color-text-secondary) gap-2 items-center">
            {/* Show num of items */}
            <div className="flex w-fit h-full items-center">
              <p>Show data</p>

              <div className="flex border border-(--color-border-default) text-(--color-text-secondary) px-3 py-2 mx-2 rounded-lg shadow-sm">
                <p>{transactionsData?.length}</p>
              </div>

              <p>of {totalNumberOfItems}</p>
            </div>

            {/* Pagination */}
            <div className="flex w-fit h-full items-center gap-2 mx-3">
              {/* Left */}
              {windowStart > 0 && (
                <div
                  className="px-3 py-2 border border-(--color-border-default) rounded-lg shadow-md cursor-pointer hover:bg-(--color-bg-subtle)"
                  onClick={() =>
                    setWindowStart((prev) => Math.max(0, prev - 5))
                  }
                >
                  <ChevronLeft size={15} />
                </div>
              )}

              {/* window slice (-5, windowStart, +5) */}
              {visiblePages.map((item, key) => (
                <div
                  className={`px-3 py-2 border border-(--color-border-default) rounded-lg shadow-md hover:bg-(--color-bg-subtle) cursor-pointer ${currentPage === item ? "bg-(--color-brand-green) text-black hover:bg-(--color-brand-green)" : null}`}
                  key={key}
                  onClick={() => setCurrentPage(item)}
                >
                  <p>{item}</p>
                </div>
              ))}

              {/* Right */}
              {windowStart + 5 < paginationArray.length && (
                <div
                  className="px-3 py-2 border border-(--color-border-default) rounded-lg shadow-md"
                  onClick={() =>
                    setWindowStart((prev) =>
                      Math.min(paginationArray.length - 5, prev + 5),
                    )
                  }
                >
                  <ChevronRight size={15} />
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </>
  );
}
