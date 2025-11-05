"use client";

import { useState, useEffect } from "react";
import { format, isAfter, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Granularity, InsightsFilters } from "../types/insights.types";
import { getStations } from "@/features/stations/services/stations-api";
import { toast } from "sonner";

interface Station {
  id: string;
  name: string;
}

interface InsightsFilterProps {
  onChange: (filters: InsightsFilters) => void;
  loading?: boolean;
}

export function InsightsFilter({ onChange, loading }: InsightsFilterProps) {
  const today = startOfDay(new Date());
  const [from, setFrom] = useState<Date | undefined>(today);
  const [to, setTo] = useState<Date | undefined>(today);
  const [stationId, setStationId] = useState<string>("all");
  const [granularity, setGranularity] = useState<Granularity>("day");
  const [stations, setStations] = useState<Station[]>([]);
  const [loadingStations, setLoadingStations] = useState(true);

  const resetToToday = () => {
    setFrom(today);
    setTo(today);
    toast.error(
      "Ngày kết thúc không được nhỏ hơn ngày bắt đầu. Đã đặt lại về hôm nay.",
    );
  };

  useEffect(() => {
    async function loadStations() {
      setLoadingStations(true);
      try {
        const data = await getStations();
        const mapped = data.map((s) => ({
          id: String(s.id),
          name: s.name,
        }));
        setStations(mapped);
      } catch (err) {
        console.error("Failed to load stations:", err);
      } finally {
        setLoadingStations(false);
      }
    }
    loadStations();
  }, []);

  useEffect(() => {
    if (from && to) {
      const fromDate = startOfDay(from);
      const toDate = startOfDay(to);

      if (isAfter(fromDate, toDate)) {
        resetToToday();
        return;
      }

      onChange({
        from: format(fromDate, "yyyy-MM-dd"),
        to: format(toDate, "yyyy-MM-dd"),
        stationId: stationId === "all" ? undefined : stationId,
        granularity,
      });
    }
  }, [from, to, stationId, granularity, onChange]);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="space-y-2">
        <Label>Từ ngày</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !from && "text-muted-foreground",
              )}
              disabled={loading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {from ? format(from, "dd/MM/yyyy") : "Chọn ngày"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={from}
              onSelect={(date) => {
                if (date) {
                  const selected = startOfDay(date);
                  if (to && isAfter(selected, startOfDay(to))) {
                    toast.error(
                      "Ngày bắt đầu không được lớn hơn ngày kết thúc.",
                    );
                    return;
                  }
                  setFrom(selected);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Đến ngày</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !to && "text-muted-foreground",
              )}
              disabled={loading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {to ? format(to, "dd/MM/yyyy") : "Chọn ngày"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={to}
              onSelect={(date) => {
                if (date) {
                  const selected = startOfDay(date);
                  if (from && isAfter(startOfDay(from), selected)) {
                    toast.error(
                      "Ngày kết thúc không được nhỏ hơn ngày bắt đầu.",
                    );
                    return;
                  }
                  setTo(selected);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Trạm sạc</Label>
        <Select
          value={stationId}
          onValueChange={setStationId}
          disabled={loadingStations || loading}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={loadingStations ? "Đang tải..." : "Tất cả trạm"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạm</SelectItem>
            {stations.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Độ chi tiết</Label>
        <Select
          value={granularity}
          onValueChange={(v) => setGranularity(v as Granularity)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Theo ngày</SelectItem>
            <SelectItem value="hour">Theo giờ</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
