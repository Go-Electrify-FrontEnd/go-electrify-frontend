import { API_BASE_URL } from "@/lib/api-config";
import {
  Subscription,
  SubscriptionSchema,
} from "../schemas/subscription.schema";

export async function getSubscriptions(): Promise<Subscription[]> {
  const url = `${API_BASE_URL}/subscriptions`;
  const response = await fetch(url, {
    method: "GET",
    next: { tags: ["subscriptions"] },
  });

  if (!response.ok) {
    console.error("Failed to fetch subscriptions, status: " + response.status);
    return [];
  }

  const parsed = SubscriptionSchema.array().safeParse(await response.json());
  if (!parsed.success) {
    console.error("Failed to parse subscriptions:", parsed.error);
    return [];
  }

  return parsed.data;
}
