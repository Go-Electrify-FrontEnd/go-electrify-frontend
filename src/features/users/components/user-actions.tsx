"use client";

import { useState } from "react";
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
import type { UserApi } from "@/lib/zod/user/user.types";

interface UserActionsProps {
  user: UserApi;
}

export function UserActionsCell({ user }: UserActionsProps) {
  const [copied, setCopied] = useState(false);

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
            navigator.clipboard.writeText(String(user.id));
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
        >
          <Copy className="h-4 w-4" />
          {copied ? "Đã sao chép" : "Sao chép ID"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            // placeholder for open user detail
            console.log("Open user detail", user.id);
          }}
        >
          <Eye className="h-4 w-4" />
          Xem chi tiết
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
