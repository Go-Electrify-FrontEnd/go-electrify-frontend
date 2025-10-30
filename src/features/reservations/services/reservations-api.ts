import { ConnectorType } from "@/features/connector-type/schemas/connector-type.schema";
import { Station } from "@/features/stations/schemas/station.schema";
import { CarModel } from "@/types/car";
import { Reservation } from "../schemas/reservation.schema";
import { ReservationAPI } from "../schemas/reservation.request";

export interface ReservationDetails extends Reservation {
  stationName: string;
  vehicleModelName: string;
  connectorTypeName: string;
}

export async function getReservationsDetails(
  token: string,
  stations: Station[],
  vehicleModels: CarModel[],
  connectorTypes: ConnectorType[],
): Promise<ReservationDetails[]> {
  const reservations = await getReservations(token);

  return reservations.map((reservation) => ({
    ...reservation,
    stationName:
      stations.find((s) => s.id === reservation.stationId)?.name || "",
    vehicleModelName:
      vehicleModels.find((vm) => vm.id === reservation.vehicleModelId)
        ?.modelName || "",
    connectorTypeName:
      connectorTypes.find((ct) => ct.id === reservation.connectorTypeId)
        ?.name || "",
  }));
}

export async function getReservations(token: string) {
  try {
    const url = "https://api.go-electrify.com/api/v1/bookings/my";
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 15, tags: ["reservations"] },
    });

    if (!response.ok) {
      console.error("Failed to fetch reservations, status: " + response.status);
      return [];
    }

    const { success, data, error } = ReservationAPI.safeParse(
      await response.json(),
    );

    if (success) {
      return data.data;
    } else {
      console.error("Invalid reservations data:", error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }
}
