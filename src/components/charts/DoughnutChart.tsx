"use client";

import { useEffect, useRef } from "react";
import { PieChart } from "echarts/charts";
import { TooltipComponent, LegendComponent, TitleComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import * as echarts from "echarts/core";

interface DoughnutChartProps {
  data: Array<{ name: string; value: number }>;
}

export default function DoughnutChart({ data }: DoughnutChartProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  echarts.use([
    PieChart,
    TooltipComponent,
    LegendComponent,
    TitleComponent, 
    CanvasRenderer,
  ]);

  useEffect(() => {
    const renderChart = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const textPrimary = rootStyles
        .getPropertyValue("--color-text-primary")
        .trim();

      const option = {
        title: {
          text: data
            .reduce((sum, item) => sum + item.value, 0)
            .toLocaleString("en-PH", {
              style: "currency",
              currency: "PHP",
              minimumFractionDigits: 2,
            }),
          subtext: "Total",
          left: "center",
          top: "center",
          textStyle: {
            fontSize: 20,
            fontWeight: "bold",
            color: textPrimary,
          },
          subtextStyle: {
            fontSize: 14,
            color: textPrimary,
          },
        },
        tooltip: {
          trigger: "item",
          formatter: (params: any) => {
            const amount = Number(params.value).toLocaleString("en-PH", {
              minimumFractionDigits: 2,
            });
            return `${params.name}: ${amount} (${params.percent}%)`;
          },
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
          left: "left",
          data: data.map((item) => item.name),
        },
      };

      if (divRef.current && !chartRef.current) {
        chartRef.current = echarts.init(divRef.current);
      }

      if (chartRef.current) {
        chartRef.current.setOption(option);
      }
    };

    renderChart();

    const handleResize = () => {
      chartRef.current?.resize(); // ✅ Add () to actually call resize
    };

    window.addEventListener("resize", handleResize);

    const observer = new MutationObserver(renderChart);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.dispose();
      observer.disconnect();
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
