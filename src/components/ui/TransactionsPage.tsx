"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Coins,
  File,
  ListFilterIcon,
  Search,
  X,
} from "lucide-react";
import ConvertTimestampToDateTime from "@/utils/convertToDateTime";
import { getOverviewData } from "@/lib/data/overview";
import { Transaction } from "@/lib/types/database";

const filterOptions = ["Type", "Category", "Account"];

export default function TransactionsPage() {
  // states
  const [filter, setFilter] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState("Filter");
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoryDropdown, setIsCategoryDropdown] = useState(false);
  const [isTypeDropdown, setIsTypeDropdown] = useState(false);
  const [isAccountDropdown, setIsAccountDropdown] = useState(false);
  const [isAccountDropdownTo, setIsAccountDropdownTo] = useState(false);

  // fetch data for transactionModal
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const types = ["income", "expenses", "transfer"];

  // rename page and initialize values to modal inputs/dropdowns
  useEffect(() => {
    document.title = "Your transactions";
    setChosenDateTime(selectedTransaction?.date_time ?? "");
    setChosenType(selectedTransaction?.type ?? "");
    setChosenCategory(selectedTransaction?.categories?.name ?? "");
    setChosenAccount(selectedTransaction?.fromAccount?.name ?? "");
    setChosenAccountTo(selectedTransaction?.toAccount?.name ?? "");
    setChosenAmount(selectedTransaction?.amount ?? "");
    setChosenDescription(selectedTransaction?.description ?? "");
  }, [selectedTransaction]);

  // fetch modified values in transactionModal
  const [chosenDateTime, setChosenDateTime] = useState<
    string | number | readonly string[] | undefined
  >(undefined);
  const [chosenType, setChosenType] = useState<string | null>(null);
  const [chosenCategory, setChosenCategory] = useState<string | null>(null);
  const [chosenAccount, setChosenAccount] = useState<string | null>(null);
  const [chosenAccountTo, setChosenAccountTo] = useState<string | null>(null);
  const [chosenDescription, setChosenDescription] = useState<
    string | number | readonly string[] | undefined
  >(undefined);
  const [chosenAmount, setChosenAmount] = useState<string | null>(null);

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

  // pagination --> edit # of items calculations on lib/data/overview.ts
  // calculation here is purely for pagination purposes
  const [currentPage, setCurrentPage] = useState<number>(1); // dynamic, comes from page number the user clicks to navigate
  const totalPages = totalNumberOfItems ? Math.ceil(totalNumberOfItems / 9) : 0;
  const paginationArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [windowStart, setWindowStart] = useState(0);
  const visiblePages = paginationArray.slice(windowStart, windowStart + 5);

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

    if (!transactionData) {
      setPending(false);
      return setTransactionsError("Error: " + transactionError?.message);
    }

    if (!transactionCount) {
      setPending(false);
      return setTransactionsError("Error: " + transactionError?.message);
    }

    if (!categoryData) {
      setPending(false);
      return setCategoryError("Error: " + categoryError?.message);
    }

    if (!accountsData) {
      setPending(false);
      return setAccountsError("Error: " + accountsError?.message);
    }
    setPending(false);
    setTransactionsError(null);
    return (
      setTotalNumberOfItems(transactionCount),
      setTransactionsData(transactionData),
      setCategoryData(categoryData),
      setAccountsData(accountsData)
    );
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  //functions
  const handleFilterClose = (choice: string) => {
    setSelectedFilter(choice);
    setFilter(false);
  };

  return (
    <div className="flex flex-col w-full h-full gap-5">
      {isTransactionModalOpen && (
        <div className="flex fixed z-50 inset-0 w-full h-full bg-black/50 items-center justify-center">
          <div className="flex flex-col md:w-100 xl:w-135 bg-(--color-bg-secondary) border border-(--color-border-default) rounded-lg shadow-md px-5 py-3">
            <div className="flex w-full h-fit px-5 py-2 items-center justify-between">
              <Coins size={20} />
              <p className="text-xl font-display font-semibold">
                Edit transaction
              </p>
              <X size={20} onClick={() => setIsTransactionModalOpen(false)} />
            </div>

            <div className="flex w-full h-full flex-col gap-2 px-5 py-3 text-[0.9rem]">
              <div className="grid grid-cols-[30%_70%] gap-4 items-center w-full">
                <p>Date and time</p>
                <input
                  type="datetime-local"
                  className="border border-(--color-border-default) px-5 py-1 rounded-lg"
                  name="dateTimeInput"
                  onChange={(e) => setChosenDateTime(e.target.value)}
                  value={chosenDateTime}
                />
              </div>

              {/* Type */}
              <div className="relative grid grid-cols-[30%_70%] gap-4 items-center w-full">
                <p>Type</p>
                <div
                  className="flex relative justify-between items-center h-fit border border-(--color-border-default) px-5 py-1 rounded-lg cursor-pointer hover:bg-(--color-bg-subtle)"
                  onClick={() => setIsTypeDropdown((prev) => !prev)}
                >
                  <p>{chosenType}</p>
                  {isTypeDropdown ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}

                  {isTypeDropdown && (
                    <div className="flex flex-col top-10 -left-1 z-50 absolute w-fit min-h-fit max-h-50 overflow-y-auto border border-(--color-border-subtle) bg-(--color-bg-base) rounded-lg shadow-md">
                      {types?.map((item, key) => (
                        <div
                          className="flex w-full px-5 py-1 h-fit text-[0.9rem] text-(--color-text-primary) font-display hover:bg-(--color-bg-subtle)"
                          key={key}
                          onClick={() => {
                            (setIsTypeDropdown(true), setChosenType(item));
                          }}
                        >
                          <p>{item}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="grid grid-cols-[30%_70%] gap-4 items-center w-full">
                <p>Category</p>
                <div
                  className="flex relative justify-between items-center h-fit border border-(--color-border-default) px-5 py-1 rounded-lg cursor-pointer hover:bg-(--color-bg-subtle)"
                  onClick={() => setIsCategoryDropdown((prev) => !prev)}
                >
                  <p>{chosenCategory}</p>
                  {isCategoryDropdown ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}

                  {isCategoryDropdown && (
                    <div className="flex flex-col top-10 -left-1 z-50 absolute w-fit min-h-fit max-h-45 overflow-y-auto border border-(--color-border-subtle) bg-(--color-bg-base) rounded-lg shadow-md">
                      {categoryData?.map((item, key) => (
                        <div
                          className="flex w-full px-5 py-1 h-fit text-[0.9rem] text-(--color-text-primary) font-display hover:bg-(--color-bg-subtle)"
                          key={key}
                          onClick={() => {
                            (setIsCategoryDropdown(true),
                              setChosenCategory(item.name));
                          }}
                        >
                          <p>{item.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selectedTransaction?.type !== "transfer" ? (
                <div className="grid grid-cols-[30%_70%] gap-4 items-center w-full">
                  <p>Account</p>
                  <div
                    className="flex relative justify-between items-center h-fit border border-(--color-border-default) px-5 py-1 rounded-lg cursor-pointer hover:bg-(--color-bg-subtle)"
                    onClick={() => setIsAccountDropdown((prev) => !prev)}
                  >
                    <p>{chosenAccount}</p>
                    {isAccountDropdown ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}

                    {isAccountDropdown && (
                      <div className="flex flex-col top-10 -left-1 z-50 absolute w-fit min-h-fit max-h-45 overflow-y-auto border border-(--color-border-subtle) bg-(--color-bg-base) rounded-lg shadow-md">
                        {accountsData?.map((item, key) => (
                          <div
                            className="flex w-full px-5 py-1 h-fit text-[0.9rem] text-(--color-text-primary) font-display hover:bg-(--color-bg-subtle)"
                            key={key}
                            onClick={() => {
                              (setIsAccountDropdown(true),
                                setChosenAccount(item.name));
                            }}
                          >
                            <p>{item.name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-[30%_70%] gap-4 items-center w-full">
                    <p>Account from</p>
                    <div
                      className="flex relative justify-between items-center h-fit border border-(--color-border-default) px-5 py-1 rounded-lg cursor-pointer hover:bg-(--color-bg-subtle)"
                      onClick={() => setIsAccountDropdown((prev) => !prev)}
                    >
                      <p>{chosenAccount}</p>
                      {isAccountDropdown ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}

                      {isAccountDropdown && (
                        <div className="flex flex-col top-10 -left-1 z-50 absolute w-fit min-h-fit max-h-45 overflow-y-auto border border-(--color-border-subtle) bg-(--color-bg-base) rounded-lg shadow-md">
                          {accountsData?.map((item, key) => (
                            <div
                              className="flex w-full px-5 py-1 h-fit text-[0.9rem] text-(--color-text-primary) font-display hover:bg-(--color-bg-subtle)"
                              key={key}
                              onClick={() => {
                                (setIsAccountDropdown(true),
                                  setChosenAccount(item.name));
                              }}
                            >
                              <p>{item.name}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[30%_70%] gap-4 items-center w-full">
                    <p>Account to</p>
                    <div
                      className="flex relative justify-between items-center h-fit border border-(--color-border-default) px-5 py-1 rounded-lg cursor-pointer hover:bg-(--color-bg-subtle)"
                      onClick={() => setIsAccountDropdownTo((prev) => !prev)}
                    >
                      <p>{chosenAccountTo}</p>
                      {isAccountDropdownTo ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}

                      {isAccountDropdownTo && (
                        <div className="flex flex-col top-10 -left-1 z-50 absolute w-fit min-h-fit max-h-60 overflow-y-auto border border-(--color-border-subtle) bg-(--color-bg-base) rounded-lg shadow-md">
                          {accountsData?.map((item, key) => (
                            <div
                              className="flex w-full px-5 py-1 h-fit text-[0.9rem] text-(--color-text-primary) font-display hover:bg-(--color-bg-subtle)"
                              key={key}
                              onClick={() => {
                                (setIsAccountDropdownTo(true),
                                  setChosenAccountTo(item.name));
                              }}
                            >
                              <p>{item.name}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-[30%_70%] gap-4 items-center w-full">
                <p>Description</p>
                <textarea
                  rows={4}
                  id="note"
                  className="w-full border border-(--color-border-default) rounded-lg focus:outline-none resize-none py-2 px-5 line-clamp-4"
                  name="descriptionInput"
                  value={chosenDescription}
                  onChange={(e) => setChosenDescription(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="flex w-full h-full py-1 text-[0.9rem] items-center justify-center border border-(--color-brand-green) hover:bg-(--color-brand-green) active:bg-emerald-700 rounded-lg cursor-pointer mt-5 duration-100 transition-all"
              >
                <p>Submit</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction header */}
      <div className="flex w-full h-fit items-center justify-between">
        <p className="text-3xl font-semibold">Transactions</p>

        <div className="flex w-fit h-fit border border-(--color-brand-green) rounded-lg hover:bg-(--color-brand-green) px-5 py-1 text-[0.8rem] cursor-pointer duration-100 transition-all items-center">
          <File size={15} className="mr-1" />
          <p>Export report</p>
        </div>
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
                    onClick={() => {
                      (setIsTransactionModalOpen((prev) => !prev),
                        setSelectedTransaction(transaction));
                    }}
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
