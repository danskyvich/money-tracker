"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  File,
  ListFilterIcon,
  Search,
  Trash,
  X,
} from "lucide-react";
import { createClient } from "@/services/supabase/client";
import ConvertTimestampToDateTime from "@/utils/convertToDateTime";

const filterOptions = ["Type", "Category", "Account"];

export default function TransactionsPage() {

  // rename page
  useEffect(() => {
    document.title = "Your transactions";
  });

  // states
  const [filter, setFilter] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState("Filter");
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState<
    number | null
  >(null);

  // fetch data & error
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[] | null>(null); // data without errors goes here
  const [totalNumberOfItems, setTotalNumberOfItems] = useState<number | null>(
    null,
  );
  const [pending, setPending] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = totalNumberOfItems ? Math.ceil(totalNumberOfItems / 9) : 0;
  const paginationArray = Array.from({ length: totalPages}, (_, i) => i + 1);
  const [windowStart, setWindowStart] = useState(0);
  const visiblePages = paginationArray.slice(windowStart, windowStart + 5);


  useEffect(() => {
    const fetchTransactions = async () => {
    setPending(true);
      const { data, count, error } = await (await createClient())
        .from("transactions")
        .select(`id, date_time, type, categories!category_id(type), description, amount, accounts!account_id(name)`, {
          count: "exact",
        })
        .range((currentPage - 1) * 9, (currentPage - 1) * 9 + 9 - 1)
        

      if (error) {
        setFetchError("Error: " + error.message);
        setTransactions(null);
        setPending(false)
      }
      if (data) {
        setTransactions(data);
        setFetchError(null);
        setTotalNumberOfItems(count);
        setPending(false);
      }
    };

    setPending(false);
    fetchTransactions();
  }, [currentPage]);

  //functions
  const handleFilterClose = (choice: string) => {
    setSelectedFilter(choice);
    setFilter(false);
  };

  return (
    <div className="flex flex-col w-full h-full gap-5">
      {/* Transaction Info Modal */}
      {isTransactionModalOpen !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="p-5 w-50 md:w-100 border border-(--color-border-default) rounded-xl bg-(--color-bg-secondary) shadow-md">
            {/* Content */}
            <div className="flex flex-col w-full gap-3">
              {/* Footer */}
              <div className="flex w-full items-center justify-end gap-2">
                <div
                  className="flex p-2 border border-(--color-border-default) bg-transparent rounded-[50%] cursor-pointer hover:bg-emerald-600 active:bg-(--color-border-strong) hover:text-white duration-100 transition-all"
                  onClick={() => setIsTransactionModalOpen(null)}
                >
                  <X size={20} />
                </div>
                <div className="flex p-2 border border-(--color-brand-red) bg-(--color-brand-red) rounded-[50%] cursor-pointer hover:bg-red-900 hover:border-red-900">
                  <Trash size={20} className="text-white" />
                </div>
                <div className="flex p-2 border border-(--color-border-default) rounded-[50%] bg-(--color-brand-green) cursor-pointer hover:bg-emerald-600 hover:border-(--color-border-default) active:bg-(--color-border-strong) duration-100 transition-all">
                  <Check size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex w-full h-fit items-center">
        <p className="text-3xl font-semibold">Transactions</p>

        <div className="flex w-auto flex-auto" />

        <div className="flex w-fit h-fit border border-(--color-brand-green) rounded-lg hover:bg-(--color-brand-green) px-5 py-1 text-[0.8rem] cursor-pointer duration-100 transition-all items-center">
          <File size={15} className="mr-1" />
          <p>Export report</p>
        </div>
      </div>
      {/* Transactions */}
      <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] h-full border border-(--color-border-default) rounded-lg">
        {/* Filter Bar */}
        <div className="flex w-full h-full px-5 py-2 gap-3 ">
          {/* Filter by header */}
          <div className="relative flex flex-col">
            <div
              className={`flex w-full h-fit border border-(--color-border-default) font-display text-[0.8rem] py-1 px-5 ${filter ? "rounded-b-0 rounded-tr-lg rounded-t-lg rounded-tl-lg" : "rounded-lg"} gap-2 items-center justify-center cursor-pointer hover:bg-(--color-bg-subtle) transition-all duration-100`}
              onClick={() => setFilter((prev) => !prev)}
            >
              <ListFilterIcon size={15} />
              <p className="hidden lg:block">{selectedFilter}</p>
              {filter ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {filter && (
              <div className="absolute flex-col w-full top-7 flex border border-(--color-border-default) bg-(--color-bg-secondary) z-50 rounded-b-lg py-2">
                {filterOptions.map((item) => (
                  <div
                    className="hover:bg-(--color-bg-subtle) px-5 py-1 hover:cursor-pointer"
                    onClick={() => handleFilterClose(item)}
                  >
                    <p className="font-display text-[0.8rem]">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date range */}
          <div className="flex w-fit h-fit border border-(--color-border-default) font-display text-[0.8rem] py-1 px-3 rounded-lg gap-2 items-center justify-center">
            <Calendar size={15} />
            <p className="whitespace-nowrap hidden lg:block">Date range</p>
            <ChevronDown size={20} />
          </div>

          {/* Search field */}
          <div className="px-3 py-1 flex w-fit h-fit border border-(--color-border-default) rounded-md items-center gap-2">
            <Search size={15} className="flex" />
            <input
              placeholder="Search..."
              className="flex flex-3 decorations-none placeholder:text-[0.8rem] focus:outline-none focus:ring-0 focus:border-transparent text-[0.8rem]"
            />
          </div>
        </div>

        {/* Transaction Table */}
        <div className="flex flex-col w-full h-full">
          {/** Transaction headers */}
          <div className="grid grid-cols-[repeat(6,1fr)] gap-4 font-mono text-[0.9rem] py-1 px-5 pt-1 font-display border-b border-(--color-border-default)">
            <div className="line-clamp-1">Date & time</div>
            <div>Type</div>
            <div>Description</div>
            <div>Category</div>
            <div>Account</div>
            <div className="text-left">Amount</div>
          </div>

          <div className="flex relative w-full h-full overflow-hidden">
            {transactions ? (
              <div className="flex flex-col w-full h-fit">
                {transactions.map((transaction, key) => (
                  <div
                    className="grid grid-cols-[repeat(6,1fr)] gap-4 font-display text-[0.9rem] px-5 py-5 font-display w-full h-fit cursor-pointer hover:bg-(--color-bg-subtle) border-b border-(--color-border-subtle)"
                    key={key}
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
                      <p className="line-clamp-1">{transaction.description}</p>
                    </div>
                    <div className="flex w-full items-center">
                      <p className="line-clamp-1">{transaction.categories?.type}</p>
                    </div>
                    <div className="flex w-full items-center">
                      <p className="line-clamp-1">{transaction.accounts?.name}</p>
                    </div>
                    <div
                      className={`flex w-full items-center font-mono ${transaction.type === "income" ? "text-emerald-500" : transaction.type === "expense" ? "text-red-500" : "text-(--color-text-primary)"}`}
                    >
                      <p className="line-clamp-1">{transaction.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="absolute z-50 bg-black/20 flex w-full h-full inset-0 items-center justify-center">
                <div className="flex border border-(--color-border-default) bg-(--color-bg-secondary) rounded-lg shadow-md px-5 py-2">
                  {pending ? (
                    <div className="flex w-full items-center gap-4">
                      <p className="text-[0.9rem] font-mono">Loading transactions...</p>
                    </div>
                  ) : (
                    <div className="flex w-full items-center gap-4">
                      <CircleAlert size={15} />
                      <p className="text-[0.9rem]">{fetchError}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex text-[0.9rem] w-full h-full px-5 py-2 font-display justify-between text-(--color-text-secondary) gap-2 items-center">
          {/* Show num of items */}
          <div className="flex w-fit h-full items-center">
            <p>Show data</p>

            <div className="flex border border-(--color-border-default) text-(--color-text-secondary) px-3 py-2 mx-2 rounded-lg shadow-sm">
              <p>{totalPages}</p>
            </div>

            <p>of {totalNumberOfItems}</p>
          </div>

          {/* Pagination */}
          <div className="flex w-fit h-full items-center gap-2 mx-3">
            {windowStart > 0 && (
              <div
                className="px-3 py-2 border border-(--color-border-default) rounded-lg shadow-md cursor-pointer hover:bg-(--color-bg-subtle)"
                onClick={() => setWindowStart((prev) => Math.max(0, prev - 5))}
              >
                <ChevronLeft size={15} />
              </div>
            )}
            {visiblePages.map((item, key) => (
              <div
                className={`px-3 py-2 border border-(--color-border-default) rounded-lg shadow-md hover:bg-(--color-bg-subtle) cursor-pointer ${currentPage === item ? "bg-(--color-brand-green) text-black hover:bg-(--color-brand-green)" : null}`}
                key={key}
                onClick={() => setCurrentPage(item)}
              >
                <p>{item}</p>
              </div>
            ))}
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
    </div>
  );
}
