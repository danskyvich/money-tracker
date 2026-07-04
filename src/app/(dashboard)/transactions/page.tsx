"use client";

import Card from "@/components/layout/Card";
import { useEffect, useState } from "react";
import { transactions } from "@/lib/mocks/mockTransactions";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  File,
  ListFilterIcon,
  Search,
  Trash,
  X,
} from "lucide-react";

const filterOptions = ["Type", "Category", "Account"];

const pagination = [1, 2, 3];

export default function Transactions() {
  useEffect(() => {
    document.title = "Your transactions";
  });

  //states
  const [filter, setFilter] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState("Filter");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState<
    number | null
  >(null);

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
          <div className="p-5 w-[200px] md:w-[400px] sm:w-[200px] border border-(--color-border-default) rounded-xl bg-(--color-bg-secondary) shadow-md">
            <div className="flex flex-col w-full gap-3">
              {/* Header */}
              <div className="flex w-full items-center gap-4 font-mono">
                <p>{transactions[isTransactionModalOpen].icon}</p>

                <div className="flex flex-col">
                  <p className="text-[1rem]">
                    {transactions[isTransactionModalOpen].description}
                  </p>
                  {(transactions[isTransactionModalOpen].type === "Income" && (
                    <p className="text-[0.8rem] text-(--color-text-secondary)">
                      {transactions[isTransactionModalOpen].type}, added to{" "}
                      {transactions[isTransactionModalOpen].account}
                    </p>
                  )) ||
                    (transactions[isTransactionModalOpen].type ===
                      "Expense" && (
                      <p className="text-[0.8rem] text-(--color-text-secondary)">
                        {transactions[isTransactionModalOpen].type}, deducted
                        from {transactions[isTransactionModalOpen].account}
                      </p>
                    )) ||
                    (transactions[isTransactionModalOpen].type ===
                      "Transfer" && (
                      <p className="text-[0.8rem] text-(--color-text-secondary)">
                        {transactions[isTransactionModalOpen].type}, from{" "}
                        {transactions[isTransactionModalOpen].from}
                        <ArrowRight size={15} className="inline-flex mx-1" />
                        {transactions[isTransactionModalOpen].to}
                      </p>
                    ))}
                </div>
              </div>

              <div className="flex flex-col w-full h-fit border border-(--color-border-subtle) rounded-xl py-5 px-3">
                <div className="flex flex-col sm:flex-row flex-1 w-full py-1 rounded-xl items-center text-[0.8rem]">
                  <p className="text-[0.8rem] text-(--color-text-secondary)">
                    Amount
                  </p>
                  <div className="flex flex-auto w-auto" />
                  <p>{transactions[isTransactionModalOpen].amount}</p>
                </div>

                <div className="flex flex-col sm:flex-row w-full py-1 rounded-xl items-center text-[0.8rem]">
                  <p className="text-[0.8rem] text-(--color-text-secondary)">
                    Date & time of transaction
                  </p>
                  <div className="flex flex-auto w-auto" />
                  <p>
                    {transactions[isTransactionModalOpen].date} |{" "}
                    {transactions[isTransactionModalOpen].time}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row w-full py-1 rounded-xl items-center text-[0.8rem]">
                  <p className="text-[0.8rem] text-(--color-text-secondary)">
                    Category
                  </p>
                  <div className="flex flex-auto w-auto" />
                  <p>{transactions[isTransactionModalOpen].category}</p>
                </div>
              </div>

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
      <div className="flex flex-col flex-3 justify-between h-full relative border border-(--color-border-default) rounded-lg">
        {/* Transaction Table */}
        <div className="overflow-auto flex-col">
          {/* Filter Bar */}

          <div className="flex w-full h-fit px-5 py-2 gap-3 ">
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
            <div className="px-3 flex w-fit h-full border border-(--color-border-default) rounded-md items-center gap-2">
              <Search size={15} className="flex" />
              <input
                placeholder="Search..."
                className="flex flex-3 decorations-none placeholder:text-[0.8rem] focus:outline-none focus:ring-0 focus:border-transparent text-[0.8rem]"
              />
            </div>
          </div>
          {/** Transaction headers */}
          <div className="grid grid-cols-[50px_50px_50px_100px_50px_50px] md:grid-cols-[50px_100px_100px_150px_50px_50px] lg:grid-cols-[100px_100px_100px_250px_100px_100px] xl:grid-cols-[150px_150px_150px_1fr_100px_100px] gap-4 font-mono text-[0.9rem] py-1 px-5 pt-1 font-display border-b border-(--color-border-default)">
            <div>Icon</div>
            <div>Date & time</div>
            <div>Type</div>
            <div>Description</div>
            <div>Account</div>
            <div className="text-left">Amount</div>
          </div>

          <div className="flex flex-col flex-1">
            {/* Transaction rows */}
            {transactions.map((transaction, index) => (
              <div
                key={index}
                onClick={() => setIsTransactionModalOpen(index)}
                className="grid grid-cols-[50px_50px_50px_100px_50px_50px] md:grid-cols-[50px_100px_100px_150px_50px_50px] lg:grid-cols-[100px_100px_100px_250px_100px_100px] xl:grid-cols-[150px_150px_150px_1fr_100px_100px] gap-4 items-center py-1 text-[0.9rem] hover:bg-(--color-bg-subtle) hover:cursor-pointer active:bg-(--color-border-default) px-5 border-b border-(--color-border-subtle)"
              >
                {/* Icon */}
                <div className="flex items-center justify-center">
                  {transaction.icon}
                </div>

                {/*Date & Time*/}
                <div className="flex flex-col text-(--color-text-secondary)">
                  <p>{transaction.date}</p>
                  <p>{transaction.time}</p>
                </div>

                {/* Type */}
                <div className="text-(--color-text-secondary)">
                  {transaction.type}
                </div>

                {/* Transaction */}
                <div>
                  <p className="text-(--color-text-primary)">
                    {transaction.description}
                  </p>
                </div>

                {/* Account */}
                <div className="text-(--color-text-secondary)">
                  {transaction.account}
                </div>

                {/* Amount */}
                <div
                  className={`text-left font-mono text-[1rem] ${
                    transaction.type.match("Expense")
                      ? "text-red-400"
                      : transaction.type.match("Transfer")
                        ? "text-(--color-text-primary)"
                        : "text-green-400"
                  }`}
                >
                  <span className="mr-1">
                    {transaction.type.match("Expense") ? "-" : null}
                  </span>
                  <span className="text-[0.8rem] mr-1">₱</span>
                  {transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-0 text-[0.9rem] w-full h-fit px-5 py-2 font-display text-(--color-text-secondary) gap-2 items-center">
          <p>Show data</p>

          <div className="flex border border-(--color-border-default) text-(--color-text-secondary) px-3 py-2 rounded-lg shadow-sm">
            <p>10</p>
          </div>

          <p>of 200</p>

          <div className="flex flex-auto w-auto" />

          <div className="flex w-fit gap-2">
            {pagination.map((item) => (
              <div
                className={`border border-(--color-border-default) rounded-lg px-3 py-2 shadow-sm hover:cursor-pointer ${currentPage === item ? "bg-(--color-border-strong) text-white" : null}`}
                onClick={() => setCurrentPage(item)}
              >
                <p>{item}</p>
              </div>
            ))}

            <div className="flex w-fit px-3 py-2 font display items-center border border-(--color-border-default) rounded-lg hover:cursor-pointer hover:bg-(--color-border-subtle) shadow-md">
              <p>Next</p>
              <ChevronRight size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
