"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A pie chart with a label";

interface PieChartProps {
  data: { name: string; value: number; fill: string }[];
}

const chartConfig = {
  stations: {
    label: "Trạm Sạc",
  },
  users: {
    label: "Người Dùng",
    color: "var(--chart-1)",
  },
  reservations: {
    label: "Đặt Chỗ",
    color: "var(--chart-2)",
  },
  subscriptions: {
    label: "Gói Dịch Vụ",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;
export function ResourceUtilizationPie({ data }: PieChartProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Biểu Đồ Tròn - Nhãn</CardTitle>
        <CardDescription>Phân loại tài nguyên</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[350px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" label nameKey="name" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
