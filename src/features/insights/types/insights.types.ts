export type Granularity = "day" | "hour";

export interface RevenueSeries {
  Bucket: string;
  Amount: number;
}

export interface UsageSeries {
  Bucket: string;
  Count: number;
}

export interface RevenueInsights {
  Series: RevenueSeries[];
  Total: number;
}

export interface UsageInsights {
  Series: UsageSeries[];
  PeakHour?: number;
  PeakHourCount?: number;
  TotalSessions: number;
}

export interface InsightsFilters {
  from: string; 
  to: string;
  stationId?: string;
  granularity: Granularity;
}