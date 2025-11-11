import { getUser } from "@/lib/auth/auth-server";
import { forbidden } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();

  if (!user) {
    forbidden();
  }

  const role = user.role.toLowerCase();

  if (role !== "admin") {
    forbidden();
  }

  return <>{children}</>;
}
