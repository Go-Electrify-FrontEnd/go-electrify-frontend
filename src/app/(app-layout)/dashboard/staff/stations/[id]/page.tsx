export default async function StationPage({
  params,
}: {
  params: { id: Promise<string> };
}) {
  return <div>Station {await params.id}</div>;
}
