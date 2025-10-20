import SectionHeader from "@/components/dashboard/shared/section-header";
import { getUser } from "@/lib/auth/auth-server";
import { z } from "zod";
import { UsersTable } from "@/components/dashboard/admin/users/users-table";
import { UserApiSchema } from "@/lib/zod/user/user.schema";
import type { UserApi } from "@/lib/zod/user/user.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionContent from "@/components/dashboard/shared/section-content";

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
    const parsed = z.array(UserApiSchema).safeParse(items);
    if (!parsed.success) {
      console.error("Invalid users response:", parsed.error);
      return [];
    }
    return parsed.data;
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
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Danh sách người dùng</CardTitle>
            <CardDescription>
              Người dùng được quản lý trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UsersTable data={users} />
          </CardContent>
        </Card>
      </SectionContent>
    </div>
  );
}
