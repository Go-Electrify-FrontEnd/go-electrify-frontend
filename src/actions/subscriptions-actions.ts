"use server";

import { getUser } from "@/lib/auth/auth-server";
// Translations removed; using inline Vietnamese literals
import { revalidateTag } from "next/cache";
import { forbidden } from "next/navigation";

export async function createSubscription(prev: unknown, data: FormData) {
  const { user, token } = await getUser();
  if (!user || !token) {
    forbidden();
  }
  // Vietnamese literals
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
    console.log(
      "createSubscription response: " + JSON.stringify(await response.json()),
    );
    return {
      success,
      msg: success
        ? "Gói đăng ký đã được tạo"
        : "Tạo gói đăng ký thất bại",
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

  // Vietnamese literals
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
    if (success) {
      revalidateTag("subscriptions");
    }

    return {
      success,
      msg: success ? "Gói đã được cập nhật thành công" : "Cập nhật gói thất bại",
    };
  } catch (error) {
    console.error("updateSubscription error", error);
    return {
      success: false,
      msg: "Lỗi kết nối. Vui lòng thử lại",
    };
  }
}

export async function deleteSubscription(prev: unknown, dataForm: FormData) {
  const { user, token } = await getUser();
  if (!user || !token) {
    forbidden();
  }
  // Vietnamese literals
  const id = dataForm.get("id")?.toString();

  if (!id) {
    return { success: false, msg: "Vui lòng cung cấp id để tiếp tục" };
  }

  const url = `https://api.go-electrify.com/api/v1/subscriptions/${id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const success = response.ok;
    revalidateTag("subscriptions");
    return {
      success,
      msg: success ? "Gói đã được xóa thành công" : "Xóa gói thất bại",
    };
  } catch (error) {
    console.error("deleteSubscription error", error);
    return {
      success: false,
      msg: "Lỗi kết nối. Vui lòng thử lại",
    };
  }
}
