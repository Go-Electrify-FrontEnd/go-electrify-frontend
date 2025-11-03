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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@/features/users/contexts/user-context";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { API_BASE_URL } from "@/lib/api-config";

interface ReportedIncident {
  Id: number;
  ReporterName: string;
  StationId: number;
  StationName: string;
  ChargerId: number;
  ReporterUserId: number;
  Title: string;
  Severity: string;
  Status: string;
  ReportedAt: string;
  ResolvedAt: string | null;
  Description?: string;
  Note?: string;
}

interface IncidentDetailsModalProps {
  incident: ReportedIncident | null;
  onOpenChange: () => void;
  onUpdateSuccess: (updatedIncident: ReportedIncident) => void;
}

// Danh sách trạng thái admin có thể chọn
const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

// Schema cho form cập nhật
const updateStatusSchema = z.object({
  Status: z.enum(STATUS_OPTIONS, {
    message: "Vui lòng chọn trạng thái.",
  }),
  Note: z.string().optional(),
});

type UpdateStatusFormValues = z.infer<typeof updateStatusSchema>;

export function IncidentDetailsModal({
  incident,
  onOpenChange,
  onUpdateSuccess,
}: IncidentDetailsModalProps) {
  const { token } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateStatusFormValues>({
    resolver: zodResolver(updateStatusSchema),
  });

  // Reset form mỗi khi mở một incident mới
  useEffect(() => {
    if (incident) {
      form.reset({
        Status: incident.Status as any, // Đặt giá trị hiện tại
        Note: incident.Note || "", // Đặt note hiện tại nếu có
      });
    }
  }, [incident, form]);

  if (!incident) return null;

  const onSubmit = async (data: UpdateStatusFormValues) => {
    if (!token) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/incidents/${incident.Id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedIncident = await response.json();
      onUpdateSuccess(updatedIncident);
    } catch (error) {
      console.error("Error updating incident status:", error);
      // TODO: Thêm toast báo lỗi cho admin
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={!!incident} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chi tiết Sự cố #{incident.Id}</DialogTitle>
          <DialogDescription>{incident.Title}</DialogDescription>
        </DialogHeader>

        {/* Phần hiển thị thông tin */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-4">
          <div>
            <span className="text-muted-foreground text-xs">Trạm sạc</span>
            <p className="font-medium">{incident.StationName}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Cổng sạc</span>
            <p className="font-medium">Cổng #{incident.ChargerId}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Người báo cáo</span>
            <p className="font-medium">{incident.ReporterName}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Mức độ</span>
            <p>
              <Badge
                variant={
                  incident.Severity === "HIGH"
                    ? "destructive"
                    : incident.Severity === "MEDIUM"
                      ? "default"
                      : "secondary"
                }
              >
                {incident.Severity}
              </Badge>
            </p>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground text-xs">
              Mô tả (nếu có)
            </span>
            <p className="font-medium">
              {incident.Description || "(Không có mô tả)"}
            </p>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground text-xs">Ngày báo cáo</span>
            <p className="font-medium">
              {format(new Date(incident.ReportedAt), "dd/MM/yyyy HH:mm", {
                locale: vi,
              })}
            </p>
          </div>
        </div>

        {/* Form cập nhật trạng thái */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="Status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cập nhật trạng thái</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái mới" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OPEN">Đang mở (OPEN)</SelectItem>
                      <SelectItem value="IN_PROGRESS">
                        Đang xử lý (IN_PROGRESS)
                      </SelectItem>
                      <SelectItem value="RESOLVED">
                        Đã giải quyết (RESOLVED)
                      </SelectItem>
                      <SelectItem value="CLOSED">Đã đóng (CLOSED)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Thêm ghi chú xử lý..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onOpenChange}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
