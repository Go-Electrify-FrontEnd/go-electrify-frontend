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
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
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

      const timeLabel =
        granularity === "day"
          ? format(parsedDate, "dd/MM")
          : format(parsedDate, "HH:mm dd/MM");

      return {
        time: parsedDate.getTime(),
        label: timeLabel,
        Count: item.Count,
      };
    })
      .sort((a, b) => a.time - b.time)
    ?? [];

  // Tính toán width động dựa trên số lượng data để hỗ trợ cuộn ngang khi data nhiều
  const chartWidth = Math.max(800, formattedData.length * (granularity === "day" ? 60 : 80));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lượt Sạc</CardTitle>
            <CardDescription>
              Tổng {data?.TotalSessions ?? 0} phiên • Giờ cao điểm:{" "}
              {data?.PeakHour !== undefined ? `${data.PeakHour}h` : "-"}
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
          // Wrap chart trong div hỗ trợ cuộn ngang
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
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={true}
                  interval={Math.max(0, Math.floor(formattedData.length / 10) - 1)} 
                />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                           <ChartTooltip content={<ChartTooltipContent />} />

                <Line
                  type="monotone"
                  dataKey="Count"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
