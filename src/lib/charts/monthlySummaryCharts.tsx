import { useState } from "react";
import { Pie, PieChart, PieSectorDataItem, Sector, Tooltip, TooltipIndex } from "recharts";

const renderActiveShape = (dataKey: string, nameKey: string) => ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
}: PieSectorDataItem) => {
  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={-8}
        textAnchor="middle"
        fill="#ffffff"
        fontSize={15}
        fontWeight={"bold"}
      >
        {payload[nameKey]}
      </text>
      <text x={cx} y={cy} dy={12} textAnchor="middle" fill="#999" fontSize={12}>
        {payload[dataKey] + "%"}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(innerRadius ?? 0) + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export default function MonthlySummaryChart({
  isAnimationActive = true,
  defaultIndex = undefined,
  source,
  dataKey,
  nameKey,
  total,
}: {
  isAnimationActive?: boolean;
  defaultIndex?: TooltipIndex;
  source: Record<string, unknown>[],
  dataKey: string,
  nameKey: string,
  total: string,
}) {
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const activeItem = activeIndex !== undefined ? source[activeIndex] : null;
  return (
    <PieChart
      style={{
        width: "100%",
        maxWidth: "300px",
        maxHeight: "300px",
        aspectRatio: 1,
      }}
      responsive
    >
      <Pie
        activeShape={renderActiveShape(dataKey, nameKey)}
        {...({ activeIndex } as any)}
        data={source}
        cx="50%"
        cy="50%"
        innerRadius="60%"
        outerRadius="80%"
        fill="#8884d8"
        dataKey={dataKey}
        nameKey={nameKey}
        isAnimationActive={isAnimationActive}
        onMouseEnter={(_data, index) => setActiveIndex(index)}
        onMouseLeave={() => setActiveIndex(-1)}
      />
      {!activeItem && (
        <>
          <text
            x="50%"
            y="41%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffffff"
            fontSize={12}
            className="font-normal font-light text-(--color-text-secondary)"
          >
            Total
          </text>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffffff"
            fontSize={25}
            className="font-mono"
          >
            {total}
          </text>
        </>
      )}
      <Tooltip content={() => null} defaultIndex={defaultIndex} />
    </PieChart>
  );
}