import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="flex h-[85vh] w-full items-center justify-center">
      <Loader2
        aria-label="Loading"
        role="status"
        className="text-primary h-16 w-16 animate-spin"
        strokeWidth={2.5}
      />
      <span className="sr-only">Đang tải dữ liệu</span>
    </div>
  );
}
