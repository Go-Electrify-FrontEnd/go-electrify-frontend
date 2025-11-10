"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { useServerAction } from "@/hooks/use-server-action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { deleteDocument } from "../services/documents-actions";
import {
  deleteDocumentSchema,
  type DeleteDocumentFormData,
} from "../schemas/document.request";
import type { Document } from "../schemas/document.types";

interface DocumentDeleteDialogProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentDeleteDialog({
  document,
  open,
  onOpenChange,
}: DocumentDeleteDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const { execute } = useServerAction(
    deleteDocument,
    { success: false, msg: "" },
    {
      onSettled: (result) => {
        setSubmitting(false);
        if (result.success) {
          toast.success(result.msg);
          onOpenChange(false);
          form.reset();
        } else if (result.msg) {
          toast.error(result.msg);
        }
      },
    },
  );

  const form = useForm<DeleteDocumentFormData>({
    resolver: zodResolver(deleteDocumentSchema),
    defaultValues: {
      id: document.id,
      confirmText: "",
    },
  });

  const confirmText = form.watch("confirmText");
  const isInputValid = confirmText === document.name;

  const handleSubmit = form.handleSubmit((data) => {
    // Double-check confirmation text
    if (data.confirmText !== document.name) {
      form.setError("confirmText", {
        type: "manual",
        message: "Tên không khớp. Vui lòng nhập đúng tên.",
      });
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("confirmText", data.confirmText);
    execute(formData);
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác Nhận Xóa</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa <strong>{document.name}</strong>? Hành
            động này sẽ xóa vĩnh viễn{" "}
            <strong>{document.chunkCount} phần</strong> khỏi cơ sở dữ liệu
            vector. Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <Controller
              control={form.control}
              name="confirmText"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="confirmText">
                    Xác nhận bằng cách nhập: <strong>{document.name}</strong>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="confirmText"
                    placeholder="Nhập tên tài liệu để xác nhận"
                    disabled={submitting}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <AlertDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={submitting || !isInputValid}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? "Đang xóa..." : "Xóa"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
