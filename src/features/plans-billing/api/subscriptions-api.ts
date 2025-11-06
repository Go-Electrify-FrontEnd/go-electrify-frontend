import "server-only";
import {
  UserSubscription,
  UserSubscriptionSchema,
} from "@/features/subscriptions/schemas/user-subscription.schema";
import { getUser } from "@/lib/auth/auth-server";
import { API_BASE_URL } from "@/lib/api-config";

export async function getUserSubscriptions(): Promise<UserSubscription[]> {
  const { token } = await getUser();
  if (!token) return [];

  const url = `${API_BASE_URL}/wallet/subscriptions`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // next: { tags: ["user-subscriptions"] },
  });

  if (!response.ok) {
    console.error(
      "Failed to fetch user subscriptions, status: " + response.status,
    );
    return [];
  }

  const parsed = UserSubscriptionSchema.array().safeParse(
    await response.json(),
  );

  if (!parsed.success) {
    console.error("Failed to parse user subscriptions:", parsed.error);
    return [];
  }

  return parsed.data;
}
