import { getUser } from "@/lib/auth/auth-server";
import { hasRole } from "@/lib/auth/role-check";
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

  if (!hasRole(user, "admin")) {
    forbidden();
  }

  return <>{children}</>;
}
