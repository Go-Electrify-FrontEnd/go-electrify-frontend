"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Mock data - in production, this would come from your API
const generateChartData = () => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      utilization: Math.floor(Math.random() * 40) + 40, // 40-80%
      sessions: Math.floor(Math.random() * 20) + 10, // 10-30 sessions
    });
  }
  return data;
};

const chartConfig = {
  utilization: {
    label: "Tỷ Lệ Sử Dụng (%)",
    color: "var(--primary)",
  },
  sessions: {
    label: "Phiên Sạc",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

interface StationUtilizationChartProps {
  stationName: string;
  currentUtilization: number;
  activeSessions: number;
}

export function StationUtilizationChart({
  stationName,
  currentUtilization,
  activeSessions,
}: StationUtilizationChartProps) {
  const [timeRange, setTimeRange] = React.useState("30d");
  const [metric, setMetric] = React.useState<"utilization" | "sessions">(
    "utilization",
  );

  const chartData = React.useMemo(() => {
    const data = generateChartData();
    const days = timeRange === "7d" ? 7 : timeRange === "14d" ? 14 : 30;
    return data.slice(-days);
  }, [timeRange]);

  const averageValue = React.useMemo(() => {
    const sum = chartData.reduce((acc, curr) => acc + curr[metric], 0);
    return Math.round(sum / chartData.length);
  }, [chartData, metric]);

  const trend = React.useMemo(() => {
    if (chartData.length < 2) return 0;
    const firstWeek = chartData.slice(0, 7);
    const lastWeek = chartData.slice(-7);
    const firstAvg =
      firstWeek.reduce((acc, curr) => acc + curr[metric], 0) / firstWeek.length;
    const lastAvg =
      lastWeek.reduce((acc, curr) => acc + curr[metric], 0) / lastWeek.length;
    return ((lastAvg - firstAvg) / firstAvg) * 100;
  }, [chartData, metric]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <CardTitle className="text-base sm:text-lg">
              Phân Tích Hoạt Động Trạm
            </CardTitle>
            <CardDescription className="mt-1 text-xs sm:mt-1.5 sm:text-sm">
              Theo dõi xu hướng sử dụng và phiên sạc của {stationName}
            </CardDescription>
          </div>
          <CardAction className="flex flex-col gap-2 sm:flex-row">
            <Select value={metric} onValueChange={(v) => setMetric(v as any)}>
              <SelectTrigger className="w-full sm:w-40" size="sm">
                <SelectValue placeholder="Chọn chỉ số" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="utilization">Tỷ lệ sử dụng</SelectItem>
                <SelectItem value="sessions">Phiên sạc</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-32" size="sm">
                <SelectValue placeholder="Chọn khoảng thời gian" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="7d">7 ngày</SelectItem>
                <SelectItem value="14d">14 ngày</SelectItem>
                <SelectItem value="30d">30 ngày</SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full sm:h-[250px]"
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 0,
              right: 10,
              top: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fillMetric" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--color-${metric})`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${metric})`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("vi-VN", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("vi-VN", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey={metric}
              type="natural"
              fill="url(#fillMetric)"
              stroke={`var(--color-${metric})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-normal">
                Hiện tại:{" "}
                {metric === "utilization"
                  ? `${currentUtilization}%`
                  : `${activeSessions}`}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-normal">
                Trung bình:{" "}
                {metric === "utilization" ? `${averageValue}%` : averageValue}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Xu hướng:</span>
            <Badge
              variant={trend >= 0 ? "default" : "destructive"}
              className="font-normal"
            >
              {trend >= 0 ? "+" : ""}
              {trend.toFixed(1)}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
