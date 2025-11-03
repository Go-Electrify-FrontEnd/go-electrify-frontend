import { getUser } from "@/lib/auth/auth-server";
import { API_BASE_URL } from "@/lib/api-config";
import { UserApi, UserApiSchema } from "@/lib/zod/user/user.schema";

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
