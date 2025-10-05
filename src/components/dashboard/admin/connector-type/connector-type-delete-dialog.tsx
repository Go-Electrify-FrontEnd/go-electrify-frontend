"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ConnectorType } from "./connector-type-table-columns";
import { toast } from "sonner";

interface DeleteConnectorTypeProps {
  connectorType: ConnectorType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteConnectorType = ({
  connectorType,
  open,
  onOpenChange,
}: DeleteConnectorTypeProps) => {
  const handleDelete = () => {
    // Here you would typically make an API call to delete the connector type
    console.log("Deleting connector type:", connectorType.id);

    toast.success("Xóa cổng kết nối thành công!");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa cổng kết nối</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa cổng kết nối{" "}
            <span className="font-semibold">{connectorType.name}</span>? Hành
            động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
