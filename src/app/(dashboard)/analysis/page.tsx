"use client";

import { accounts } from "@/lib/mocks/mockAccounts";
import { Plus } from "lucide-react";
import { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function Analysis() {
  const chartRef = useRef(null);
  const myChartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    document.title = "Analysis";
  });

  useEffect(() => {
    if (!chartRef.current) return;

    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);
    myChartRef.current = myChart;

    const chartsData = accounts.map((account) => ({
      value: Number(account.amount),
      name: account.name,
    }));

    const option = {
      tooltip: {
        trigger: "item",
      },
      color: ["#52B788", "#C9A84C", "#7EB5C8", "#e09963", "#bd63e0"],
      legend: {
        top: "10%",
        left: "center",
      },
      series: [
        {
          name: "Accounts",
          top: "15%",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          
          labelLine: {
            show: false,
          },
          data: chartsData,
        },
      ],
    };

    myChart.setOption(option);

    // Handle resize
    const handleResize = () => {
      myChart.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      myChart.dispose();
    };
  }, [accounts]);

  return (
    <div className="flex flex-col xl:flex-row xl:flex-1 w-full h-full gap-5 overflow-x-auto">
      {/* Total balance */}
      <div className="flex flex-3 flex-col w-full h-full border border-(--color-border-default) rounded-lg">
        {/* Header */}
        <div className="flex flex-0 w-full h-fit px-5 py-3 border-b border-(--color-border-default)">
          {/* label + balance */}
          <div className="flex-col flex h-full w-fit flex-1">
            <p className="text-(--color-text-secondary) text-[0.9rem]">
              Total balance
            </p>
            <p className="text-[0.8rem]">
              PHP{" "}
              <span className="font-display text-[3rem]/11 font-semibold line">
                3,188.00
              </span>
            </p>
          </div>

          <div className="flex flex-auto w-auto h-full" />

          <div className="flex w-fit h-full items-center">
            <div className="flex w-full h-fit border border-(--color-brand-green) rounded-lg text-[0.8rem] px-5 py-2 items-center cursor-pointer hover:bg-(--color-brand-green) transition-all duration-100">
              <Plus size={15} />
              <p>Add a transaction</p>
            </div>
          </div>
        </div>

        {/* Balance table */}
        <div className="flex flex-col flex-3 w-full h-full overflow-x-auto">
          {accounts.map((item, index) => (
            <div
              className="grid grid-cols-[150px_100px_100px] sm:grid-cols-[200px_100px_100px] md:grid-cols-[200px_300px_1fr] px-5 py-2 border-b border-(--color-border-subtle)"
              key={index}
            >
              <div className="flex flex-col flex-1 w-full">
                <p className="text-[0.8rem] text-(--color-text-secondary)">
                  {item.name}
                </p>
                <p className="text-xl font-mono">{item.amount}</p>
              </div>

              <div className="flex flex-1 w-full h-full items-center">
                <p className="text-[0.9rem]">{item.type}</p>
              </div>

              <div className="flex flex-3 w-full h-full items-center whitespace-nowrap">
                <p>{item.description === null ? "-" : item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col lg:flex-row xl:flex-col flex-1 gap-5">
        <div className="flex flex-col flex-1 w-full h-full border border-(--color-border-default) rounded-lg px-5 py-5 gap-5">
          <p className="font-mono text-[1.2rem] whitespace-nowrap">
            Account balance
          </p>
          <div className="w-full h-full min-h-[300px]">
            <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
          </div>
        </div>

        <div className="flex flex-1 flex-col w-full h-full border border-(--color-border-default) rounded-lg"></div>
      </div>
    </div>
  );
}
