"use client";

import * as React from "react";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import { columns } from "./subscription-table-columns";
import type { Subscription } from "@/lib/zod/subscription/subscription.types";

interface SubscriptionsTableProps {
  data: Subscription[];
}

export function SubscriptionsTable({ data }: SubscriptionsTableProps) {
  return (
    <SharedDataTable
      columns={columns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Tìm kiếm theo tên gói..."
      emptyMessage="Không có gói nạp nào."
    />
  );
}
