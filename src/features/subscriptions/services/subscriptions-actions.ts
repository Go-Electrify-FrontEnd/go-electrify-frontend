"use server";

import { getUser } from "@/lib/auth/auth-server";
import { updateTag } from "next/cache";
import { forbidden } from "next/navigation";

export async function createSubscription(prev: unknown, data: FormData) {
  const { user, token } = await getUser();
  if (!user || !token) {
    forbidden();
  }
  const name = data.get("name")?.toString();
  const price = data.get("price")?.toString();
  const totalKwH = data.get("totalKwH")?.toString();
  const durationDays = data.get("durationDays")?.toString();

  if (!name || !price || !durationDays) {
    return {
      success: false,
      msg: "Vui lòng gửi tất cả các trường bắt buộc để tiếp tục",
    };
  }

  const url = "https://api.go-electrify.com/api/v1/subscriptions";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Name: name,
        Price: parseFloat(price),
        DurationDays: parseInt(durationDays, 10),
        TotalKwH: totalKwH ? parseInt(totalKwH, 10) : undefined,
      }),
    });

    const success = response.ok;
    return {
      success,
      msg: success ? "Gói đăng ký đã được tạo" : "Tạo gói đăng ký thất bại",
    };
  } catch (error) {
    console.error("createSubscription error", error);
    return {
      success: false,
      msg: "Lỗi kết nối. Vui lòng thử lại hoặc liên hệ quản trị viên nếu lỗi vẫn tiếp diễn",
    };
  }
}

export async function updateSubscription(prev: unknown, data: FormData) {
  const { user, token } = await getUser();
  if (!user || !token) {
    forbidden();
  }

  const id = data.get("id")?.toString();
  const name = data.get("name")?.toString();
  const price = data.get("price")?.toString();
  const totalKwH = data.get("totalKwH")?.toString();
  const durationDays = data.get("durationDays")?.toString();

  if (!id || !name || !price || !durationDays) {
    return {
      success: false,
      msg: "Vui lòng cung cấp tất cả các trường bắt buộc để tiếp tục",
    };
  }

  const parsedPrice = Number(price);
  const parsedTotalKwH =
    totalKwH && totalKwH !== "" ? Number(totalKwH) : undefined;
  const parsedDuration = Number(durationDays);

  if (
    Number.isNaN(parsedPrice) ||
    Number.isNaN(parsedDuration) ||
    (parsedTotalKwH !== undefined && Number.isNaN(parsedTotalKwH))
  ) {
    return { success: false, msg: "Vui lòng nhập các giá trị số hợp lệ" };
  }

  const url = `https://api.go-electrify.com/api/v1/subscriptions/${id}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Name: name,
        Price: parsedPrice,
        TotalKwH: parsedTotalKwH,
        DurationDays: parsedDuration,
      }),
    });

    const success = response.ok;
    if (success) updateTag("subscriptions");

    return {
      success,
      msg: success
        ? "Gói đã được cập nhật thành công"
        : "Cập nhật gói thất bại",
    };
  } catch (error) {
    console.error("updateSubscription error", error);
    return { success: false, msg: "Lỗi kết nối. Vui lòng thử lại" };
  }
}

export async function deleteSubscription(prev: unknown, dataForm: FormData) {
  const { user, token } = await getUser();
  if (!user || !token) {
    forbidden();
  }

  const id = dataForm.get("id")?.toString();
  if (!id) {
    return { success: false, msg: "Vui lòng cung cấp id để tiếp tục" };
  }

  const url = `https://api.go-electrify.com/api/v1/subscriptions/${id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const success = response.ok;
    updateTag("subscriptions");
    return {
      success,
      msg: success ? "Gói đã được xóa thành công" : "Xóa gói thất bại",
    };
  } catch (error) {
    console.error("deleteSubscription error", error);
    return { success: false, msg: "Lỗi kết nối. Vui lòng thử lại" };
  }
}

export async function subscribeToPlan(subscriptionId: number) {
  const { user, token } = await getUser();
  if (!user || !token) {
    forbidden();
  }

  const url = `https://api.go-electrify.com/api/v1/subscriptions/${subscriptionId}/subscribe`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: user.uid,
        subscriptionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { success: true, msg: "Đăng ký gói thành công" };
  } catch (error) {
    console.error("subscribeToPlan error", error);
    throw error;
  }
}

export async function purchaseSubscription(prev: unknown, data: FormData) {
  const { user, token } = await getUser();
  if (!user || !token) {
    forbidden();
  }

  const subscriptionId = data.get("SubscriptionId")?.toString();

  if (!subscriptionId) {
    return {
      success: false,
      msg: "Vui lòng cung cấp Subscription ID",
    };
  }

  const url =
    "https://api.go-electrify.com/api/v1/wallet/subscriptions/purchase";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        SubscriptionId: parseInt(subscriptionId, 10),
        StartDate: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      updateTag("user-subscriptions");
      return { success: true, msg: "Mua gói đăng ký thành công" };
    } else {
      const jsonResponse = await response.json();
      return { success: false, msg: jsonResponse.error || "Purchase failed" };
    }
  } catch (error) {
    console.error("purchaseSubscription error", error);
    return {
      success: false,
      msg: "Lỗi kết nối. Vui lòng thử lại",
    };
  }
}
