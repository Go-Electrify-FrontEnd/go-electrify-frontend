import { API_BASE_URL } from "@/lib/api-config";
import { getUser } from "@/lib/auth/auth-server";
import "server-only";
import { TransactionListApiSchema } from "../schemas/wallet.schema";

export async function getTransactions(page: number = 1, pageSize: number = 10) {
  const { token } = await getUser();
  const url = `${API_BASE_URL}/wallet/me/transactions?page=${page}&pageSize=${pageSize}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    next: { tags: ["wallet-transactions"] },
  });

  if (!response.ok) {
    console.error("Failed to fetch transactions, status: " + response.status);
    return { transactions: [], total: 0, page: 1, pageSize };
  }

  const { success, data, error } = TransactionListApiSchema.safeParse(
    await response.json(),
  );

  if (!success) {
    console.error("Failed to parse transactions:", JSON.stringify(error));
    return { transactions: [], total: 0, page: 1, pageSize };
  }

  // For now, return all transactions and disable pagination
  return {
    transactions: data.data,
    total: data.total,
    page: 1,
    pageSize: data.data.length, // Show all on one page
  };
}
