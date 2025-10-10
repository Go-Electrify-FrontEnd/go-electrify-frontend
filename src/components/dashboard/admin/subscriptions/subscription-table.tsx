"use client";

import * as React from "react";
import { toast } from "sonner";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import { columns } from "./subscription-table-columns";
import { Subscription } from "@/types/subscription";

interface SubscriptionsTableProps {
  data: Subscription[];
}

export function SubscriptionsTable({ data }: SubscriptionsTableProps) {
  const handleMassDelete = React.useCallback(
    async (selected: Subscription[]) => {
      // TODO: Replace with real API integration
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Đã xóa gói đăng ký (mô phỏng)", {
        description: `${selected.length} gói đã được đánh dấu để xóa.`,
      });
    },
    [],
  );

  return (
    <SharedDataTable
      columns={columns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Tìm kiếm theo tên gói..."
      emptyMessage="Không có gói nạp nào."
      onMassDelete={handleMassDelete}
    />
  );
}
