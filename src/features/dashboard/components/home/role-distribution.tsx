"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";

interface RoleItem {
  role: string;
  count: number;
}

interface RoleDistributionCardProps {
  data: RoleItem[];
  title?: string;
  description?: string;
  config?: ChartConfig;
  className?: string;
}

export function RoleDistributionCard({
  data,
  title = "Phân Loại Người Dùng",
  description = "Tỷ lệ vai trò trong hệ thống",
  config,
  className,
}: RoleDistributionCardProps) {
  const chartConfig =
    config ??
    ({ desktop: { label: "Users", color: "var(--chart-1)" } } as ChartConfig);

  return (
    <Card className={`flex flex-col ${className ?? ""}`}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[450px]">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="role"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" fill="var(--color-desktop)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
