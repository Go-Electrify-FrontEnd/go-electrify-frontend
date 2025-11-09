import { Badge } from "@/components/ui/badge";
import type { DocumentStatus } from "@/features/rag/types";

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
}

export function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  const config = {
    indexed: {
      label: "Đã Lập Chỉ Mục",
      className: "bg-emerald-500 text-white",
    },
    processing: {
      label: "Đang Xử Lý",
      className: "bg-yellow-500 text-white",
    },
    failed: {
      label: "Thất Bại",
      className: "bg-red-500 text-white",
    },
  };

  const { label, className } = config[status];

  return <Badge className={className}>{label}</Badge>;
}
