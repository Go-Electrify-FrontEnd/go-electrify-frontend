import CreateReservationButton from "@/features/reservations/components/reservation-create-button";
import SectionHeader from "@/components/shared/section-header";
import { getUser } from "@/lib/auth/auth-server";
import { getConnectorTypes } from "../../admin/connector-type/page";
import { getVehicleModels } from "../../admin/vehicle-models/page";
import SectionContent from "@/components/shared/section-content";
import { getStations } from "@/features/stations/services/stations-api";
import { getReservationsDetails } from "@/features/reservations/services/reservations-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReservationTable } from "@/features/reservations/components/reservation-table";
import { Plus, Clock } from "lucide-react";
import { getBookingFee } from "@/features/booking-fee/services/booking-fee-api";

export default async function ReservationPage() {
  const { token } = await getUser();
  const stations = await getStations();
  const vehicleModels = await getVehicleModels(token!);
  const connectorTypes = await getConnectorTypes();
  const allReservations = await getReservationsDetails(
    token!,
    stations,
    vehicleModels,
    connectorTypes,
  );
  const bookingFee = await getBookingFee();

  // Filter upcoming reservations (PENDING, CONFIRMED)
  const upcomingReservations = allReservations.filter((r) =>
    ["PENDING", "CONFIRMED"].includes(r.status.toUpperCase()),
  );

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionHeader
        title="Quản lý Đặt Chỗ"
        subtitle="Xem và quản lý các đặt chỗ trạm sạc xe điện của bạn"
      >
        <CreateReservationButton
          stations={stations}
          vehicleModels={vehicleModels}
          connectorTypes={connectorTypes}
          bookingFee={bookingFee!}
        />
      </SectionHeader>

      <SectionContent>
        <div className="space-y-6">
          {/* Upcoming Reservations */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle>Đặt Chỗ Sắp Tới</CardTitle>
                  <CardDescription>
                    Các đặt chỗ trong tương lai của bạn (
                    {upcomingReservations.length} đặt chỗ)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ReservationTable data={upcomingReservations} />
            </CardContent>
          </Card>

          {/* All Reservations History */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <CardTitle>Lịch Sử Đặt Chỗ</CardTitle>
                  <CardDescription>
                    Tất cả các đặt chỗ của bạn ({allReservations.length} đặt
                    chỗ)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ReservationTable data={allReservations} />
            </CardContent>
          </Card>
        </div>
      </SectionContent>
    </div>
  );
}
