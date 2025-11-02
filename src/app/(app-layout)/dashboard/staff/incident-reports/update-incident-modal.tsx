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
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@/features/users/contexts/user-context";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

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

interface UpdateIncidentModalProps {
  incident: Incident | null;
  onOpenChange: () => void;
  onUpdateSuccess: (updatedIncident: Incident) => void;
}

// Các trạng thái staff có thể chọn
const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

// Schema cho form
const updateSchema = z.object({
  Status: z.enum(STATUS_OPTIONS, {
    message: "Vui lòng chọn trạng thái.",
  }),
});

type UpdateFormValues = z.infer<typeof updateSchema>;

export function UpdateIncidentModal({
  incident,
  onOpenChange,
  onUpdateSuccess,
}: UpdateIncidentModalProps) {
  const { token } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
  });

  // Reset form mỗi khi mở một incident mới
  useEffect(() => {
    if (incident) {
      form.reset({
        Status: incident.Status as any, // Đặt giá trị hiện tại
      });
    }
  }, [incident, form]);

  if (!incident) return null;

  const onSubmit = async (data: UpdateFormValues) => {
    if (!token) return;
    setIsSubmitting(true);

    // Xây dựng payload dựa trên API mới
    const payload = {
      Status: data.Status,
      ResolvedAt:
        data.Status === "RESOLVED" || data.Status === "CLOSED"
          ? new Date().toISOString()
          : null,
    };

    try {
      const response = await fetch(
        `https://api.go-electrify.com/api/v1/stations/${incident.StationId}/incidents/${incident.Id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedIncident = await response.json();
      onUpdateSuccess(updatedIncident);
    } catch (error) {
      console.error("Error updating incident status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={!!incident} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cập nhật Sự cố #{incident.Id}</DialogTitle>
          <DialogDescription>{incident.Title}</DialogDescription>
        </DialogHeader>

        {/* Thông tin chi tiết */}
        <div className="space-y-2 py-4">
          <div>
            <span className="text-muted-foreground text-xs">Mô tả</span>
            <p className="font-medium">
              {incident.Description || "(Không có mô tả)"}
            </p>
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
          <div>
            <span className="text-muted-foreground text-xs">Ngày báo cáo</span>
            <p className="font-medium">
              {format(new Date(incident.ReportedAt), "dd/MM/yyyy HH:mm", {
                locale: vi,
              })}
            </p>
          </div>
        </div>

        {/* Form cập nhật */}
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
