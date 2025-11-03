import { getUser } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";
import InsightsClient from "./InsightsClient";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const { user, token } = await getUser();

  if (!user || !token) {
    redirect("/login");
  }

  return <InsightsClient />;
}