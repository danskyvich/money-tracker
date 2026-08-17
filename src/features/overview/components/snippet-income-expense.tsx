import { getCategoryBreakdown } from "@/features/overview/api/fetchChartData";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import SnippetSkeleton from "../../../components/layout/skeleton/snippet-skeleton";

export default function Snippet({ type }: { type: "income" | "expense" }) {
  const [total, setTotal] = useState<number>(0.0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoryBreakdown(type).then(({ chartData }) => {
      const sum = chartData.reduce((sum, item) => sum + item.value, 0);
      setTotal(sum);
      setLoading(false);
      return;
    });
  }, [type]);

  return (
    <>
      {loading ? (
        <SnippetSkeleton />
      ) : (
        <div className="flex flex-col h-31.5 flex-1 border border-(--color-border-default) rounded-xl px-5 py-3 shadow-md">
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
            <p>Growth rate</p>

            <div className="flex w-auto flex-auto" />
            <ArrowUp size={15} />
            <p>20%</p>
          </div>
        </div>
      )}
    </>
  );
}
