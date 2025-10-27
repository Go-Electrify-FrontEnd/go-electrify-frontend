import { getUser } from "@/lib/auth/auth-server";
import { permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();
  if (user) {
    permanentRedirect("/dashboard");
  }
  return <>{children}</>;
}
