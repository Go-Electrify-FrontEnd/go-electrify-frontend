import { getUser } from "@/lib/auth/auth-server";
import { getReservations } from "@/features/reservations/services/reservations-api";
import JoinPageWrapperNoSSR from "@/features/charging/components/join-no-ssr-wrapper";

export default async function JoinPage() {
  const { token } = await getUser();
  const reservations = await getReservations(token!);
  return <JoinPageWrapperNoSSR reservations={reservations} />;
}
