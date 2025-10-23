import { columns } from "@/features/reservations/components/reservation-table-columns";
import { DataTable } from "@/features/reservations/components/reservation-table";
import { EmptyTable } from "@/features/reservations/components/reservation-table-empty";
import { Plus } from "lucide-react";
import CreateReservationButton from "@/features/reservations/components/reservation-create-button";
import { getStations } from "../../(admin-layout)/admin/stations/page";
import SectionHeader from "@/components/shared/section-header";
import { getUser } from "@/lib/auth/auth-server";
import type { CarModel } from "@/lib/zod/vehicle-model/vehicle-model.types";
import { getConnectorTypes } from "../../(admin-layout)/admin/connector-type/page";
import type { Reservation } from "@/lib/zod/reservation/reservation.types";
import type { ConnectorType } from "@/lib/zod/connector-type/connector-type.types";
import { getVehicleModels } from "../../(admin-layout)/admin/vehicle-models/page";
import SectionContent from "@/components/shared/section-content";
import { ReservationSchema } from "@/lib/zod/reservation/reservation.schema";
import { ReservationAPI } from "@/lib/zod/reservation/reservation.request";

export async function getReservations(
  token: string,
  connectorTypes: ConnectorType[],
  vehicleModels: CarModel[],
): Promise<Reservation[]> {
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

    const parseResult = ReservationAPI.safeParse(await response.json());

    if (parseResult.success) {
      const reservations = parseResult.data.data;
      return reservations;
    } else {
      console.error("Invalid reservations data:", parseResult.error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }
}

export default async function ReservationPage() {
  const { token } = await getUser();
  const stations = await getStations();
  const vehicleModels = await getVehicleModels(token!);
  const connectorTypes = await getConnectorTypes();
  const reservations = await getReservations(
    token!,
    connectorTypes,
    vehicleModels,
  );

  return (
    <div className="container mx-auto space-y-6">
      <SectionHeader
        title="Quản lý Đặt Chỗ"
        subtitle="Xem và quản lý các đặt chỗ trạm sạc xe điện của bạn"
      >
        <CreateReservationButton
          stations={stations}
          vehicleModels={vehicleModels}
          connectorTypes={connectorTypes}
        />
      </SectionHeader>

      {/* Content Sections */}
      <SectionContent>
        <div className="space-y-8">
          {/* Upcoming Reservations Section */}
          <div className="bg-card rounded-lg border">
            <div className="bg-muted/30 border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-foreground text-lg font-semibold">
                    Đặt Chỗ Sắp Tới
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Các đặt chỗ trong tương lai của bạn ({reservations.length}{" "}
                    đặt chỗ)
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {reservations == null || reservations.length === 0 ? (
                <EmptyTable />
              ) : (
                <DataTable columns={columns} data={reservations} />
              )}
            </div>
          </div>

          {/* All Reservations Section */}
          <div className="bg-card rounded-lg border">
            <div className="bg-muted/30 border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <svg
                    className="h-4 w-4 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-foreground text-lg font-semibold">
                    Lịch Sử Đặt Chỗ
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Tất cả các đặt chỗ của bạn ({reservations.length} đặt chỗ)
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <DataTable columns={columns} data={reservations} />
            </div>
          </div>
        </div>
      </SectionContent>
    </div>
  );
}
