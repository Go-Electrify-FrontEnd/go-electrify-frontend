// components/dashboard/header/notification-popover-wrapper.tsx
"use client";

import { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function NotificationPopoverWrapper({
  trigger,
  content,
  isOpen,
  onOpenChange,
}: {
  trigger: ReactNode;
  content: ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {content}
      </PopoverContent>
    </Popover>
  );
}
