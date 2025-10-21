// components/dashboard/header/notification-popover-wrapper.tsx
"use client";

import { ReactNode, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function NotificationPopoverWrapper({
  trigger,
  content,
}: {
  trigger: ReactNode;
  content: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {content}
      </PopoverContent>
    </Popover>
  );
}
