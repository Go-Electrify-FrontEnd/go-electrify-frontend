"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { useServerAction } from "@/hooks/use-server-action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateDocument } from "../services/documents-actions";
import { updateDocumentSchema } from "../schemas/document.request";
import type { Document } from "../schemas/document.types";
import { useEffect } from "react";

interface DocumentEditDialogProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentEditDialog({
  document,
  open,
  onOpenChange,
}: DocumentEditDialogProps) {
  const { execute, pending } = useServerAction(
    updateDocument,
    { success: false, msg: "" },
    {
      onSettled: (result) => {
        if (result.success) {
          toast.success(result.msg);
          onOpenChange(false);
        } else if (result.msg) {
          toast.error(result.msg);
        }
      },
    },
  );

  const form = useForm({
    resolver: zodResolver(updateDocumentSchema),
    defaultValues: {
      id: document.id,
      name: document.name,
      type: document.type,
      description: document.description || "",
      reindex: false,
    },
  });

  // Reset form when document changes
  useEffect(() => {
    form.reset({
      id: document.id,
      name: document.name,
      type: document.type,
      description: document.description || "",
      reindex: false,
    });
  }, [document, form]);

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("name", data.name);
    formData.append("type", data.type);
    if (data.description) {
      formData.append("description", data.description);
    }
    formData.append("reindex", data.reindex ? "true" : "false");

    execute(formData);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Tài Liệu</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Name */}
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="name">Tên Tài Liệu *</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    placeholder="vd: Hướng Dẫn Sạc Xe Điện"
                    disabled={pending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {/* Document Type */}
          <FieldGroup>
            <Controller
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="type">Loại Tài Liệu *</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={pending}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FAQ">Câu Hỏi Thường Gặp</SelectItem>
                      <SelectItem value="Guide">Hướng Dẫn</SelectItem>
                      <SelectItem value="Policy">Chính Sách</SelectItem>
                      <SelectItem value="Troubleshooting">
                        Xử Lý Sự Cố
                      </SelectItem>
                      <SelectItem value="Other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {/* Description */}
          <FieldGroup>
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="description">
                    Mô Tả (Tùy Chọn)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="description"
                    placeholder="Mô tả ngắn gọn về tài liệu"
                    disabled={pending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={pending}>
                Hủy
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {pending ? "Đang lưu..." : "Lưu Thay Đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
