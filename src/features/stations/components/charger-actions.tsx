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
import { MoreHorizontal, Eye, Copy, KeyRound } from "lucide-react";
import { useChargerUpdate } from "@/features/stations/contexts/charger-update-context";
import { Charger } from "@/features/chargers/schemas/charger.schema";
import { useServerAction } from "@/hooks/use-server-action";
import { regenerateDockSecret } from "../services/chargers-actions";
import { toast } from "sonner";
import { SecretKeyDialog } from "./secret-key-dialog";

interface ActionsCellProps {
  charger: Charger;
}

const initialState = {
  success: false,
  msg: "",
  data: undefined as { secretKey: string } | undefined,
};

export function ActionsCell({ charger }: ActionsCellProps) {
  const [copied, setCopied] = useState(false);
  const [secretKey, setSecretKey] = useState<string>("");
  const [showSecretDialog, setShowSecretDialog] = useState(false);
  const { setCharger, setEditDialogOpen } = useChargerUpdate();

  const { execute: executeRegenerate, pending: regenerating } = useServerAction(
    regenerateDockSecret,
    initialState,
    {
      onSettled: (result) => {
        if (result.success) {
          toast.success("Khóa bí mật đã được tạo lại", {
            description: result.msg,
          });

          // Show the secret key dialog if we have a secret key
          if (result.data?.secretKey) {
            setSecretKey(result.data.secretKey);
            setShowSecretDialog(true);
          }
        } else if (result.msg) {
          toast.error("Tạo lại khóa bí mật thất bại", {
            description: result.msg,
          });
        }
      },
    },
  );

  const handleRegenerateSecret = () => {
    const formData = new FormData();
    formData.append("chargerId", String(charger.id));
    executeRegenerate(formData);
  };

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
        <DropdownMenuItem
          onClick={handleRegenerateSecret}
          disabled={regenerating}
        >
          <KeyRound className="h-4 w-4" />
          {regenerating ? "Đang tạo..." : "Tạo lại khóa bí mật"}
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

      <SecretKeyDialog
        open={showSecretDialog}
        onOpenChange={setShowSecretDialog}
        secretKey={secretKey}
      />
    </DropdownMenu>
  );
}
