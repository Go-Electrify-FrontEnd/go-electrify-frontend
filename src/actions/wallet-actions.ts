"use server";

import * as wallet from "@/features/wallet/services/wallet";

export async function handleCreateTopup(prev: unknown, formData: FormData) {
  return await wallet.handleCreateTopup(prev, formData);
}
