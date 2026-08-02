"use client";

import { useActionState, useEffect, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  File,
  ListFilterIcon,
  Search,
} from "lucide-react";
import ConvertTimestampToDateTime from "@/utils/convertToDateTime";
import { getOverviewData } from "@/lib/data/overview";
import { Transaction } from "@/lib/types/database";
import TransactionWrapper from "../layout/transaction/TransactionWrapper";

const filterOptions = ["Type", "Category", "Account"];

export default function TransactionsPage() {
  // states
  const [filter, setFilter] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState("Filter");

  // fetch data for transactionModal
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    document.title = "Your transactions";
  }, [])

  // fetch data & error
  const [transactionsError, setTransactionsError] = useState<string | null>("");
  const [transactionsData, setTransactionsData] = useState<any[] | null>(null); // data without errors goes here
  const [categoryData, setCategoryData] = useState<any[] | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [accountsData, setAccountsData] = useState<any[] | null>(null);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const [totalNumberOfItems, setTotalNumberOfItems] = useState<number | null>(
    null,
  );
  const [pending, setPending] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // pagination --> edit # of items calculations on lib/data/overview.ts
  // calculation here is purely for pagination purposes
  const [currentPage, setCurrentPage] = useState<number>(1); // dynamic, comes from page number the user clicks to navigate
  const totalPages = totalNumberOfItems ? Math.ceil(totalNumberOfItems / 9) : 0;
  const paginationArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [windowStart, setWindowStart] = useState(0);
  const visiblePages = paginationArray.slice(windowStart, windowStart + 5);

  // main fetch function
  const fetchData = async () => {
    setPending(true);
    const {
      transactionData,
      transactionError,
      transactionCount,
      categoryData,
      categoryError,
      accountsData,
      accountsError,
    } = await getOverviewData(currentPage);

    setPending(false);

    if (!transactionData || transactionCount == null) {
      return setTransactionsError("Error: " + transactionError?.message);
    }

    if (!categoryData) {
      return setCategoryError("Error: " + categoryError?.message);
    }

    if (!accountsData) {
      return setAccountsError("Error: " + accountsError?.message);
    }

    setTransactionsError(null);
    setCategoryError(null);
    setAccountsError(null);
    setTotalNumberOfItems(transactionCount);
    setTransactionsData(transactionData);
    setCategoryData(categoryData);
    setAccountsData(accountsData);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  //functions
  const handleFilterClose = (choice: string) => {
    setSelectedFilter(choice);
    setFilter(false);
  };

  const handleOpenModal = (toggle: boolean, selectedTransaction: Transaction | null) => {
    setOpenModal(toggle)
    setSelectedTransaction(selectedTransaction);
  }

  return (
    <div className="flex flex-col w-full h-full gap-5">

      <TransactionWrapper 
      toggle={openModal} 
      currentPage={currentPage} 
      selectedTransaction={selectedTransaction} 
      onClose={() => handleOpenModal(false, null)}
      categoryData = {categoryData}
      accountsData = {accountsData}
      onTransactionSaved={fetchData}
      />

      {/* Transaction header */}
      <div className="flex w-full h-fit items-center justify-between">
        <p className="text-3xl font-semibold">Transactions</p>

      </div>
      {/* Content */}
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
                    onClick={() => handleFilterClose(item)} // change this
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
            {transactionsData && (
              <div className="flex flex-col w-full h-fit">
                {transactionsData.map((transaction, key) => (
                  <div
                    className="grid grid-cols-[repeat(6,1fr)] gap-4 font-display text-[0.9rem] px-5 py-5 font-display w-full h-fit cursor-pointer hover:bg-(--color-bg-subtle) border-b border-(--color-border-subtle)"
                    key={key}
                    onClick={() => handleOpenModal(true, transaction)}
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

            {pending && (
              <div className="absolute z-50 flex inset-0 w-full h-full bg-black/50 items-center justify-center">
                <div className="flex border border-(--color-border-default) bg-(--color-bg-secondary) w-fit h-fit px-5 py-1 rounded-lg shadow-md">
                  <p className="font-mono text-[0.9rem]">
                    Loading transactions...
                  </p>
                </div>
              </div>
            )}

            {transactionsError && (
              <div className="absolute z-50 flex inset-0 w-full h-full bg-black/50 items-center justify-center">
                <div className="flex border border-(--color-border-default) bg-(--color-bg-secondary) w-fit h-fit px-5 py-1 rounded-lg shadow-md">
                  <p className="font-display text-[0.9rem]">
                    Error: {transactionsError}
                  </p>
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
            {/* Left */}
            {windowStart > 0 && (
              <div
                className="px-3 py-2 border border-(--color-border-default) rounded-lg shadow-md cursor-pointer hover:bg-(--color-bg-subtle)"
                onClick={() => setWindowStart((prev) => Math.max(0, prev - 5))}
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
    </div>
  );
}
