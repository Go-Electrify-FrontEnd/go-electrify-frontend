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
        {/* Current Configuration and Update Form */}
        <BookingFeeManager bookingFee={bookingFee} />

        {/* Help and Guidelines */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle>Hướng Dẫn Sử Dụng</CardTitle>
                <CardDescription>
                  Tìm hiểu về các loại phí đặt chỗ và cách áp dụng
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Phí Cố Định (FLAT)
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Một khoản phí cố định sẽ được tính cho mỗi đặt chỗ
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted/30 ml-13 rounded-lg p-4">
                    <p className="mb-2 text-sm font-medium">Ví dụ:</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Phí cố định 10,000 VND → mỗi đặt chỗ trả thêm 10,000 VND
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      <Percent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Phí Phần Trăm (PERCENT)
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Phí sẽ được tính dựa trên phần trăm của tổng giá trị đặt
                        chỗ
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted/30 ml-13 rounded-lg p-4">
                    <p className="mb-2 text-sm font-medium">Ví dụ:</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Phí 5% + Đặt chỗ 100,000 VND → Phí là 5,000 VND
                    </p>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Lưu ý quan trọng:</strong> Thay đổi cấu hình phí sẽ có
                  hiệu lực ngay lập tức và áp dụng cho tất cả các đặt chỗ mới
                  trong hệ thống. Các đặt chỗ hiện tại sẽ không bị ảnh hưởng.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </SectionContent>
    </div>
  );
}
