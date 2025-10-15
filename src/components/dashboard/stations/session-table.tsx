"use client";

import * as React from "react";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import { sessionColumns, Session } from "./session-table-columns";

interface SessionsTableProps {
  data: Session[];
}

export function SessionsTable({ data }: SessionsTableProps) {
  const handleMassDelete = React.useCallback(async (selected: Session[]) => {
    // Placeholder: log selection. Integrate with API to end sessions or cancel bookings.
    selected.forEach((s) => {
      console.log("Mass action on session:", s.id, s.kind);
    });
  }, []);

  return (
    <SharedDataTable
      columns={sessionColumns}
      data={data}
      searchColumn="userName"
      searchPlaceholder="Tìm kiếm phiên..."
      emptyMessage="Không có phiên nào."
      onMassDelete={handleMassDelete}
    />
  );
}
