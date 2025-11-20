import { API_BASE_URL } from "@/lib/api-config";
import { z } from "zod";

interface ApiFetchOptions extends RequestInit {
  token?: string;
  requireAuth?: boolean;
}

/**
 * Performs an authenticated API fetch with consistent error handling
 * @param endpoint - API endpoint path (will be appended to API_BASE_URL)
 * @param options - Fetch options including token and other RequestInit properties
 * @returns Promise that resolves to the response
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<Response> {
  const { token, requireAuth = true, headers = {}, ...fetchOptions } = options;

  if (requireAuth && !token) {
    console.error(`apiFetch: missing auth token for ${endpoint}`);
    throw new Error("Authentication token is required");
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const fetchHeaders: HeadersInit = {
    ...headers,
  };

  if (token) {
    fetchHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: fetchHeaders,
    });

    return response;
  } catch (error) {
    console.error(`API fetch error for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Performs an authenticated API fetch and parses the response with Zod schema
 * @param endpoint - API endpoint path
 * @param schema - Zod schema to validate the response
 * @param options - Fetch options
 * @returns Promise that resolves to validated data or null on error
 */
export async function apiFetchWithSchema<T>(
  endpoint: string,
  schema: z.ZodType<T>,
  options: ApiFetchOptions = {},
): Promise<T | null> {
  try {
    const response = await apiFetch(endpoint, options);

    if (!response.ok) {
      console.error(
        `Failed to fetch ${endpoint}, status: ${response.status}`,
      );
      return null;
    }

    const json = await response.json();
    const { success, data, error } = schema.safeParse(json);

    if (!success) {
      console.error(`Failed to parse response from ${endpoint}:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

/**
 * Performs an authenticated API fetch and parses array response with Zod schema
 * @param endpoint - API endpoint path
 * @param schema - Zod schema for array items
 * @param options - Fetch options
 * @returns Promise that resolves to array of validated data or empty array on error
 */
export async function apiFetchArray<T>(
  endpoint: string,
  itemSchema: z.ZodType<T>,
  options: ApiFetchOptions = {},
): Promise<T[]> {
  try {
    const response = await apiFetch(endpoint, options);

    if (!response.ok) {
      console.error(
        `Failed to fetch ${endpoint}, status: ${response.status}`,
      );
      return [];
    }

    const json = await response.json();
    const raw = Array.isArray(json?.data) ? json.data : json;
    const parsed = itemSchema.array().safeParse(raw);

    if (!parsed.success) {
      console.error(`Failed to parse array from ${endpoint}:`, parsed.error);
      return [];
    }

    return parsed.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

/**
 * Performs a POST request with JSON body
 * @param endpoint - API endpoint path
 * @param body - Request body to be JSON stringified
 * @param options - Fetch options
 * @returns Promise that resolves to the response
 */
export async function apiPost<TBody = unknown>(
  endpoint: string,
  body: TBody,
  options: ApiFetchOptions = {},
): Promise<Response> {
  return apiFetch(endpoint, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(body),
  });
}

/**
 * Performs a PUT request with JSON body
 * @param endpoint - API endpoint path
 * @param body - Request body to be JSON stringified
 * @param options - Fetch options
 * @returns Promise that resolves to the response
 */
export async function apiPut<TBody = unknown>(
  endpoint: string,
  body: TBody,
  options: ApiFetchOptions = {},
): Promise<Response> {
  return apiFetch(endpoint, {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(body),
  });
}

/**
 * Performs a DELETE request
 * @param endpoint - API endpoint path
 * @param options - Fetch options
 * @returns Promise that resolves to the response
 */
export async function apiDelete(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<Response> {
  return apiFetch(endpoint, {
    ...options,
    method: "DELETE",
  });
}
