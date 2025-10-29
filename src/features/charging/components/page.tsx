import { getUser } from "@/lib/auth/auth-server";
import JoinPageWrapper from "./join-no-ssr-wrapper";
import { getReservations } from "@/features/reservations/services/reservations-api";

export default async function JoinPage() {
  const { user, token } = await getUser();
  const reservations = await getReservations(token!);
  return <JoinPageWrapper reservations={reservations} />;
}
