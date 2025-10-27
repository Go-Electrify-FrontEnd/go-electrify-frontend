import {
  GradientCard,
  GradientCardDetail,
  GradientCardSection,
} from "./gradient-card";

/**
 * Example usage of the GradientCard component
 * This demonstrates how to create a card similar to the GPT-5 Pro design
 */
export function CheaperPriceCard() {
  return (
    <GradientCard
      title="Sạc Tiết Kiệm"
      subtitle="Giá rẻ hơn — tiết kiệm cho mỗi chuyến đi"
      className="h-[520px] max-w-sm"
    >
      <GradientCardSection>
        <GradientCardDetail label="Giảm giá giờ thấp điểm" value="Có" />
        <GradientCardDetail label="Gói thành viên" value="Ưu đãi lên đến 20%" />
      </GradientCardSection>

      <GradientCardSection className="mt-6">
        <GradientCardDetail label="Thanh toán" value="Không cần tiền mặt" />
        <GradientCardDetail label="Ưu đãi tháng" value="Ưu đãi định kỳ" />
      </GradientCardSection>
    </GradientCard>
  );
}

/**
 * Simple usage example
 */
export function ReservationSlotCard() {
  return (
    <GradientCard
      title="Đặt Chỗ Trước"
      subtitle="Chọn khung giờ, an tâm có chỗ sạc"
      className="h-[520px] max-w-sm"
    >
      <GradientCardSection>
        <GradientCardDetail label="Chọn khung giờ" value="Tùy chọn linh hoạt" />
        <GradientCardDetail label="Nhắc nhở" value="Thông báo trước giờ" />
      </GradientCardSection>

      <GradientCardSection className="mt-6">
        <GradientCardDetail label="Quản lý" value="Hủy/đổi dễ dàng" />
        <GradientCardDetail label="Xác nhận" value="Qua app ngay lập tức" />
      </GradientCardSection>
    </GradientCard>
  );
}

/**
 * Custom background example
 */
export function SupportCard() {
  return (
    <GradientCard
      title="Hỗ Trợ 24/7"
      subtitle="Luôn đồng hành cùng tài xế"
      className="h-[520px] max-w-sm"
    >
      <GradientCardSection>
        <GradientCardDetail label="Hỗ trợ kỹ thuật" value="Tại chỗ & từ xa" />
        <GradientCardDetail label="Hotline" value="24/7 – phản hồi nhanh" />
      </GradientCardSection>

      <GradientCardSection className="mt-6">
        <GradientCardDetail label="Hướng dẫn" value="Trực tuyến & tại trạm" />
        <GradientCardDetail label="Bảo trì" value="Đội ngũ chuyên nghiệp" />
      </GradientCardSection>
    </GradientCard>
  );
}

export function OnlinePaymentCard() {
  return (
    <GradientCard
      title="Thanh Toán Trực Tuyến"
      subtitle="Aan toàn và nhanh chóng"
      className="h-[520px] max-w-sm"
    >
      <GradientCardSection>
        <GradientCardDetail
          label="Phương thức"
          value="Thẻ, ví điện tử, ngân hàng"
        />
        <GradientCardDetail label="Bảo mật" value="Mã hóa & chứng thực" />
      </GradientCardSection>

      <GradientCardSection className="mt-6">
        <GradientCardDetail label="Hóa đơn" value="Tự động gửi qua email" />
        <GradientCardDetail label="Hoàn tiền" value="Hỗ trợ khi cần thiết" />
      </GradientCardSection>
    </GradientCard>
  );
}
