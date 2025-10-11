"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CarModel } from "@/types/car";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface VehicleModelDeleteProps {
  carModel: CarModel;
}

export default function VehicleModelDeleteDialog({
  carModel: { id, modelName },
}: VehicleModelDeleteProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    console.log("Deleting car model:", { id, modelName });
    setIsOpen(false);
    setConfirmationText("");
  };

  const handleCancel = () => {
    setIsOpen(false);
    setConfirmationText("");
  };

  const isConfirmationValid = confirmationText === modelName;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Việc này sẽ xóa vĩnh viễn mẫu xe
            <span className="font-semibold"> &ldquo;{modelName}&rdquo;</span> và
            loại bỏ tất cả dữ liệu liên quan khỏi máy chủ của chúng tôi.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="confirmation-text" className="text-sm font-medium">
              Vui lòng nhập <strong>{modelName}</strong> để xác nhận hành động
              xóa.
            </Label>
            <Input
              id="confirmation-text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Gõ "${modelName}" để xác nhận`}
              className="w-full"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isConfirmationValid}
          >
            Xóa mẫu xe
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
