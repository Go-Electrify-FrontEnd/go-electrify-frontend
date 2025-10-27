import { getUser } from "@/lib/auth/auth-server";
import { UserApi, UserApiSchema } from "@/lib/zod/user/user.schema";

export async function getUsers(): Promise<UserApi[]> {
  try {
    const { token } = await getUser();
    const url = "https://api.go-electrify.com/api/v1/users";
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60, tags: ["users"] },
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
