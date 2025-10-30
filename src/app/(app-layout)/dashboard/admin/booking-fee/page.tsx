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
import { BookingFeeResponseSchema } from "@/features/booking-fee/schemas/booking-fee.schema";
import type { BookingFee } from "@/features/booking-fee/schemas/booking-fee.types";
import { BookingFeeManager } from "@/features/booking-fee/components/booking-fee-manager";
import { AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getBookingFee } from "@/features/booking-fee/services/booking-fee-api";

export default async function BookingFeePage() {
  const bookingFee = await getBookingFee();

  if (!bookingFee) {
    return (
      <div>
        <SectionHeader
          title="Quản lý Phí Đặt Chỗ"
          subtitle="Cấu hình phí đặt chỗ cho hệ thống"
        />
        <SectionContent>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full sm:h-20 sm:w-20">
                <AlertCircle className="text-muted-foreground h-8 w-8 sm:h-10 sm:w-10" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                Không thể tải dữ liệu
              </h3>
              <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                Không thể tải thông tin phí đặt chỗ. Vui lòng thử lại sau hoặc
                liên hệ quản trị viên.
              </p>
            </CardContent>
          </Card>
        </SectionContent>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Quản lý Phí Đặt Chỗ"
        subtitle="Cấu hình và quản lý phí đặt chỗ cho toàn hệ thống"
      />

      <SectionContent className="mt-8">
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
          <Card className="w-full lg:col-span-4">
            <CardHeader className="border-b">
              <CardTitle>Hướng Dẫn Sử Dụng</CardTitle>
              <CardDescription>
                Tìm hiểu về các loại phí đặt chỗ và cách áp dụng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Phí Cố Định (FLAT)
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Một khoản phí cố định sẽ được tính cho mỗi đặt chỗ
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <p className="mb-2 text-sm font-medium">Ví dụ:</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Phí cố định 10,000 VND → mỗi đặt chỗ trả thêm 10,000 VND
                    </p>
                  </div>

                  <Separator className="my-2" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Phí Phần Trăm (PERCENT)
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Phí sẽ được tính dựa trên phần trăm sạc điện của loại
                          xe
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium">Ví dụ:</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Phí 5% + Số Tiền sạc 10% pin của xe
                      </p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Lưu ý quan trọng:</strong> Thay đổi cấu hình phí sẽ
                    có hiệu lực ngay lập tức và áp dụng cho tất cả các đặt chỗ
                    mới trong hệ thống. Các đặt chỗ hiện tại sẽ không bị ảnh
                    hưởng.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          <BookingFeeManager
            className="w-full lg:col-span-8"
            bookingFee={bookingFee}
          />
        </div>
      </SectionContent>
    </div>
  );
}
