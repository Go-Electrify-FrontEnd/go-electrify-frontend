import { getUser } from "@/lib/auth/auth-server";
import { forbidden } from "next/navigation";
import { DepositCustomersClient } from "./deposit-customers-client";
export interface User {
  Id: number;
  Email: string;
  FullName: string | null;
  Role: string;
  WalletBalance: number;
  CreatedAt: string;
}

async function getUsers(token: string): Promise<User[]> {
  try {
    const response = await fetch(
      "https://api.go-electrify.com/api/v1/users?Role=Driver",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch users:", response.status);
      return [];
    }

    const data = await response.json();
    return data.Items || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export default async function DepositCustomersPage() {
  const { user, token } = await getUser();

  if (!user || !token) {
    forbidden();
  }

  const users = await getUsers(token);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nạp tiền cho khách hàng</h1>
        <p className="text-muted-foreground mt-1">
          Chọn một khách hàng (Driver) để nạp tiền thủ công.
        </p>
      </div>
      <DepositCustomersClient initialUsers={users} />
    </div>
  );
}
