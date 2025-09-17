import {
  columns,
  Reservation,
} from "@/components/dashboard/reservation/columns";
import CreateReservationButton from "@/components/dashboard/reservation/create-reservation-button";
import { DataTable } from "@/components/dashboard/reservation/data-table";
import { EmptyTable } from "@/components/dashboard/reservation/empty-table";
import { Button } from "@/components/ui/button";
import { getBackendUrl } from "@/lib/utils";
import { StationWithDistance } from "../find-stations/page";

async function getData(): Promise<Reservation[]> {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      userId: 101,
      pointId: 201,
      scheduledStart: "2024-12-20T08:00:00Z",
      scheduledEnd: "2024-12-20T10:00:00Z",
      initialSoc: 25,
      type: "standard",
      status: "confirmed",
      estimatedCost: 125000,
      createdAt: "2024-12-18T14:30:00Z",
      updatedAt: "2024-12-18T14:30:00Z",
    },
    {
      id: 2,
      userId: 101,
      pointId: 203,
      scheduledStart: "2024-12-22T14:30:00Z",
      scheduledEnd: "2024-12-22T16:00:00Z",
      initialSoc: 15,
      type: "fast",
      status: "pending",
      estimatedCost: 89500,
      createdAt: "2024-12-19T09:15:00Z",
      updatedAt: "2024-12-19T09:15:00Z",
    },
    {
      id: 3,
      userId: 102,
      pointId: 205,
      scheduledStart: "2024-12-21T18:00:00Z",
      scheduledEnd: "2024-12-21T20:30:00Z",
      initialSoc: 40,
      type: "rapid",
      status: "completed",
      estimatedCost: 156750,
      createdAt: "2024-12-17T11:45:00Z",
      updatedAt: "2024-12-21T20:35:00Z",
    },
    {
      id: 4,
      userId: 103,
      pointId: 202,
      scheduledStart: "2024-12-23T07:15:00Z",
      scheduledEnd: "2024-12-23T09:45:00Z",
      initialSoc: 30,
      type: "standard",
      status: "cancelled",
      estimatedCost: 98200,
      createdAt: "2024-12-19T16:20:00Z",
      updatedAt: "2024-12-20T08:10:00Z",
    },
    {
      id: 5,
      userId: 101,
      pointId: 207,
      scheduledStart: "2024-12-25T12:00:00Z",
      scheduledEnd: "2024-12-25T13:30:00Z",
      initialSoc: 20,
      type: "fast",
      status: "confirmed",
      estimatedCost: 67800,
      createdAt: "2024-12-20T10:30:00Z",
      updatedAt: "2024-12-20T10:30:00Z",
    },
    {
      id: 6,
      userId: 104,
      pointId: 204,
      scheduledStart: "2024-12-24T16:45:00Z",
      scheduledEnd: "2024-12-24T19:15:00Z",
      initialSoc: 10,
      type: "rapid",
      status: "pending",
      estimatedCost: 187500,
      createdAt: "2024-12-20T13:22:00Z",
      updatedAt: "2024-12-20T13:22:00Z",
    },
  ];
}

export default async function ReservationPage() {
  const data = await getData();

  const response = await fetch(getBackendUrl("api/stations"));
  const chargingStations: StationWithDistance[] = await response.json();

  const inComingReservations = data.filter(
    (reservation) => new Date(reservation.scheduledStart) > new Date(),
  );

  return (
    <div className="container mx-auto">
      <div className="border-b">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
                  Quản Lý Đặt Chỗ
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Danh sách các đặt chỗ của bạn
                </p>
              </div>
            </div>

            <CreateReservationButton stations={chargingStations} />
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-8">
        {/* Upcoming Reservations Section */}
        <div>
          <div className="mb-4">
            <h2 className="text-foreground text-xl font-semibold">
              Đặt Chỗ Sắp Tới
            </h2>
            <p className="text-muted-foreground text-sm">
              Các đặt chỗ trong tương lai của bạn
            </p>
          </div>
          {inComingReservations == null || inComingReservations.length === 0 ? (
            <EmptyTable />
          ) : (
            <DataTable columns={columns} data={inComingReservations} />
          )}
        </div>

        {/* All Reservations History Section */}
        <div>
          <div className="mb-4">
            <h2 className="text-foreground text-xl font-semibold">
              Lịch Sử Đặt Chỗ
            </h2>
            <p className="text-muted-foreground text-sm">
              Tất cả các đặt chỗ của bạn
            </p>
          </div>
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}
