"use client";

import { format } from "date-fns";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { RevenueInsights } from "../types/insights.types";

interface RevenueChartProps {
  data: RevenueInsights | null;
  loading?: boolean;
  granularity: "day" | "hour";
}

const chartConfig = {
  Amount: {
    label: "Doanh thu (VNĐ)",
    color: "var(--color-desktop)",
  },
} satisfies ChartConfig;

export function RevenueChart({
  data,
  loading,
  granularity,
}: RevenueChartProps) {
  const formattedData =
    data?.Series.map((item) => {
      const date = new Date(item.Bucket);

      let axisLabel: string;
      let tooltipLabel: string;

      if (granularity === "day") {
        axisLabel = format(date, "dd/MM");
        tooltipLabel = format(date, "dd/MM/yyyy");
      } else {
        const hour = date.getUTCHours();
        const hourStr = hour.toString().padStart(2, "0");
        axisLabel = `${hourStr}:00`;
        tooltipLabel = `${format(date, "dd/MM/yyyy")} ${hourStr}:00`;
      }

      return {
        date: axisLabel, // dùng cho trục X
        label: tooltipLabel, // dùng trong tooltip
        Amount: item.Amount,
      };
    }) ?? [];

  const chartWidth = Math.max(
    800,
    formattedData.length * (granularity === "day" ? 60 : 80),
  );
  const total = data?.Total?.toLocaleString("vi-VN") ?? "0";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Doanh Thu</CardTitle>
            <CardDescription>
              Theo {granularity === "day" ? "ngày" : "giờ"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="h-5 w-5" />
            <span className="text-2xl font-bold">{total} ₫</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        ) : formattedData.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Không có dữ liệu doanh thu</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart
                width={chartWidth}
                height={320}
                data={formattedData}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <CartesianGrid vertical={false} />

                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  interval={
                    granularity === "day"
                      ? Math.max(0, Math.floor(formattedData.length / 10) - 1)
                      : "preserveStartEnd"
                  }
                />

                <YAxis
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />

                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) => {
                        if (payload && payload.length > 0) {
                          const data = payload[0].payload as { label: string };
                          return data.label;
                        }
                        return "";
                      }}
                      formatter={(value) =>
                        `${Number(value).toLocaleString("vi-VN")} ₫`
                      }
                    />
                  }
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                />

                <Bar dataKey="Amount" fill="var(--chart-1)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
