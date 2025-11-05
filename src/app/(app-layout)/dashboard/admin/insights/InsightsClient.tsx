"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { InsightsFilter } from "@/features/insights/components/InsightsFilter";
import { RevenueChart } from "@/features/insights/components/RevenueChart";
import { UsageChart } from "@/features/insights/components/UsageChart";
import {
  fetchRevenueInsightsAction,
  fetchUsageInsightsAction,
} from "@/features/insights/services/insights-actions";
import { InsightsFilters } from "@/features/insights/types/insights.types";
import SectionHeader from "@/components/shared/section-header";
import SectionContent from "@/components/shared/section-content";

export default function InsightsClient() {
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");

  const [filters, setFilters] = useState<InsightsFilters>({
    from: todayStr,
    to: todayStr,
    granularity: "day",
  });

  const [revenue, setRevenue] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [rev, use] = await Promise.all([
        fetchRevenueInsightsAction(filters),
        fetchUsageInsightsAction(filters),
      ]);

      setRevenue(rev);
      setUsage(use);
      setLoading(false);
    }
    loadData();
  }, [filters]);

  return (
    <div suppressHydrationWarning={true} className="space-y-8">
      <InsightsFilter onChange={setFilters} loading={loading} />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <RevenueChart
          data={revenue}
          loading={loading}
          granularity={filters.granularity}
        />
        <UsageChart
          data={usage}
          loading={loading}
          granularity={filters.granularity}
        />
      </div>

      {loading && (
        <div className="text-muted-foreground mt-6 text-center">
          Đang tải dữ liệu...
        </div>
      )}

      {!loading && !revenue?.Series?.length && !usage?.Series?.length && (
        <div className="text-muted-foreground mt-6 text-center">
          Không có dữ liệu cho ngày hôm nay.
        </div>
      )}
    </div>
  );
}
