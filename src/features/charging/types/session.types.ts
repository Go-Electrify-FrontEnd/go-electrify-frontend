export type {
  CurrentChargingSession,
  CurrentSessionWithTokenResponse,
} from "../schemas/current-session.schema";

export type ChargingHistoryItem = {
  id: number;
  status: "COMPLETED" | "ABORTED" | "FAILED";
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  targetSoc: number | null;
  socStart: number;
  finalSoc: number;
  energyKwh: number;
  cost: number | null;
  bookingId: number;
  chargerId: number;
  ablyChannel: string;
};

export type ChargingHistoryResponse = {
  ok: boolean;
  data: {
    page: number;
    pageSize: number;
    total: number;
    items: ChargingHistoryItem[];
  };
};
