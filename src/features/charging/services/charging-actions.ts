"use server";

import { getUser } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";

const API_BASE_URL = "https://api.go-electrify.com/api/v1";

export async function handleJoin(_prev: unknown, formData: FormData) {
  let redirectUrl: string | null = null;

  try {
    const { token } = await getUser();
    const joinCode = formData.get("joinCode") as string;

    if (!token || !joinCode) {
      return {
        success: false,
        msg: "Missing authentication token or join code.",
        data: null,
      };
    }

    const response = await fetch(`${API_BASE_URL}/docks/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Code: joinCode,
        role: "dashboard",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        msg: errorData.message || `Failed to join session (${response.status})`,
        data: null,
      };
    }

    const { data } = await response.json();

    if (!data?.token || !data?.channelId || !data?.sessionId) {
      return {
        success: false,
        msg: "Invalid response from server.",
        data: null,
      };
    }

    redirectUrl = `/dashboard/charging/binding?ablyToken=${data.token}&channelId=${data.channelId}&sessionId=${data.sessionId}&expiresAt=${data.expiresAt}`;
  } catch (error) {
    console.error("Join session error:", error);
    return {
      success: false,
      msg: "An unexpected error occurred while joining the session.",
      data: null,
    };
  } finally {
    // Perform redirect if URL was prepared successfully
    if (redirectUrl) {
      redirect(redirectUrl);
    }
  }
}

export async function handleBindBooking(_prev: unknown, formData: FormData) {
  try {
    const { token } = await getUser();
    const bookingCode = formData.get("bookingCode") as string;
    const targetSOC = formData.get("targetSOC") as string;
    const sessionId = formData.get("sessionId") as string;

    if (!token || !bookingCode || !targetSOC || !sessionId) {
      return {
        success: false,
        msg: "Missing required booking information.",
        data: null,
      };
    }

    const targetSOCNumber = Number(targetSOC);
    if (
      isNaN(targetSOCNumber) ||
      targetSOCNumber < 0 ||
      targetSOCNumber > 100
    ) {
      return {
        success: false,
        msg: "Invalid target SOC value. Must be between 0 and 100.",
        data: null,
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/sessions/${sessionId}/bind-booking`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingCode,
          initialSOC: 20, // Fixed initial SOC as per current implementation
          targetSOC: targetSOCNumber,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        msg: errorData.message || `Failed to bind booking (${response.status})`,
        data: null,
      };
    }

    const { data } = await response.json();

    if (!data?.Id || !data?.BookingId) {
      return {
        success: false,
        msg: "Invalid response from server.",
        data: null,
      };
    }

    return {
      success: true,
      msg: "Booking bound successfully!",
      data: {
        Id: data.Id,
        BookingId: data.BookingId,
        vehicleModelId: data.vehicleModelId,
        SocStart: data.SocStart,
        TargetSoc: data.TargetSoc,
      },
    };
  } catch (error) {
    console.error("Bind booking error:", error);
    return {
      success: false,
      msg: "An unexpected error occurred while binding the booking.",
      data: null,
    };
  }
}
