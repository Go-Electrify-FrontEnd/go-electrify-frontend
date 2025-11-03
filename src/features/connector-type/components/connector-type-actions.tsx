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
import { DeleteConnectorType } from "./connector-type-delete-dialog";
import { useConnectorTypeUpdate } from "@/contexts/connector-type-update-context";
import { ConnectorType } from "@/features/connector-type/schemas/connector-type.schema";

interface ActionsCellProps {
  connectorType: ConnectorType;
}

export function ActionsCell({ connectorType }: ActionsCellProps) {
  const { setConnectorType, setEditDialogOpen } = useConnectorTypeUpdate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
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
              setConnectorType(connectorType);
              setEditDialogOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpenDeleteDialog(true);
            }}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConnectorType
        connectorType={connectorType}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
      />
    </>
  );
}
