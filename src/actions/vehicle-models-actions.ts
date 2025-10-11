"use server";

export async function createVehicleModel(prev: unknown, formData: FormData) {
  const connectorTypeIdsRaw = formData.get("connectorTypeIds");
  const connectorTypeIds: string[] =
    typeof connectorTypeIdsRaw === "string"
      ? connectorTypeIdsRaw.split(",").map((id) => id.trim())
      : [];

  console.log("Connector Type IDs:" + connectorTypeIds);
  console.log("You submitted:", JSON.stringify(Object.fromEntries(formData)));

  return { success: false, msg: "Chức năng chưa hoàn thiện" };
}
