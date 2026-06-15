"use client";

import Card from "@/components/ui/Card";
import { useEffect, useState } from "react";
import { transactions } from "@/lib/mocks/mockTransactions";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ListFilterIcon,
  Search,
  Trash,
  X,
} from "lucide-react";
import { useModal } from "@/lib/hooks/useModal";

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
  const [search, setSearch] = useState<boolean>(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] =
    useState<number | null>(null);
  const {openModal, closeModal } = useModal();

  //functions
  const handleFilterClose = (choice: string) => {
    setSelectedFilter(choice);
    setFilter(false);
  };

  //open modal
  const handleOpenModal = (index: number) => {
    openModal();
    setIsTransactionModalOpen(index);
  }

  const handleCloseModal = () => {
    closeModal();
    setIsTransactionModalOpen(null);
  }

  return (
    <div className="flex w-full h-full gap-5">
      {/* Transactions */}
      <Card
        header="Transactions"
        subheader="View your monthly transactions here"
        className="flex flex-col flex-3 peer-first-of-type:w-full h-full relative"
      >
        {/* Filter Bar */}
        <div className="flex w-full h-fit px-5 py-2 gap-3 ">
          {/* Filter by header */}
          <div className="relative flex flex-col">
            <div
              className={`flex w-full h-fit border border-(--color-border-default) font-display text-[0.8rem] py-1 px-5 ${filter ? "rounded-b-0 rounded-tr-lg rounded-t-lg rounded-tl-lg" : "rounded-lg"} gap-2 items-center justify-center cursor-pointer hover:bg-(--color-bg-subtle) transition-all duration-100`}
              onClick={() => setFilter((prev) => !prev)}
            >
              <ListFilterIcon size={15} />
              <p>{selectedFilter}</p>
              {filter ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {filter && (
              <div className="absolute flex-col w-full top-7 flex border border-(--color-border-default) bg-(--color-bg-secondary) z-50 rounded-b-lg py-2">
                {filterOptions.map((item) => (
                  <div
                    className="hover:bg-(--color-bg-subtle) px-5 py-1 hover:cursor-pointer"
                    onClick={() => handleFilterClose(item)}
                  >
                    <p className="font-display text-[0.9rem]">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date range */}
          <div className="flex w-fit h-fit border border-(--color-border-default) font-display text-[0.8rem] py-1 px-3 rounded-lg gap-2 items-center justify-center">
            <Calendar size={15} />
            <p className="whitespace-nowrap">Date range</p>
            <ChevronDown size={20} />
          </div>

          {/* Search field */}
          <div className="px-3 flex w-75 h-full border border-(--color-border-default) rounded-md items-center gap-2">
            <Search size={15} className="flex" />
            <input
              placeholder="Search..."
              className="flex flex-3 decorations-none placeholder:text-[0.8rem] focus:outline-none focus:ring-0 focus:border-transparent text-[0.8rem]"
            />
          </div>

          <div className="flex flex-auto w-auto" />

          <div className="flex w-fit gap-10 text-[0.9rem] items-center">
            <div className="whitespace-nowrap flex gap-2">
              <p className="font-display">Income:</p>
              <p>3,122.00</p>
            </div>

            <div className="whitespace-nowrap flex gap-2">
              <p className="font-display">Expense:</p>
              <p>1,485.24</p>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-auto flex-1">
          {/** Transaction headers */}
          <div className="grid grid-cols-[50px_100px_100px_100px_1fr_200px_200px] gap-4 font-mono text-[0.9rem] text-(--color-text-secondary) py-2 px-5 pt-1 font-display">
            <div>Icon</div>
            <div>Date</div>
            <div>Time</div>
            <div>Type</div>
            <div>Description</div>
            <div>Account</div>
            <div className="text-left">Amount</div>
          </div>

          {/* Transaction rows */}
          {transactions.map((transaction, index) => (
            <>
              <div
                key={index}
                onClick={() => setIsTransactionModalOpen(index)}
                className="grid grid-cols-[50px_100px_100px_100px_1fr_200px_200px] gap-4 items-center py-3 text-[0.9rem] hover:bg-(--color-bg-subtle) hover:cursor-pointer active:bg-(--color-border-default) px-5 border-b border-(--color-border-subtle)"
              >
                {/* Icon */}
                <div className="flex items-center justify-center">
                  {transaction.icon}
                </div>

                {/*Date */}
                <div className="text-(--color-text-secondary)">
                  {transaction.date}
                </div>

                {/* Time */}
                <div className="text-(--color-text-secondary)">
                  {transaction.time}
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
                  className={`text-left font-semibold ${
                    transaction.type.match("Expense")
                      ? "text-red-400"
                      : "text-emerald-500"
                  }`}
                >
                  {transaction.amount}
                </div>
              </div>
            </>
          ))}

          {/* Transaction Info Modal */}
          {isTransactionModalOpen !== null && (
            <div className="absolute z-50 p-5 top-[25%] left-[35%] w-[30%] border border-(--color-border-default) rounded-xl bg-(--color-bg-secondary) shadow-md">
              <div className="flex flex-col w-full gap-3">
                {/* Header */}
                <div className="flex w-full items-center gap-4 font-mono">
                  <p>{transactions[isTransactionModalOpen].icon}</p>

                  <div className="flex flex-col">
                    <p className="text-[1rem]">
                      {transactions[isTransactionModalOpen].description}
                    </p>
                    {(transactions[isTransactionModalOpen].type ===
                      "Income" && (
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
                  <div className="flex flex-1 w-full py-1 rounded-xl items-center text-[0.8rem]">
                    <p className="text-[0.8rem] text-(--color-text-secondary)">
                      Amount
                    </p>
                    <div className="flex flex-auto w-auto" />
                    <p>
                      {transactions[isTransactionModalOpen].amount}
                    </p>
                  </div>

                  <div className="flex flex-1 w-full py-1 rounded-xl items-center text-[0.8rem]">
                    <p className="text-[0.8rem] text-(--color-text-secondary)">
                      Date & time of transaction
                    </p>
                    <div className="flex flex-auto w-auto" />
                    <p>
                      {transactions[isTransactionModalOpen].date} |{" "}
                      {transactions[isTransactionModalOpen].time}
                    </p>
                  </div>

                  <div className="flex flex-1 w-full py-1 rounded-xl items-center text-[0.8rem]">
                    <p className="text-[0.8rem] text-(--color-text-secondary)">
                      Category
                    </p>
                    <div className="flex flex-auto w-auto" />
                    <p>
                      {transactions[isTransactionModalOpen].category}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex w-full items-center justify-end gap-2">
                  <div
                    className="flex p-2 border border-(--color-border-default) bg-transparent rounded-[50%] cursor-pointer hover:bg-emerald-600 active:bg-(--color-border-strong) hover:text-white duration-100 transition-all"
                    onClick={() => setIsTransactionModalOpen(null)}
                  >
                    <X size={20}/>
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
          )}
        </div>

        <div className="flex text-[0.9rem] w-full h-fit px-5 py-2 font-display text-(--color-text-secondary) gap-2 items-center">
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
      </Card>
    </div>
  );
}
