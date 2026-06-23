"use client";

import { monthlyIncome } from "@/lib/mocks/mockAccounts";
import DoughnutChart from "@/components/charts/DoughnutChart"; // adjust path as needed

export default function IncomeBreakdownPage() {
  const incomeData = monthlyIncome.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  return (
    <div className="flex flex-1 w-full h-full">
      <DoughnutChart data={incomeData} />
    </div>
  );
}
