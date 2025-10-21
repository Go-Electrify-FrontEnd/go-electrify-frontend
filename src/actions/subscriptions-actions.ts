"use server";

import * as subscriptions from "@/features/subscriptions/services/subscriptions";

export async function createSubscription(prev: unknown, data: FormData) {
  return await subscriptions.createSubscription(prev, data);
}

export async function updateSubscription(prev: unknown, data: FormData) {
  return await subscriptions.updateSubscription(prev, data);
}

export async function deleteSubscription(prev: unknown, data: FormData) {
  return await subscriptions.deleteSubscription(prev, data);
}
