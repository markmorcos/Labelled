import { createAdminApiClient } from "@shopify/admin-api-client";

export const client = createAdminApiClient({
  storeDomain: process.env.SHOPIFY_STORE!,
  apiVersion: "2024-07",
  accessToken: process.env.SHOPIFY_KEY!,
});
