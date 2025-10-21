"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type EmptyTableProps = {
  title?: string;
  description?: string;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: React.ReactNode;
};

export function EmptyTable({
  title = "Không có đặt chỗ",
  description = "Bạn hiện chưa có đặt chỗ nào.",
  className,
  icon: Icon = Calendar,
  children,
}: EmptyTableProps) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {children && <EmptyContent>{children}</EmptyContent>}
    </Empty>
  );
}
