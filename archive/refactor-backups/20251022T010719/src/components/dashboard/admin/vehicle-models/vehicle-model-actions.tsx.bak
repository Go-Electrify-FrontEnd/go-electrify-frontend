"use client";

import React from "react";
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
import type { CarModel } from "@/lib/zod/vehicle-model/vehicle-model.types";
import VehicleModelDeleteDialog from "./vehicle-model-delete-dialog";
import { useVehicleModelUpdate } from "@/contexts/vehicle-model-action-context";

interface VehicleModelActionsCellProps {
  carModel: CarModel;
}

export function VehicleModelActionsCell({
  carModel,
}: VehicleModelActionsCellProps) {
  const { setVehicleModel, setEditDialogOpen } = useVehicleModelUpdate();

  return (
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

        <VehicleModelDeleteDialog
          carModel={carModel}
          trigger={
            <DropdownMenuItem
              onSelect={(event) => event.preventDefault()}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
