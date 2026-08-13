"use client";

import WholeTransactionList from "./components/transaction-list";

export default function TransactionsPage() {
  return (
    <div className="flex flex-col w-full h-full gap-5">
      {/* Transaction header */}
      <div className="flex w-full h-fit items-center justify-between">
        <p className="text-3xl font-semibold">Transactions</p>
      </div>
      {/* Content */}
      <WholeTransactionList/>
    </div>
  );
}
