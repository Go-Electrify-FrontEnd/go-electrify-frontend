import {
  columns,
  Reservation,
} from "@/components/dashboard/reservation/reservation-table-columns";
import { DataTable } from "@/components/dashboard/reservation/reservation-table";
import { EmptyTable } from "@/components/dashboard/reservation/reservation-table-empty";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBackendUrl } from "@/lib/utils";
import { Plus, Calendar } from "lucide-react";
import CreateReservationButton from "@/components/dashboard/reservation/reservation-create-button";
import { Station } from "@/types/station";

async function getData() {
  const reservationsResponse = await fetch(getBackendUrl("api/reservations"));
  const reservationsData: Reservation[] = await reservationsResponse.json();

  const chargingStationsResponse = await fetch(getBackendUrl("api/stations"));
  const chargingStations: Station[] = await chargingStationsResponse.json();

  return { reservationsData, chargingStations };
}

export default async function ReservationPage() {
  const { reservationsData, chargingStations } = await getData();

  const inComingReservations = reservationsData.filter(
    (reservation) => new Date(reservation.scheduledStart) > new Date(),
  );

  return (
    <div className="container mx-auto mt-4 space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="pt-2 pb-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-3xl">Đặt Chỗ</CardTitle>
                  <CardDescription className="text-base">
                    Quản lý và theo dõi các đặt chỗ sạc xe điện của bạn
                  </CardDescription>
                </div>
              </div>
              <div className="text-muted-foreground flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Hoạt động</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">
                    {reservationsData.length}
                  </span>
                  <span>đặt chỗ</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CreateReservationButton
                stations={chargingStations}
                reservations={reservationsData}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Sections */}
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
                  Các đặt chỗ trong tương lai của bạn (
                  {inComingReservations.length} đặt chỗ)
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {inComingReservations == null ||
            inComingReservations.length === 0 ? (
              <EmptyTable />
            ) : (
              <DataTable columns={columns} data={inComingReservations} />
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
                  Tất cả các đặt chỗ của bạn ({reservationsData.length} đặt chỗ)
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <DataTable columns={columns} data={reservationsData} />
          </div>
        </div>
      </div>
    </div>
  );
}
