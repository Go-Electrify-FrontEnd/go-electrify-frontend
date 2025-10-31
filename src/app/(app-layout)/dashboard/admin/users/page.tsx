import SectionHeader from "@/components/shared/section-header";
import { getUser } from "@/lib/auth/auth-server";
import { UsersTable } from "@/features/users/components/users-table";
import { UserApiSchema } from "@/lib/zod/user/user.schema";
import type { UserApi } from "@/lib/zod/user/user.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionContent from "@/components/shared/section-content";

export async function getUsers(): Promise<UserApi[]> {
  try {
    const { token } = await getUser();
    const url = "https://api.go-electrify.com/api/v1/users";
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
