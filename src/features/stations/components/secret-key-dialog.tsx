"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Field, FieldLabel } from "@/components/ui/field";
import { Eye, EyeOff, Copy, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface SecretKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  secretKey: string;
  chargerId: string;
}

export function SecretKeyDialog({
  open,
  onOpenChange,
  secretKey,
  chargerId,
}: SecretKeyDialogProps) {
  const [showSecret, setShowSecret] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(secretKey);
      toast.success("Đã sao chép khóa bí mật", {
        description: "Khóa bí mật đã được sao chép vào clipboard",
      });
    } catch {
      toast.error("Không thể sao chép", {
        description: "Vui lòng sao chép thủ công",
      });
    }
  };

  const handleClose = () => {
    setShowSecret(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Khóa Bí Mật Của Trụ Sạc
          </DialogTitle>
          <DialogDescription>
            Đây là khóa bí mật duy nhất cho trụ sạc này. Vui lòng sao chép và
            lưu trữ an toàn.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600" />
              <p className="text-sm text-yellow-600">
                <strong>Cảnh báo quan trọng:</strong> Khóa này chỉ hiển thị một
                lần duy nhất. Bạn sẽ không thể xem lại sau khi đóng hộp thoại
                này. Hãy đảm bảo sao chép và lưu trữ an toàn.
              </p>
            </div>
          </div>

          <Field>
            <FieldLabel>ID Trụ Sạc</FieldLabel>
            <InputGroup>
              <InputGroupInput
                type="text"
                value={chargerId}
                className="font-mono"
                readOnly
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel>Khóa Bí Mật</FieldLabel>
            <InputGroup>
              <InputGroupInput
                type={showSecret ? "text" : "password"}
                value={secretKey}
                className="font-mono"
                readOnly
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  onClick={() => setShowSecret(!showSecret)}
                  title={showSecret ? "Ẩn khóa" : "Hiện khóa"}
                  size="icon-xs"
                >
                  {showSecret ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </InputGroupButton>
                <InputGroupButton
                  onClick={handleCopy}
                  title="Sao chép khóa"
                  size="icon-xs"
                >
                  <Copy className="h-4 w-4" />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <p className="text-muted-foreground text-xs">
              Nhấn vào biểu tượng mắt để hiển thị hoặc ẩn khóa. Nhấn vào biểu
              tượng sao chép để copy.
            </p>
          </Field>
        </div>

        <DialogFooter>
          <Button onClick={handleClose} className="w-full sm:w-auto">
            Đã Sao Chép, Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
