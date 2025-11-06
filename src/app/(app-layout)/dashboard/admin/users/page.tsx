import SectionHeader from "@/components/section-header";
import { getUser } from "@/lib/auth/auth-server";
import { UsersTable } from "@/features/users/components/users-table";
import { UserApiSchema } from "@/features/users/schemas/user.schema";
import type { UserApi } from "@/features/users/schemas/user.types";
import SectionContent from "@/components/section-content";
import { API_BASE_URL } from "@/lib/api-config";

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

export default async function UserManagementPage() {
  const users = await getUsers();

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionHeader
        title={"Quản lý Người Dùng"}
        subtitle={"Danh sách người dùng và trạng thái"}
      />
      <SectionContent>
        <UsersTable data={users} />
      </SectionContent>
    </div>
  );
}
