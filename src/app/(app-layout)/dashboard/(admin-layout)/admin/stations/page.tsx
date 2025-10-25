import SectionHeader from "@/components/shared/section-header";
import StationCreate from "@/features/stations/components/station-create-dialog";
import { StationsTable } from "@/features/stations/components/station-table";
import { StaffAssignmentTable } from "@/features/stations/components/staff-assignment-table";
import { StationApiSchema } from "@/lib/zod/station/station.schema";
import type { Station } from "@/lib/zod/station/station.types";
import { UserApiSchema } from "@/lib/zod/user/user.schema";
import { mapUserApiToUser } from "@/lib/zod/user/user.types";
import type { User } from "@/lib/zod/user/user.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionContent from "@/components/shared/section-content";
import { getUser } from "@/lib/auth/auth-server";
import { z } from "zod";

export async function getStations(): Promise<Station[]> {
  try {
    const { token } = await getUser();
    const url = "https://api.go-electrify.com/api/v1/stations";
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 15, tags: ["stations"] },
    });

    if (!response.ok) {
      console.error("Failed to fetch stations, status: ", response.status);
      return [];
    }

    const parsed = StationApiSchema.array().safeParse(await response.json());
    if (!parsed.success) {
      console.error("Failed to parse stations:", parsed.error);
      return [];
    }

    return parsed.data;
  } catch (err) {
    console.error("Error fetching stations:", err);
    return [];
  }
}

export async function getUsers(): Promise<User[]> {
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

    // Parse với UserApiSchema (đã có transform sẵn)
    const parsed = z.array(UserApiSchema).safeParse(items);
    if (!parsed.success) {
      console.error("Invalid users response:", parsed.error);
      return [];
    }

    // Map UserApi sang User
    return parsed.data.map(mapUserApiToUser);
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
}

export default async function StationsManagementPage() {
  const [stations, users] = await Promise.all([getStations(), getUsers()]);

  // Lọc chỉ lấy Staff
  const staffList = users.filter((user) => user.role === "Staff");

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionHeader
        title={"Quản lý Trạm Sạc"}
        subtitle={"Quản lý và theo dõi các trạm sạc xe điện trong hệ thống"}
      >
        <StationCreate />
      </SectionHeader>

      <SectionContent>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Danh sách trạm</CardTitle>
            <CardDescription>
              Tất cả các trạm sạc trong hệ thống với thông tin chi tiết
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StationsTable data={stations} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Phân công nhân viên</CardTitle>
            <CardDescription>
              Quản lý và phân công nhân viên cho các trạm sạc
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StaffAssignmentTable stations={stations} staffList={staffList} />
          </CardContent>
        </Card>
      </SectionContent>
    </div>
  );
}
