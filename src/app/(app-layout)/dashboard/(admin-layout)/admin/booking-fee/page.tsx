import { getUser } from "@/lib/auth/auth-server";
import SectionHeader from "@/components/shared/section-header";
import SectionContent from "@/components/shared/section-content";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookingFeeResponseSchema } from "@/lib/zod/booking-fee/booking-fee.schema";
import type { BookingFee } from "@/lib/zod/booking-fee/booking-fee.types";
import { BookingFeeManager } from "@/features/booking-fee/components/booking-fee-manager";
import { AlertCircle, DollarSign, Percent } from "lucide-react";

async function getBookingFee(): Promise<BookingFee | null> {
  try {
    const { token } = await getUser();
    const url = "https://api.go-electrify.com/api/v1/admin/booking-fee";
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60, tags: ["booking-fee"] },
    });

    if (!response.ok) {
      console.error("Failed to fetch booking fee:", response.statusText);
      return null;
    }

    const data = await response.json();
    const parsed = BookingFeeResponseSchema.safeParse(data);

    if (!parsed.success) {
      console.error("Invalid booking fee data:", parsed.error);
      return null;
    }

    return parsed.data.data;
  } catch (error) {
    console.error("Error fetching booking fee:", error);
    return null;
  }
}

export default async function BookingFeePage() {
  const bookingFee = await getBookingFee();

  if (!bookingFee) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <SectionHeader
          title="Quản lý Phí Đặt Chỗ"
          subtitle="Cấu hình phí đặt chỗ cho hệ thống"
        />
        <SectionContent>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Không thể tải thông tin phí đặt chỗ. Vui lòng thử lại sau.
              </p>
            </CardContent>
          </Card>
        </SectionContent>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionHeader
        title="Quản lý Phí Đặt Chỗ"
        subtitle="Cấu hình và quản lý phí đặt chỗ cho toàn hệ thống"
      />

      <SectionContent>
        {/* Combined Fee Manager Component */}
        {/* Help and Guidelines */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Hướng Dẫn Sử Dụng</CardTitle>
            <CardDescription>
              Tìm hiểu về các loại phí đặt chỗ và cách áp dụng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-100 text-green-700">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <h3 className="font-semibold">Phí Cố Định (FLAT)</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Một khoản phí cố định sẽ được tính cho mỗi đặt chỗ, bất kể
                    giá trị đặt chỗ là bao nhiêu.
                  </p>
                  <div className="bg-muted/50 rounded-md p-3">
                    <p className="text-xs font-medium">Ví dụ:</p>
                    <p className="text-muted-foreground text-xs">
                      Phí cố định 10,000 VND → mỗi đặt chỗ trả thêm 10,000 VND
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                      <Percent className="h-4 w-4" />
                    </div>
                    <h3 className="font-semibold">Phí Phần Trăm (PERCENT)</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Phí sẽ được tính dựa trên phần trăm của tổng giá trị đặt
                    chỗ.
                  </p>
                  <div className="bg-muted/50 rounded-md p-3">
                    <p className="text-xs font-medium">Ví dụ:</p>
                    <p className="text-muted-foreground text-xs">
                      Phí 5% + Đặt chỗ 100,000 VND → Phí là 5,000 VND
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-sm">
                <span className="font-medium">Lưu ý quan trọng:</span> Thay đổi
                cấu hình phí sẽ có hiệu lực ngay lập tức và áp dụng cho tất cả
                các đặt chỗ mới trong hệ thống. Các đặt chỗ hiện tại sẽ không bị
                ảnh hưởng.
              </div>
            </div>
          </CardContent>
        </Card>
        <BookingFeeManager bookingFee={bookingFee} />
      </SectionContent>
    </div>
  );
}
