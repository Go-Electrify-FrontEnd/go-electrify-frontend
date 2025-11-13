import { getUser } from "@/lib/auth/auth-server";
import { API_BASE_URL } from "@/lib/api-config";
import { UserApi, UserApiSchema } from "@/features/users/schemas/user.schema";

export async function getUsers(): Promise<UserApi[]> {
  try {
    const { token } = await getUser();
    const url = `${API_BASE_URL}/users`;
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error("Failed to fetch users, status: ", response.status);
      return [];
    }

    const json = await response.json();
    const items = Array.isArray(json?.Items) ? json.Items : [];
    const { data, success, error } = UserApiSchema.array().safeParse(items);
    if (!success) {
      console.error("Invalid users response:", error);
      return [];
    }
    return data;
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
}
/**
 * Đổi vai trò người dùng (SERVER-SIDE)
 * PUT /api/v1/users/{id}/role
 */
export async function updateUserRole(
  userId: number,
  newRole: string,
  forceSignOut = true,
) {
  const { token } = await getUser(); // giữ nguyên nếu bạn đang dùng server-side
  const res = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    // ⚠️ Backend yêu cầu "Role". Gửi kèm "NewRole" (optional) để tương thích swagger/response.
    body: JSON.stringify({
      Role: newRole,
      NewRole: newRole, // optional: không sao nếu backend bỏ qua
      ForceSignOut: forceSignOut,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    // log chi tiết lỗi validate (400) cho dễ debug
    const text = await res.text().catch(() => "");
    console.error("Update role failed payload:", {
      userId,
      newRole,
      forceSignOut,
      status: res.status,
      body: text,
    });
    throw new Error(`Update role failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<{
    ok: boolean;
    data: { UserId: number; OldRole: string; NewRole: string };
  }>;
}
