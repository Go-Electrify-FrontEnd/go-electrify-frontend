import SectionHeader from "@/components/section-header";
import SectionContent from "@/components/section-content";
import { BookingFeeManager } from "@/features/booking-fee/components/booking-fee-manager";
import { getBookingFee } from "@/features/booking-fee/services/booking-fee-api";

export default async function BookingFeePage() {
  const bookingFee = await getBookingFee();

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionHeader
        title="Quản lý Phí Đặt Chỗ"
        subtitle="Cấu hình và quản lý phí đặt chỗ cho toàn hệ thống"
      />

      <SectionContent>
        {bookingFee ? (
          <BookingFeeManager bookingFee={bookingFee} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">
              Không thể tải thông tin phí đặt chỗ
            </p>
          </div>
        )}
      </SectionContent>
    </div>
  );
}
