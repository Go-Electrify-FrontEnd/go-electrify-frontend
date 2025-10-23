export type BookingFeeType = "FLAT" | "PERCENT";

export interface BookingFee {
  type: BookingFeeType;
  value: number;
}

export interface BookingFeeResponse {
  ok: boolean;
  data: BookingFee;
}
