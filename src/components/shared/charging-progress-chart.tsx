"use client";

import { useMemo } from "react";
import { TrendingUp, Battery, Zap } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

const chartConfig = {
  currentSOC: {
    label: "SOC (%)",
    color: "hsl(var(--chart-1))",
  },
  energyKwh: {
    label: "Năng lượng (kWh)",
    color: "hsl(var(--chart-2))",
  },
  powerKw: {
    label: "Công suất (kW)",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export interface ChargingDataPoint {
  currentSOC: number;
  powerKw: number | null;
  energyKwh: number;
  at: string;
}

interface ChargingProgressChartProps {
  data: ChargingDataPoint[];
  targetSOC?: number;
}

export function ChargingProgressChart({
  data,
  targetSOC = 100,
}: ChargingProgressChartProps) {
  const latestData = data[data.length - 1];
  
  // Memoize chart data transformation to avoid recalculating on every render
  const chartData = useMemo(
    () =>
      data.map((point) => ({
        time: new Date(point.at).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        soc: Number(point.currentSOC.toFixed(1)),
        energy: Number(point.energyKwh.toFixed(2)),
        power: point.powerKw ? Number(point.powerKw.toFixed(2)) : null,
        timestamp: point.at,
      })),
    [data],
  );

  const progress = latestData
    ? ((latestData.currentSOC / targetSOC) * 100).toFixed(1)
    : "0";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Battery className="h-5 w-5 text-green-600" />
          Tiến độ sạc
        </CardTitle>
        <CardDescription>
          Theo dõi mức pin và năng lượng thời gian thực
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Stats */}
        {latestData && (
          <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">SOC hiện tại</p>
              <p className="text-2xl font-bold text-green-600">
                {latestData.currentSOC.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">
                Mục tiêu: {targetSOC}%
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Năng lượng</p>
              <p className="text-2xl font-bold">
                {latestData.energyKwh.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">kWh</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Công suất</p>
              <p className="text-2xl font-bold">
                {latestData.powerKw?.toFixed(2) ?? "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">kW</p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {latestData && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tiến độ</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-green-600 transition-all duration-500"
                style={{ width: `${Math.min(Number(progress), 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value, payload) => {
                    if (payload && payload[0]) {
                      return new Date(
                        payload[0].payload.timestamp
                      ).toLocaleString("vi-VN");
                    }
                    return value;
                  }}
                />
              }
            />
            <Area
              dataKey="soc"
              type="monotone"
              fill="var(--color-currentSOC)"
              fillOpacity={0.4}
              stroke="var(--color-currentSOC)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>

        {/* Footer info */}
        {latestData && data.length > 1 && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">
              Đang sạc
            </span>
            <span className="text-muted-foreground">
              · {data.length} điểm dữ liệu
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
