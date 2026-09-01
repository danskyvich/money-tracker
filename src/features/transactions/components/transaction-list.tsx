import { FetchTransaction, SearchTransactions } from "@/lib/supabase/actions/database";
import ConvertTimestampToDateTime from "@/utils/convertToDateTime";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCw,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import ErrorModal from "@/components/layout/error-modal";
import TransactionListSkeleton from "./skeleton/transaction-list-skeleton";
import TransactionModal from "./transaction-modal";
import { useDebouncedValue } from "@/hooks/useDebounceValue";
import { TransactionSearchResults } from "@/lib/types/derived";
import Spinner from "@/components/layout/spinner";
import DeleteTransactionModal from "./delete-transaction-modal";

export default function WholeTransactionList() {

  // fetch data & error
  const [transactionsError, setTransactionsError] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);

  // modals
  const [toggle, setToggle] = useState<string | null>(null);
  const [chosenTransaction, setChosenTransaction] = useState<
    TransactionSearchResults | undefined
  >(undefined);

  // search feature
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearch = useDebouncedValue(searchTerm, 400);
  const [transactionsData, setTransactionsData] = useState<
    TransactionSearchResults[] | undefined
  >(undefined);
  const [changedTransactionsData, setChangedTransactionData] = useState<
    TransactionSearchResults[] | undefined
  >(undefined);
  const displayedTransactions = searchTerm.trim()
    ? changedTransactionsData
    : transactionsData;
  
  // pagination --> edit # of items calculations on lib/data/overview.ts
  // calculation here is purely for pagination purposes
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [windowStart, setWindowStart] = useState(0);
  const [totalNumberOfItems, setTotalNumberOfItems] = useState<number>(0);
  const totalPages = totalNumberOfItems ? Math.ceil(totalNumberOfItems / 9) : 0;
  const paginationArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = paginationArray.slice(windowStart, windowStart + 5);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch]);

  // main fetch function
  const fetchData = async () => {
    setLoading(true);

    const result = await FetchTransaction(currentPage, 9);

    if (!result || !result.success) {
      setTransactionsError(result?.error ?? "Transaction fetch failed.");
    } else {
      setTransactionsError(null);
      setTransactionsData(result?.data ?? []);
      setTotalNumberOfItems(Number(result.totalItems));
      setLoading(false);
    }
    setLoading(false);
  };

  // get the transaction to be modified
  const handleGetTransactionToBeModified = (transaction: any) => {
    setToggle("modify-transaction")
    setChosenTransaction(transaction);
  }

  // handle search feature
  const handleSearch = async (term: string) => {
    setLoading(true);
    if (!term.trim()) {
      setChangedTransactionData(transactionsData);
      setLoading(false);
      return;
    }

    const result = await SearchTransactions(term, currentPage);

    if (!result.success) {
      setTransactionsError(result.error ?? "Fetching transactions failed");
      setLoading(false);
      return;
    }

    setChangedTransactionData(result.data);
    setLoading(false);
    return;
  }

  return (
    <>
      {toggle === "delete-transaction" && (
        <div className="fixed inset-0 z-50 flex w-full h-full items-center justify-center bg-black/50">
          <DeleteTransactionModal
            open
            onOpen={() => setToggle(null)}
            onCancel={() => setToggle(null)}
            refetch={() => fetchData()}
            id={chosenTransaction?.id}
          />
        </div>
      )}
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
      <div className="flex xl:flex-row flex-2 flex-col w-full h-full gap-5">
        <div className="flex flex-2 grid grid-cols-1 grid-rows-[auto_1fr_auto] xl:h-full min-h-185 border border-(--color-border-default) rounded-lg shadow-lg">
          {/* Table header*/}
          <div className="flex w-full h-full px-5 py-2 items-center justify-between">
            <div className="flex w-full h-full gap-2">
              {/** Add transaction */}
              <div
                className="flex w-fit h-full border text-white items-center gap-2 border-(--color-border-default) rounded-lg py-1 bg-(--color-brand-green) px-5 cursor-pointer hover:bg-emerald-600 active:bg-emerald-700"
                onClick={() => setToggle("add-transaction")}
              >
                <Plus size={15} />
                <p className="text-[0.8rem] hidden lg:block">
                  Add a transaction
                </p>
              </div>

              {/* Search field */}
              <div className="px-3 py-1 flex w-[50%] h-full border border-(--color-border-default) rounded-md items-center gap-2">
                <Search size={15} className="flex" />
                <input
                  type="text"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="flex flex-3 decorations-none placeholder:text-[0.8rem] focus:outline-none focus:ring-0 focus:border-transparent text-[0.8rem]"
                />
              </div>
            </div>

            {loading ? (
              <Spinner />
            ) : (
              <RotateCw
                size={20}
                className="min-w-3 h-auto cursor-pointer"
                onClick={() => fetchData()}
              />
            )}
          </div>

          {/* Transaction Table */}
          <div className="flex flex-col w-full h-full mt-3">
            {/** Transaction headers */}
            <div className="grid grid-cols-[repeat(6,1fr)_30px] gap-4 font-mono text-[0.9rem] py-1 px-5 pt-1 font-display border-b border-(--color-border-default)">
              <div className="line-clamp-1">Date & time</div>
              <div>Type</div>
              <div>Description</div>
              <div>Category</div>
              <div>Account</div>
              <div className="text-left">Amount</div>
              <div />
            </div>

            {loading ? (
              <TransactionListSkeleton />
            ) : (
              <div className="flex flex-col relative w-full h-full overflow-hidden">
                {displayedTransactions && (
                  <div className="flex flex-col w-full h-fit">
                    {displayedTransactions.map((transaction, key) => (
                      <div
                        className="grid grid-cols-[repeat(6,1fr)_25px] gap-4 font-display text-[0.9rem] px-5 py-5 font-display w-full h-fit cursor-pointer hover:bg-(--color-bg-subtle) border-b border-(--color-border-subtle)"
                        key={key}
                        onClick={() =>
                          handleGetTransactionToBeModified(transaction)
                        }
                      >
                        <div className="flex w-full items-center">
                          <p className="line-clamp-1">
                            {ConvertTimestampToDateTime(
                              transaction.date_time ?? "",
                            )}
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
                            {transaction.category_id?.name ?? "--"}
                          </p>
                        </div>
                        <div className="flex w-full items-center">
                          <p className="line-clamp-1">
                            {transaction?.account_id?.name}
                          </p>
                          {transaction.to_account_id?.name && (
                            <>
                              <ArrowRight
                                size={15}
                                className="min-w-3 h-auto"
                              />
                              <p>{transaction.to_account_id.name}</p>
                            </>
                          )}
                        </div>
                        <div
                          className={`flex w-full items-center font-mono ${transaction.type === "income" ? "text-emerald-500" : transaction.type === "expense" ? "text-red-500" : "text-(--color-text-primary)"}`}
                        >
                          <p className="line-clamp-1">{transaction.amount}</p>
                        </div>
                        <div className="flex items-center justify-center rounded-lg">
                          <X
                            className="min-w-3 max-w-5 h-auto cursor-pointer text-(--color-text=primary)"
                            onClick={(e) => {
                              e.stopPropagation();
                              setToggle("delete-transaction");
                              setChosenTransaction(transaction);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {displayedTransactions?.length === 0 && (
                  <div className="flex w-full h-full items-center font-mono justify-center text-[0.9rem]">
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

              <div className="flex border border-(--color-border-default) text-(--color-text-secondary) px-3 py-2 mx-2 rounded-lg">
                <p>{displayedTransactions?.length}</p>
              </div>

              <p>of {totalNumberOfItems}</p>
            </div>

            {/* Pagination */}
            <div className="flex w-fit h-full items-center gap-2 mx-3">
              {/* Left */}
              {windowStart > 0 && (
                <div
                  className="px-3 py-2 border border-(--color-border-default) rounded-lg cursor-pointer hover:bg-(--color-bg-subtle)"
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
                  className={`px-3 py-2 border border-(--color-border-default) rounded-lg hover:bg-(--color-bg-subtle) cursor-pointer ${currentPage === item ? "bg-(--color-brand-green) hover:bg-(--color-brand-green) text-white" : null}`}
                  key={key}
                  onClick={() => setCurrentPage(item)}
                >
                  <p>{item}</p>
                </div>
              ))}

              {/* Right */}
              {windowStart + 5 < paginationArray.length && (
                <div
                  className="px-3 py-2 border border-(--color-border-default) rounded-lg"
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
      </div>
    </>
  );
}
