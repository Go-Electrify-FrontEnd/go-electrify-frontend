import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Loader2Icon
        aria-label="Loading"
        role="status"
        className="text-primary h-16 w-16 animate-spin"
        strokeWidth={2.5}
      />
      <span className="sr-only">Đang tải dữ liệu</span>
    </div>
  );
}
