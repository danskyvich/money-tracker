"use client";

import { getCategoryBreakdown } from "@/lib/data/fetchChartData";
import { useEffect, useState } from "react";
import DoughnutChart from "../../../components/charts/DoughnutChart";

export default function IncomeBreakdownPage() {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoryBreakdown("income").then(({ chartData }) => {
      setChartData(chartData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-[0.9rem] font-mono">Loading...</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-[0.9rem] font-mono">Loading...</p>
      </div>
    );
  }

  return <DoughnutChart data={chartData} />;
}
