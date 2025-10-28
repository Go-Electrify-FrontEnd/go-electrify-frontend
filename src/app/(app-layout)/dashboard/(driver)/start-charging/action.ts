"use server";

import { getUser } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";

export async function handleJoin(prev: unknown, formData: FormData) {
  const { token } = await getUser();
  const joinCode = formData.get("joinCode") as string;

  if (!token || !joinCode) {
    return {
      success: false,
      msg: "Missing token or join code.",
      data: null,
    };
  }

  const url = "https://api.go-electrify.com/api/v1/docks/join";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ Code: joinCode, role: "dashboard" }),
  });

  const data = await response.json();
  console.log("Join Response:", data);
  const parsed = data.data;
  redirect(
    `/dashboard/start-charging/join?ablyToken=${parsed.token}&channelId=${parsed.channelId}&sessionId=${parsed.sessionId}&expiresAt=${parsed.expiresAt}`,
  );
}

export async function handleBindBooking(prev: unknown, formData: FormData) {
  const { token } = await getUser();
  const bookingCode = formData.get("bookingCode") as string;
  const initialSOC = formData.get("initialSOC") as string;
  const targetSOC = formData.get("targetSOC") as string;
  const sessionId = formData.get("sessionId") as string;
  if (!token || !bookingCode || !targetSOC || !sessionId) {
    return {
      success: false,
      msg: "Missing token or booking details.",
      data: null,
    };
  }
  const url = `https://api.go-electrify.com/api/v1/sessions/${sessionId}/bind-booking`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      bookingCode: bookingCode,
      initialSOC: 20,
      targetSOC: Number(targetSOC),
    }),
  });

  const responseClone = response.clone();
  console.log("Bind Booking Raw Response:", await responseClone.text());
  const { Id, BookingId, vehicleModelId, SocStart, TargetSoc } =
    await response.json();

  console.log("Bind Booking Response:", {
    Id,
    BookingId,
    vehicleModelId,
    SocStart,
    TargetSoc,
  });
  return {
    success: true,
    msg: "Booking bound successfully!",
    data: {
      Id,
      BookingId,
      vehicleModelId,
      SocStart,
      TargetSoc,
    },
  };
}
