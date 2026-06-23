"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface DoughnutChartProps {
  data: Array<{ name: string; value: number }>;
}

export default function DoughnutChart({ data }: DoughnutChartProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    const option = {
      tooltip: {
        trigger: "item",
      },
      color: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"],
      series: {
        type: "pie",
        data: data,
        radius: ["45%", "75%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: true,
        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
      },
      legend: {
        orient: "vertical",
        left: "left", // ✅ Use 'left' instead of 'x'
        data: data.map((item) => item.name),
      },
    };

    if (divRef.current && !chartRef.current) {
      chartRef.current = echarts.init(divRef.current);
    }

    if (chartRef.current) {
      chartRef.current.setOption(option);
    }

    const handleResize = () => {
      chartRef.current?.resize(); // ✅ Add () to actually call resize
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, [data]);

  return (
    <div
      className="flex flex-2 flex-col"
      style={{ width: "100%", height: "100%" }}
      ref={divRef}
    />
  );
}
