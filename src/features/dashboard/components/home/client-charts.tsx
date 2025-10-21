"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, CartesianGrid, Line, LineChart } from "recharts";

interface BarChartWrapperProps {
  data: Array<Record<string, unknown>>;
  dataKey: string;
  config: ChartConfig;
  xAxisKey?: string;
}

export function BarChartWrapper({
  data,
  dataKey,
  config,
  xAxisKey = "month",
}: BarChartWrapperProps) {
  return (
    <ChartContainer config={config} className="h-[200px] w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey={dataKey} fill={`var(--color-${dataKey})`} radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

interface LineChartWrapperProps {
  data: Array<Record<string, unknown>>;
  dataKey: string;
  config: ChartConfig;
  xAxisKey?: string;
}

export function LineChartWrapper({
  data,
  dataKey,
  config,
  xAxisKey = "month",
}: LineChartWrapperProps) {
  return (
    <ChartContainer config={config} className="h-[200px] w-full">
      <LineChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={`var(--color-${dataKey})`}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
