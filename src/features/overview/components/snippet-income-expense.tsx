import { getCategoryBreakdown } from "@/features/overview/api/fetchChartData";
import { ArrowDownLeft, ArrowUp, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import SnippetSkeleton from "../../../components/layout/skeleton/snippet-skeleton";
import { calculateExpenseRate, calculateGrowthRate, retrieveData } from "@/lib/calculations/rates";
import ErrorModal from "@/components/layout/error-modal";

export default function Snippet({ type }: { type: "income" | "expense" }) {
  const [total, setTotal] = useState<number>(0.0);
  const [loading, setLoading] = useState(true);
  const [growthRate, setGrowthRate] = useState<number>(0);
  const [expenseRate, setExpenseRate] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // the growth and expense rate would remain zero UNLESS transactions
  // were logged between months
  const fetchData = async() => {
    const total = await retrieveData({type});

    // get growth rate
    const income = await calculateGrowthRate();
    const expense = await calculateExpenseRate();

    if (!income.success || !expense.success) {
      setError("Error fetching rate data");
      return;
    }
    setGrowthRate(income.value);
    setExpenseRate(expense.value);
    setTotal(total);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
    
  }, [type]);

  return (
    <>
      {loading ? (
        <SnippetSkeleton />
      ) : (
        <div className="flex flex-col h-31.5 flex-1 border border-(--color-border-default) rounded-xl px-5 py-3 shadow-md">
          {
            error && <ErrorModal message={error}/>
          }
          <div className="flex gap-1 items-center justify-between">
            <p className="font-semibold">
              {type === "income" ? "Income" : "Expense"}
            </p>
            <p className="text-(--color-text-primary) text-[0.7rem] font-mono self-end">
              (monthly)
            </p>
          </div>
          <div className="flex flex-auto w-auto h-full" />
          <p className="flex text-2xl font-display font-normal">
            <span className="mr-1">₱</span>
            {loading
              ? "..."
              : total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex w-full items-center text-sm mt-1 text-(--color-text-secondary)">
            <p>{type === "income" ? "Growth rate" : "Expense rate"}</p>

            <div className="flex w-auto flex-auto" />
            {type === "income" ? <p>{growthRate}%</p> : <p>{expenseRate}%</p>}
            {type === "income" ? (
              <ArrowUpRight size={18} className="min-w-2 h-auto text-(--color-brand-green)" />
            ) : (
              <ArrowDownLeft size={18} className="min-w-2 h-auto text-(--color-brand-red)"/>
            )}
          </div>
        </div>
      )}
    </>
  );
}
