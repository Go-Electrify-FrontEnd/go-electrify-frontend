import CreateReservationButton from "@/features/reservations/components/reservation-create-button";
import SectionHeader from "@/components/section-header";
import { getUser } from "@/lib/auth/auth-server";
import { getConnectorTypes } from "../../admin/connector-type/page";
import { getVehicleModels } from "../../admin/vehicle-models/page";
import SectionContent from "@/components/section-content";
import { getReservationsDetails } from "@/features/reservations/services/reservations-api";

import { ReservationTable } from "@/features/reservations/components/reservation-table";
import { ReservationSimple } from "@/features/reservations/components/reservation-simple";
import {
  Empty,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyHeader,
  EmptyContent,
} from "@/components/ui/empty";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { getBookingFee } from "@/features/booking-fee/services/booking-fee-api";
import {
  getStationChargers,
  getStations,
} from "@/features/stations/api/stations-api";
import { Charger } from "@/features/chargers/schemas/charger.schema";

interface ReservationPageProps {
  searchParams: Promise<{ stationId?: string }>;
}

export default async function ReservationPage({
  searchParams,
}: ReservationPageProps) {
  const { stationId } = await searchParams;
  const { token } = await getUser();
  const chargers: Charger[] = [];
  const stations = await getStations();

  await Promise.all(
    stations.map(async (station) => {
      chargers.push(
        ...(await getStationChargers(station.id!.toString(), token!)),
      );
    }),
  );

  const vehicleModels = await getVehicleModels(token!);
  const connectorTypes = await getConnectorTypes();
  const allReservations = await getReservationsDetails(
    token!,
    stations,
    vehicleModels,
    connectorTypes,
  );
  const bookingFee = await getBookingFee();

  const upcomingReservations = allReservations.filter((r) =>
    ["CONFIRMED"].includes(r.status.toUpperCase()),
  );

  const currentReservation =
    upcomingReservations.length > 0 ? upcomingReservations[0] : null;

  let chargerCode = "Unknown";
  if (currentReservation) {
    const charger = chargers.find((c) => c.id === currentReservation.chargerId);
    if (charger) {
      chargerCode = charger.code;
    }
  }

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
          preSelectedStationId={stationId}
          defaultOpen={!!stationId}
        />
      </SectionHeader>

      <SectionContent>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Đặt Chỗ Hiện Tại</CardTitle>
              <CardDescription>Đặt chỗ đang hoạt động của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              {currentReservation ? (
                <ReservationSimple
                  reservation={currentReservation}
                  chargerCode={chargerCode}
                />
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Plus />
                    </EmptyMedia>
                    <EmptyTitle>Không có đặt chỗ hiện tại</EmptyTitle>
                    <EmptyDescription>
                      Bạn chưa có đặt chỗ nào đang hoạt động. Tạo đặt chỗ mới để
                      bắt đầu sạc xe điện.
                    </EmptyDescription>
                    <EmptyContent>
                      <CreateReservationButton
                        stations={stations}
                        vehicleModels={vehicleModels}
                        connectorTypes={connectorTypes}
                        bookingFee={bookingFee!}
                      />
                    </EmptyContent>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
          </Card>

          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-2">
              <div>
                <h3 className="text-lg font-semibold">Lịch Sử Đặt Chỗ</h3>
                <p className="text-muted-foreground text-sm">
                  Tất cả các đặt chỗ của bạn ({allReservations.length} đặt chỗ)
                </p>
              </div>
            </div>
            <ReservationTable data={allReservations} />
          </div>
        </div>
      </SectionContent>
    </div>
  );
}
