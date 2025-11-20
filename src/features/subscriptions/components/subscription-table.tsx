"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./subscription-table-columns";
import type { Subscription } from "../schemas/subscription.types";

interface SubscriptionsTableProps {
  data: Subscription[];
}

export function SubscriptionsTable({ data }: SubscriptionsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Tìm kiếm theo tên gói..."
      emptyMessage="Không tìm thấy dữ liệu"
      emptyDescription="Không có gói nạp nào."
    />
  );
}
