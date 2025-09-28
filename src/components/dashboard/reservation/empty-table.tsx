"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type EmptyTableProps = {
  title?: string;
  description?: string;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export function EmptyTable({
  title = "Không có đặt chỗ",
  description = "Bạn hiện chưa có đặt chỗ nào.",
  className,
  icon: Icon = Calendar,
}: EmptyTableProps) {
  return (
    <Card className={cn("w-full border-dashed text-center", className)}>
      <CardContent className="px-6 py-12">
        {/* Illustration */}
        <div className="bg-muted/50 ring-muted/30 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ring-8">
          <Icon className="text-muted-foreground/60 h-10 w-10" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-foreground text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground mx-auto max-w-md text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
