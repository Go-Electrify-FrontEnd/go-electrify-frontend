"use server";

import * as connectorType from "@/features/connector-type/services/connector-type-actions";

export async function handleCreateConnectorType(
  prev: unknown,
  formData: FormData,
) {
  return await connectorType.handleCreateConnectorType(prev, formData);
}

export async function handleDeleteConnectorType(
  prev: unknown,
  formData: FormData,
) {
  return await connectorType.handleDeleteConnectorType(prev, formData);
}

export async function handleUpdateConnectorType(
  prev: unknown,
  formData: FormData,
) {
  return await connectorType.handleUpdateConnectorType(prev, formData);
}
