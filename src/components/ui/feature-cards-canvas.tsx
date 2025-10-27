"use client";
import React from "react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

const Card = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="relative mx-auto h-[30rem] w-full max-w-sm overflow-hidden rounded-lg border border-black/[0.2] dark:border-white/[0.2]">
      <Icon className="absolute -top-3 -left-3 z-30 h-6 w-6 text-black dark:text-white" />
      <Icon className="absolute -bottom-3 -left-3 z-30 h-6 w-6 text-black dark:text-white" />
      <Icon className="absolute -top-3 -right-3 z-30 h-6 w-6 text-black dark:text-white" />
      <Icon className="absolute -right-3 -bottom-3 z-30 h-6 w-6 text-black dark:text-white" />

      {/* Static background - always visible */}
      <div className="absolute inset-0 h-full w-full">{children}</div>

      {/* Content overlay - always visible */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center p-6">
        <h2 className="mb-3 text-center text-2xl font-bold text-white">
          {title}
        </h2>
        <p className="text-center text-sm leading-relaxed text-white/80">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export function CheaperPriceCard() {
  return (
    <Card
      title="Tiết Kiệm Chi Phí"
      subtitle="Giá cước rẻ hơn 30% so với các trạm khác. Giờ thấp điểm giảm 40%, gói tháng VIP ưu đãi 20%"
    >
      <CanvasRevealEffect
        animationSpeed={3}
        containerClassName="bg-cyan-600"
        colors={[
          [125, 211, 252],
          [6, 182, 212],
        ]}
        dotSize={2}
      />
    </Card>
  );
}

export function ReservationSlotCard() {
  return (
    <Card
      title="Đặt Chỗ Thông Minh"
      subtitle="Luôn có chỗ sạc khi bạn cần, không lo chờ đợi. Đặt trước từ 30 phút đến 7 ngày"
    >
      <CanvasRevealEffect
        animationSpeed={3}
        containerClassName="bg-pink-600"
        colors={[
          [236, 72, 153],
          [232, 121, 249],
        ]}
        dotSize={2}
      />
    </Card>
  );
}

export function SupportCard() {
  return (
    <Card
      title="Hỗ Trợ 24/7"
      subtitle="Đội ngũ chuyên nghiệp luôn sẵn sàng hỗ trợ. Kỹ thuật viên tại mọi trạm, hotline 1900-xxxx"
    >
      <CanvasRevealEffect
        animationSpeed={3}
        containerClassName="bg-green-600"
        colors={[
          [134, 239, 172],
          [34, 197, 94],
        ]}
        dotSize={2}
      />
    </Card>
  );
}

export function OnlinePaymentCard() {
  return (
    <Card
      title="Thanh Toán An Toàn"
      subtitle="Đa dạng phương thức, bảo mật tuyệt đối. Hỗ trợ ví điện tử, ngân hàng, SSL 256-bit"
    >
      <CanvasRevealEffect
        animationSpeed={3}
        containerClassName="bg-amber-600"
        colors={[
          [251, 191, 36],
          [245, 158, 11],
        ]}
        dotSize={2}
      />
    </Card>
  );
}

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
