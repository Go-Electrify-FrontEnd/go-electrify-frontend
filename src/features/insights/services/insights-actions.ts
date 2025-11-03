// src/
"use server";

import { getUser } from "@/lib/auth/auth-server";
import { RevenueInsights, UsageInsights, InsightsFilters } from "../types/insights.types";

const API_BASE = "https://api.go-electrify.com/api/v1/admin/insights";

export async function fetchRevenueInsightsAction(filters: InsightsFilters): Promise<RevenueInsights | null> {
  const { token } = await getUser();
  if (!token) return null;

  const params = new URLSearchParams({
    from: filters.from,
    to: filters.to,
    granularity: filters.granularity,
    ...(filters.stationId && { stationId: filters.stationId }),
  });

  try {
    const response = await fetch(`${API_BASE}/revenue?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.error("Error fetching revenue insights:", err);
    return null;
  }
}

export async function fetchUsageInsightsAction(filters: InsightsFilters): Promise<UsageInsights | null> {
  const { token } = await getUser();
  if (!token) return null;

  const params = new URLSearchParams({
    from: filters.from,
    to: filters.to,
    granularity: filters.granularity,
    ...(filters.stationId && { stationId: filters.stationId }),
  });

  try {
    const response = await fetch(`${API_BASE}/usage?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.error("Error fetching usage insights:", err);
    return null;
  }
}