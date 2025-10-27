import {
  GradientCard,
  GradientCardDetail,
  GradientCardSection,
} from "./gradient-card";

/**
 * EV Charging focused cards with minimal design and subtle accents
 */
export function CheaperPriceCard() {
  return (
    <GradientCard
      title="💰 Tiết Kiệm Chi Phí"
      subtitle="Giá cước rẻ hơn 30% so với các trạm khác"
      className="hover:border-foreground/20 h-[520px] max-w-sm transition-colors"
    >
      <GradientCardSection>
        <GradientCardDetail label="Giờ thấp điểm" value="Giảm 40%" />
        <GradientCardDetail label="Gói tháng VIP" value="Ưu đãi 20%" />
      </GradientCardSection>

      <GradientCardSection className="mt-6">
        <GradientCardDetail label="Thanh toán" value="Không dùng tiền mặt" />
        <GradientCardDetail label="Điểm thưởng" value="Tích lũy & đổi quà" />
      </GradientCardSection>

      <GradientCardSection className="mt-6">
        <GradientCardDetail label="So sánh giá" value="Minh bạch & rõ ràng" />
        <GradientCardDetail label="Không phí ẩn" value="100%" />
      </GradientCardSection>
    </GradientCard>
  );
}

export function ReservationSlotCard() {
  return (
    <GradientCard
      title="🎯 Đặt Chỗ Thông Minh"
      subtitle="Luôn có chỗ sạc khi bạn cần, không lo chờ đợi"
      className="hover:border-foreground/20 h-[520px] max-w-sm transition-colors"
    >
      <GradientCardSection>
        <GradientCardDetail label="Đặt trước" value="30 phút - 7 ngày" />
        <GradientCardDetail label="Nhắc nhở" value="Trước 15 phút" />
      </GradientCardSection>

      <GradientCardSection className="mt-6">
        <GradientCardDetail label="Linh hoạt" value="Hủy/đổi miễn phí" />
        <GradientCardDetail label="Xác nhận" value="Tức thời" />
      </GradientCardSection>

      <GradientCardSection className="mt-6">
        <GradientCardDetail label="Chọn cổng" value="Tùy chọn ưa thích" />
        <GradientCardDetail label="Quản lý" value="Lịch sử & đặt chỗ" />
      </GradientCardSection>
    </GradientCard>
  );
}

export function SupportCard() {
  return (
    <GradientCard
      title="🛟 Hỗ Trợ 24/7"
      subtitle="Đội ngũ chuyên nghiệp luôn sẵn sàng hỗ trợ"
      className="hover:border-foreground/20 h-[520px] max-w-sm transition-colors"
    >
      <GradientCardSection>
        <GradientCardDetail label="Kỹ thuật viên" value="Tại mọi trạm" />
        <GradientCardDetail label="Hotline" value="1900-xxxx" />
      </GradientCardSection>

      <GradientCardSection className="mt-6">
        <GradientCardDetail label="Chat trực tuyến" value="< 2 phút" />
        <GradientCardDetail label="Video call" value="Hướng dẫn trực tiếp" />
      </GradientCardSection>

      <GradientCardSection className="mt-6">
        <GradientCardDetail label="Bảo trì" value="Định kỳ & khẩn cấp" />
        <GradientCardDetail label="Đảm bảo" value="Chất lượng dịch vụ" />
      </GradientCardSection>
    </GradientCard>
  );
}

export function OnlinePaymentCard() {
  return (
    <GradientCard
      title="💳 Thanh Toán An Toàn"
      subtitle="Đa dạng phương thức, bảo mật tuyệt đối"
      className="hover:border-foreground/20 h-[520px] max-w-sm transition-colors"
    >
      <GradientCardSection>
        <GradientCardDetail label="Ví điện tử" value="Momo, ZaloPay, VNPay" />
        <GradientCardDetail label="Ngân hàng" value="ATM & Internet Banking" />
      </GradientCardSection>

      <GradientCardSection className="mt-6">
        <GradientCardDetail label="Bảo mật" value="SSL 256-bit" />
        <GradientCardDetail label="Xác thực" value="OTP & 3D Secure" />
      </GradientCardSection>

      <GradientCardSection className="mt-6">
        <GradientCardDetail label="Hóa đơn VAT" value="Tự động qua email" />
        <GradientCardDetail label="Hoàn tiền" value="Trong 24h" />
      </GradientCardSection>
    </GradientCard>
  );
}
