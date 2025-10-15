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

export type AdminStats = {
  totalStations: number;
  activeStations: number;
  totalUsers: number;
  roleBreakdown: { driver: number; staff: number; admin: number };
  totalConnectorTypes: number;
  totalVehicleModels: number;
  totalSubscriptions: number;
  totalReservations: number;
  activeReservations: number;
};
