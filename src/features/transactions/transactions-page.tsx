"use client";

import ExpenseCategoriesCard from "./components/expense-categories-card";
import IncomeCategoriesCard from "./components/income-categories-card";
import WholeTransactionList from "./components/transaction-list";

export default function TransactionsPage() {
  return (
    <div className="flex flex-col w-full h-full gap-5">
      {/* Transaction header */}
      <div className="flex w-full h-fit items-center justify-between">
        <p className="text-3xl font-semibold">Transactions</p>
      </div>
      {/* Content */}
      <div className="flex flex-col xl:flex-row gap-5 w-full h-full">
        <WholeTransactionList />
        <div className="flex flex-col w-full h-full gap-5">
          <IncomeCategoriesCard />
          <ExpenseCategoriesCard />
        </div>
      </div>
    </div>
  );
}
