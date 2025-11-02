"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@/features/users/contexts/user-context";
import { Loader2 } from "lucide-react";

interface Incident {
  Id: number;
  StationId: number;
  ChargerId: number;
  Title: string;
  Description: string;
  Severity: "HIGH" | "MEDIUM" | "LOW";
  Status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  ReportedAt: string;
}

interface Station {
  Id: number;
  Name: string;
  Address: string;
}

interface Charger {
  Id: number;
  StationId: number;
  Code: string;
  Status: string;
}

interface ReportIncidentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  stations: Station[];
  onReportSuccess: (newIncident: Incident) => void;
}

export const SEVERITY_LEVELS = ["HIGH", "MEDIUM", "LOW"] as const;

// Schema validation
const reportSchema = z.object({
  stationId: z.string().min(1, "Vui lòng chọn trạm."),
  chargerId: z.string().min(1, "Vui lòng chọn bộ sạc."),
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự."),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự."),
  severity: z.enum(SEVERITY_LEVELS, {
    message: "Vui lòng chọn mức độ nghiêm trọng.",
  }),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export function ReportIncidentModal({
  isOpen,
  onOpenChange,
  stations,
  onReportSuccess,
}: ReportIncidentModalProps) {
  const { token } = useUser();
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [isChargerLoading, setIsChargerLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      stationId: "",
      chargerId: "",
      title: "",
      description: "",
      severity: undefined,
    },
  });

  const selectedStationId = form.watch("stationId");

  // Tự động fetch chargers khi stationId thay đổi
  useEffect(() => {
    if (!selectedStationId || !token) {
      setChargers([]);
      return;
    }

    async function fetchChargers() {
      setIsChargerLoading(true);
      form.resetField("chargerId"); // Xóa bộ sạc đã chọn
      try {
        const res = await fetch(
          `https://api.go-electrify.com/api/v1/stations/${selectedStationId}/chargers`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          },
        );
        if (res.ok) {
          const data = await res.json();
          // API của bạn có thể bọc trong { "data": [...] }
          setChargers(data.data || data);
        } else {
          setChargers([]);
        }
      } catch (error) {
        console.error("Failed to fetch chargers:", error);
        setChargers([]);
      } finally {
        setIsChargerLoading(false);
      }
    }

    fetchChargers();
  }, [selectedStationId, token, form]);

  // Xử lý submit form
  const onSubmit = async (data: ReportFormValues) => {
    if (!token) return;
    setIsSubmitting(true);

    const payload = {
      title: data.title,
      description: data.description,
      severity: data.severity,
      chargerId: parseInt(data.chargerId, 10),
    };

    try {
      const res = await fetch(
        `https://api.go-electrify.com/api/v1/stations/${data.stationId}/incidents`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (res.status === 201) {
        // 201 Created
        const newIncident = await res.json();
        onReportSuccess(newIncident);
        form.reset();
      } else {
        // TODO: Hiển thị toast lỗi
        console.error("Failed to report incident", await res.text());
      }
    } catch (error) {
      console.error("Error reporting incident:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Báo cáo sự cố mới</DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết về sự cố bạn gặp phải.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="stationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạm (*)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạm xảy ra sự cố" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem key={station.Id} value={String(station.Id)}>
                          {station.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chargerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bộ sạc (*)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isChargerLoading || chargers.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isChargerLoading
                              ? "Đang tải bộ sạc..."
                              : "Chọn bộ sạc"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {chargers.map((charger) => (
                        <SelectItem key={charger.Id} value={String(charger.Id)}>
                          {charger.Code} (Trạng thái: {charger.Status})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề (*)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Vd: Bộ sạc không nhận diện"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả chi tiết (*)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Vd: Đã thử 3 lần nhưng bộ sạc báo lỗi..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mức độ nghiêm trọng (*)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mức độ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="HIGH">Nghiêm trọng (HIGH)</SelectItem>
                      <SelectItem value="MEDIUM">
                        Trung bình (MEDIUM)
                      </SelectItem>
                      <SelectItem value="LOW">Thấp (LOW)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Gửi báo cáo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
