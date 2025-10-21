"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface StatCardProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  value: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export default function StatCard({
  title,
  icon,
  value,
  children,
  className,
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {children ? (
          <div className="text-muted-foreground text-xs">{children}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}
