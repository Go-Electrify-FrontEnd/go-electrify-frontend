"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Loader2, Plus, X } from "lucide-react";
import { uploadDocument } from "../services/documents-actions";
import {
  uploadDocumentSchema,
  validateFile,
  generateDocumentName,
  type UploadDocumentFormData,
} from "../schemas/document.request";

export function DocumentUploadDialog() {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { execute, pending } = useServerAction(
    uploadDocument,
    { success: false, msg: "" },
    {
      onSettled: (result) => {
        if (result.success) {
          toast.success(result.msg);
          setOpen(false);
          setSelectedFile(null);
          form.reset();
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else if (result.msg) {
          toast.error(result.msg);
        }
      },
    },
  );

  const form = useForm({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      name: "",
      type: "Guide" as const,
      description: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error!);
      e.target.value = "";
      return;
    }

    setSelectedFile(file);

    // Auto-fill name from filename if name is empty
    const currentName = form.getValues("name");
    if (!currentName) {
      const generatedName = generateDocumentName(file.name);
      form.setValue("name", generatedName);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn một tệp để tải lên");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("type", data.type);
    if (data.description) {
      formData.append("description", data.description);
    }
    formData.append("file", selectedFile);

    execute(formData);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tải Lên Tài Liệu
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Tải Lên Tài Liệu Mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="file">Tệp *</FieldLabel>
              <div className="space-y-2">
                {!selectedFile ? (
                  <Input
                    ref={fileInputRef}
                    type="file"
                    id="file"
                    accept=".txt"
                    onChange={handleFileChange}
                    disabled={pending}
                  />
                ) : (
                  <div className="border-input bg-muted flex items-center gap-2 rounded-md border p-3">
                    <div className="flex-1 truncate text-sm">
                      <div className="font-medium">{selectedFile.name}</div>
                      <div className="text-muted-foreground">
                        {(() => {
                          const sizeInBytes = selectedFile.size;
                          if (sizeInBytes === 0) return "0 KB";
                          const sizeInKB = sizeInBytes / 1024;
                          const sizeInMB = sizeInKB / 1024;

                          if (sizeInMB >= 1) {
                            return `${sizeInMB.toFixed(2)} MB`;
                          } else {
                            return `${sizeInKB.toFixed(2)} KB`;
                          }
                        })()}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      disabled={pending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <p className="text-muted-foreground text-xs">
                  Hỗ trợ: TXT (Tối đa 10MB)
                </p>
              </div>
            </Field>
          </FieldGroup>

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
            <Button type="submit" disabled={pending || !selectedFile}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {pending ? "Đang tải lên..." : "Tải Lên"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
