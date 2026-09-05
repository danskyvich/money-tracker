import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

interface SixMonthsChart {
  inflowData: number[] | undefined;
  outflowData: number[] | undefined;
  xAxisLabels: string[] | undefined;
}

export default function SixMonthsRef({inflowData, outflowData, xAxisLabels}:SixMonthsChart) {
  // variables for the stacked bar chart
  const sixMonthsRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

  //stacked bar chart
  useEffect(() => {
    const renderChart = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const textPrimary = rootStyles.getPropertyValue("--color-text-primary").trim();

      const options = {
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "shadow",
          },
        },
        color: ["#4ECDC4", "#FF6B6B"],
        grid: {
          left: "30px",
          right: "15px",
          top: "30px",
          bottom: "30px",
          containLabel: true,
        },
        label: {
          show: false,
        },
        xAxis: {
          type: "category",
          data: xAxisLabels,
          xAxisLabels: { color: textPrimary }
        },
        yAxis: {
          type: "value",
          xAxisLabels: { color: textPrimary }
        },
        series: [
          {
            type: "bar",
            data: inflowData,
            stack: "total",
          },
          {
            type: "bar",
            data: outflowData,
            stack: "total",
          },
        ],
      };

      // attach container ref to chartRef if chartRef is null
      if (!chartRef.current && sixMonthsRef.current) {
        chartRef.current = echarts.init(sixMonthsRef.current);
      }

      if (chartRef.current) {
        chartRef.current.setOption(options);
      }
    }

    renderChart();

    // function for handling resize
    const handleResize = () => chartRef.current?.resize();
    window.addEventListener("resize", handleResize);

    const observer = new MutationObserver(renderChart);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    }
  }, [xAxisLabels, inflowData, outflowData]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        minHeight: '250px',
      }}
      ref={sixMonthsRef}
    />
  );
}
