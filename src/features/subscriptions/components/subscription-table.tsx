"use client";

import { SharedDataTable } from "@/components/shared-data-table";
import { columns } from "./subscription-table-columns";
import type { Subscription } from "../schemas/subscription.types";

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
