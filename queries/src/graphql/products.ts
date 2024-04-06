import { base } from "./base";

export interface Product {
  id: string;
  sku: string;
  displayName: string;
  title: string;
  price: number;
  product: {
    vendor: string;
  };
}

export const productVariantsQuery = async (
  query?: string
): Promise<Product[]> => {
  // inventoryItem {
  //   inventoryLevel(locationId: "gid://shopify/Location/94281793558") {
  //     quantities(names: ["available"]) {
  //       quantity
  //     }
  //   }
  // }

  return base(
    "productVariants",
    `
    id
    sku
    displayName
    title
    price
    product {
      vendor
    }
    inventoryQuantity`,
    query
  );
};
