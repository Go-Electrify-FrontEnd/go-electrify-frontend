"use server";

import * as users from "@/features/users/services/users";

export async function updateUserName(prev: unknown, formData: FormData) {
  return await users.updateUserName(prev, formData);
}
