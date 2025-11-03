import { getUser } from "@/lib/auth/auth-server";
import {
  ConnectorType,
  ConnectorTypeSchema,
} from "@/features/connector-type/schemas/connector-type.schema";
import { API_BASE_URL } from "@/lib/api-config";

export async function getConnectorTypes(): Promise<ConnectorType[]> {
  try {
    const { token } = await getUser();
    const url = `${API_BASE_URL}/connector-types`;
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
