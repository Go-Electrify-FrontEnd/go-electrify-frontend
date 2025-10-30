"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import VehicleModelDeleteDialog from "./vehicle-model-delete-dialog";
import { useVehicleModelUpdate } from "@/contexts/vehicle-model-action-context";
import { CarModel } from "@/types/car";

interface VehicleModelActionsCellProps {
  carModel: CarModel;
}

export function VehicleModelActionsCell({
  carModel,
}: VehicleModelActionsCellProps) {
  const { setVehicleModel, setEditDialogOpen } = useVehicleModelUpdate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setVehicleModel(carModel);
              setEditDialogOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(event) => event.preventDefault()}
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <VehicleModelDeleteDialog
        carModel={carModel}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
