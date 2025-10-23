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
import { BookingFeeResponseSchema } from "@/lib/zod/booking-fee/booking-fee.schema";
import type { BookingFee } from "@/lib/zod/booking-fee/booking-fee.types";
import { BookingFeeDisplay } from "@/features/booking-fee/components/booking-fee-display";
import { BookingFeeForm } from "@/features/booking-fee/components/booking-fee-form";

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
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Current Fee Display */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Cấu Hình Hiện Tại</h2>
            <BookingFeeDisplay bookingFee={bookingFee} />
          </div>

          {/* Update Form */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Cập Nhật Phí</h2>
            <Card>
              <CardHeader>
                <CardTitle>Chỉnh sửa phí đặt chỗ</CardTitle>
                <CardDescription>
                  Thay đổi loại phí và giá trị áp dụng cho tất cả đặt chỗ mới
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BookingFeeForm bookingFee={bookingFee} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Hướng Dẫn Sử Dụng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">Phí Cố Định (FLAT)</h3>
              <p className="text-muted-foreground text-sm">
                Một khoản phí cố định sẽ được tính cho mỗi đặt chỗ, bất kể giá
                trị đặt chỗ là bao nhiêu. Ví dụ: nếu phí cố định là 10,000 VND,
                mỗi đặt chỗ sẽ phải trả thêm 10,000 VND.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Phí Phần Trăm (PERCENT)</h3>
              <p className="text-muted-foreground text-sm">
                Phí sẽ được tính dựa trên phần trăm của tổng giá trị đặt chỗ.
                Ví dụ: nếu phí là 5% và giá trị đặt chỗ là 100,000 VND, phí sẽ
                là 5,000 VND.
              </p>
            </div>
            <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4">
              <p className="text-sm font-medium text-yellow-800">
                ⚠️ Lưu ý: Thay đổi cấu hình phí sẽ có hiệu lực ngay lập tức và
                áp dụng cho tất cả các đặt chỗ mới trong hệ thống.
              </p>
            </div>
          </CardContent>
        </Card>
      </SectionContent>
    </div>
  );
}
