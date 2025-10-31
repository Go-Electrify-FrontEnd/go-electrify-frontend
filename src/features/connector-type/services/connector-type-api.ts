import { getUser } from "@/lib/auth/auth-server";
import { ConnectorType, ConnectorTypeSchema } from "@/types/connector";

export async function getConnectorTypes(): Promise<ConnectorType[]> {
  try {
    const { token } = await getUser();
    const url = "https://api.go-electrify.com/api/v1/connector-types";
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    const parsed = ConnectorTypeSchema.array().safeParse(data);
    if (!parsed.success) {
      console.error("Invalid connector types data:", parsed.error);
      return [];
    }
    return parsed.data;
  } catch (error) {
    console.error("Error fetching connector types:", error);
    return [];
  }
}
