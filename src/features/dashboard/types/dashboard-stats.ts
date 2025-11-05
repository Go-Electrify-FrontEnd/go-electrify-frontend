export type DriverStats = {
  walletBalance: number;
  totalSpent: number;
  chargingSessions: number;
  upcomingReservations: number;
};

export type StaffStats = {
  totalStations: number;
  activeStations: number;
  totalCustomers: number;
  activeSessions: number;
  pendingReservations: number;
};
