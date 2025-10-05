"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConnectorType } from "./connector-type-table-columns";
import { toast } from "sonner";

interface UpdateConnectorTypeProps {
  connectorType: ConnectorType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpdateConnectorType = ({
  connectorType,
  open,
  onOpenChange,
}: UpdateConnectorTypeProps) => {
  const [name, setName] = useState(connectorType.name);
  const [description, setDescription] = useState(connectorType.description);
  const [maxPowerKw, setMaxPowerKw] = useState(
    connectorType.maxPowerKw.toString(),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!name || !description || !maxPowerKw) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const powerValue = parseFloat(maxPowerKw);
    if (isNaN(powerValue) || powerValue <= 0) {
      toast.error("Công suất phải là số dương");
      return;
    }

    // Here you would typically make an API call to update the connector type
    console.log("Updating connector type:", {
      id: connectorType.id,
      name,
      description,
      maxPowerKw: powerValue,
    });

    toast.success("Cập nhật cổng kết nối thành công!");
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form to original values
    setName(connectorType.name);
    setDescription(connectorType.description);
    setMaxPowerKw(connectorType.maxPowerKw.toString());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa cổng kết nối</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cổng kết nối. Nhấn lưu để thay đổi.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên cổng kết nối</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên cổng kết nối"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả cổng kết nối"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPowerKw">Công suất tối đa (kW)</Label>
            <Input
              id="maxPowerKw"
              type="number"
              value={maxPowerKw}
              onChange={(e) => setMaxPowerKw(e.target.value)}
              placeholder="Nhập công suất tối đa"
              min="0"
              step="0.1"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button type="submit">Lưu thay đổi</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
