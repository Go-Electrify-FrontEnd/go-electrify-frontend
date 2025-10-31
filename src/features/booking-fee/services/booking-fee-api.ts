import { getUser } from "@/lib/auth/auth-server";
import { BookingFeeResponseSchema } from "../schemas/booking-fee.schema";
import { BookingFee } from "../schemas/booking-fee.types";

export async function getBookingFee(): Promise<BookingFee | null> {
  try {
    const { token } = await getUser();
    const url = "https://api.go-electrify.com/api/v1/admin/booking-fee";
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
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
