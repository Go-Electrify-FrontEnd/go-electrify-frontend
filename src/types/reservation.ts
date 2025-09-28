// Car model interface - shared between client and server
export interface CarModel {
  id: number;
  brand: string;
  model: string;
  year: string;
  batteryCapacity: number; // in kWh
  supportedPorts: string[]; // e.g., ["CCS2", "CHAdeMO"]
}

// Charging port interface
export interface ChargingPort {
  id: string; // e.g., "CCS2"
  name: string; // e.g., "CCS2 (Combined Charging System)"
  type: string; // e.g., "DC Fast Charging"
  maxPower: string; // e.g., "350kW"
}
