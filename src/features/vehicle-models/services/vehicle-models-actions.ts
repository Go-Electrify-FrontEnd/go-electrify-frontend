"use server";

import { getUser } from "@/lib/auth/auth-server";
import { updateTag } from "next/cache";
import { vehicleModelSchema } from "../schemas/vehicle-model.request";

export async function createVehicleModel(prev: unknown, formData: FormData) {
  const { user, token } = await getUser();
  if (!user || !token) {
    return { success: false, msg: "Người dùng chưa xác thực" };
  }

  const connectorTypeIds = formData.getAll("connectorTypeIds") as string[];
  const { success, data, error } = vehicleModelSchema.safeParse({
    modelName: formData.get("modelName"),
    maxPowerKw: formData.get("maxPowerKw"),
    batteryCapacityKwh: formData.get("batteryCapacityKwh"),
    connectorTypeIds: connectorTypeIds,
  });

  if (!success) {
    console.error("Validation error:", error);
    return { success: false, msg: "Dữ liệu không hợp lệ" };
  }

  try {
    const url = "https://api.go-electrify.com/api/v1/vehicle-models";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ModelName: data.modelName,
        MaxPowerKw: data.maxPowerKw,
        BatteryCapacityKwh: data.batteryCapacityKwh,
        ConnectorTypeIds: data.connectorTypeIds,
      }),
    });

    if (response.ok) {
      updateTag("vehicle-models");
      return { success: true, msg: "Mẫu xe đã được tạo thành công" };
    } else {
      return { success: false, msg: "Tạo mẫu xe thất bại" };
    }
  } catch (error) {
    console.error("Error creating vehicle model:", error);
    return { success: false, msg: "Đã xảy ra lỗi khi tạo mẫu xe" };
  }
}

export async function updateVehicleModel(prev: unknown, formData: FormData) {
  const { user, token } = await getUser();
  if (!user || !token) {
    return { success: false, msg: "Người dùng chưa xác thực" };
  }

  const id = formData.get("id") as string;
  const connectorTypeIds = formData.getAll("connectorTypeIds") as string[];
  const { success, data, error } = vehicleModelSchema.safeParse({
    modelName: formData.get("modelName"),
    maxPowerKw: formData.get("maxPowerKw"),
    batteryCapacityKwh: formData.get("batteryCapacityKwh"),
    connectorTypeIds: connectorTypeIds,
  });

  if (!success) {
    console.error("Validation error:", error);
    return { success: false, msg: "Dữ liệu không hợp lệ" };
  }

  try {
    const url = `https://api.go-electrify.com/api/v1/vehicle-models/${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ModelName: data.modelName,
        MaxPowerKw: data.maxPowerKw,
        BatteryCapacityKwh: data.batteryCapacityKwh,
        ConnectorTypeIds: data.connectorTypeIds,
      }),
    });

    if (response.ok) {
      updateTag("vehicle-models");
      return { success: true, msg: "Mẫu xe đã được cập nhật thành công" };
    } else {
      return { success: false, msg: "Cập nhật mẫu xe thất bại" };
    }
  } catch (error) {
    console.error("Error updating vehicle model:", error);
    return { success: false, msg: "Đã xảy ra lỗi khi cập nhật mẫu xe" };
  }
}

export async function deleteVehicleModel(prev: unknown, formData: FormData) {
  const { user, token } = await getUser();
  if (!user || !token) {
    return { success: false, msg: "Người dùng chưa xác thực" };
  }

  const id = formData.get("id");
  if (!id || Array.isArray(id)) {
    return { success: false, msg: "ID mẫu xe không hợp lệ" };
  }

  try {
    const url = `https://api.go-electrify.com/api/v1/vehicle-models/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      updateTag("vehicle-models");
      return { success: true, msg: "Mẫu xe đã được xóa thành công" };
    } else {
      return { success: false, msg: "Xóa mẫu xe thất bại" };
    }
  } catch (error) {
    console.error("Error deleting vehicle model:", error);
    return { success: false, msg: "Đã xảy ra lỗi khi xóa mẫu xe" };
  }
}
