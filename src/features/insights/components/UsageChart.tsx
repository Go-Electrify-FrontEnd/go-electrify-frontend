"use client";

import { format, parseISO, isValid } from "date-fns";
import { Zap } from "lucide-react";
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
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { UsageInsights } from "../types/insights.types";

const chartConfig = {
  Count: {
    label: "Số phiên sạc",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface UsageChartProps {
  data: UsageInsights | null;
  loading?: boolean;
  granularity: "day" | "hour";
}

export function UsageChart({ data, loading, granularity }: UsageChartProps) {
  const formattedData =
    data?.Series.map((item) => {
      let parsedDate = parseISO(item.Bucket);
      if (!isValid(parsedDate)) {
        parsedDate = new Date(item.Bucket);
      }

      const axisLabel =
        granularity === "day"
          ? format(parsedDate, "dd/MM")
          : format(parsedDate, "HH:mm");

      const tooltipLabel =
        granularity === "day"
          ? format(parsedDate, "dd/MM/yyyy")
          : format(parsedDate, "dd/MM/yyyy HH:mm");

      return {
        time: parsedDate.getTime(),
        axisLabel,
        tooltipLabel,
        Count: item.Count,
      };
    })
      .sort((a, b) => a.time - b.time)
    ?? [];

  const chartWidth = Math.max(800, formattedData.length * (granularity === "day" ? 60 : 80));
  const totalSessions = data?.TotalSessions ?? 0;
  const peakHour = data?.PeakHour !== undefined ? `${data.PeakHour}h` : "-";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lượt Sạc</CardTitle>
            <CardDescription>
              Tổng {totalSessions.toLocaleString("vi-VN")} phiên • Giờ cao điểm: {peakHour}
            </CardDescription>
          </div>
          <Zap className="h-6 w-6 text-yellow-500" />
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        ) : formattedData.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Không có dữ liệu sử dụng</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <LineChart
                width={chartWidth}
                height={320}
                data={formattedData}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                
                <XAxis
                  dataKey="axisLabel"
                  tickLine={false}
                  axisLine={true}
                  interval={
                    granularity === "day"
                      ? Math.max(0, Math.floor(formattedData.length / 10) - 1)
                      : "preserveStartEnd"
                  }
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(value) => value.toLocaleString("vi-VN")}
                />

                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) => {
                        if (payload && payload.length > 0) {
                          const data = payload[0].payload as { tooltipLabel: string };
                          return data.tooltipLabel;
                        }
                        return "";
                      }}
                      formatter={(value) => `${Number(value).toLocaleString("vi-VN")} phiên`}
                    />
                  }
                  cursor={{ stroke: "var(--chart-1)", strokeWidth: 1, strokeDasharray: "5 5" }}
                />

                <Line
                  type="monotone"
                  dataKey="Count"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ fill: "var(--chart-1)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
