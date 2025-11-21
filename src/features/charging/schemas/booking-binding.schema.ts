import { z } from "zod";

export const bookingBindingSchema = z
  .object({
    sessionId: z.string().min(1, "Session ID là bắt buộc"),
    ablyToken: z.string().min(1, "Ably token là bắt buộc"),
    channelId: z.string().min(1, "Channel ID là bắt buộc"),
    expiresAt: z.string().min(1, "Thời gian hết hạn là bắt buộc"),
    bookingCode: z.string().min(1, "Vui lòng chọn mã đặt chỗ"),
    currentSOC: z
      .number({ message: "SOC hiện tại phải là số" })
      .min(0, "SOC hiện tại phải từ 0-100")
      .max(100, "SOC hiện tại phải từ 0-100"),
    targetSOC: z
      .number({ message: "SOC mục tiêu phải là số" })
      .min(0, "SOC mục tiêu phải từ 0-100")
      .max(100, "SOC mục tiêu phải từ 0-100"),
  })
  .refine((data) => data.targetSOC > data.currentSOC, {
    message: "SOC mục tiêu phải lớn hơn SOC hiện tại",
    path: ["targetSOC"],
  });

export type BookingBindingFormData = z.infer<typeof bookingBindingSchema>;
