"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Copy } from "lucide-react";
import type { Charger } from "@/lib/zod/charger/charger.types";
import { useChargerUpdate } from "@/contexts/charger-update-context";

interface ActionsCellProps {
  charger: Charger;
}

export function ActionsCell({ charger }: ActionsCellProps) {
  const [copied, setCopied] = useState(false);
  const { setCharger, setEditDialogOpen } = useChargerUpdate();

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
          onClick={() => {
            setCharger(charger);
            setEditDialogOpen(true);
          }}
        >
          {/* Edit icon omitted to keep icons consistent */}
          Cập nhật
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(String(charger.id));
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          <Copy className="h-4 w-4" />
          {copied ? "Đã sao chép" : "Sao chép ID"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            // placeholder: open detail view (not implemented)
            // view charger action
          }}
        >
          <Eye className="h-4 w-4" />
          Xem chi tiết
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
