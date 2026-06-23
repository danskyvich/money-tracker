'use client'

import { monthlyExpenses } from '@/lib/mocks/mockAccounts';
import DoughnutChart from '../charts/DoughnutChart';

export default function ExpenseBreakdownPage() {

  const expenseData = monthlyExpenses.map((item) => ({
    name: item.category,
    value: item.amount
  }))

    return (
      <div className="flex flex-1 w-full h-full">
        <DoughnutChart data={expenseData} />
      </div>
    );
}
