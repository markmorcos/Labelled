import express, { Request, Response } from "express";

import { admins, requireAuth } from "@labelled/common";

import * as shopify from "../shopify";

async function getAllProducts(email: string, vendors: string[]) {
  let after = "null";
  let products: any = [];

  let hasMore = true;
  do {
    const operation = `
      query {
        productVariants(first: 250, after: ${after}) {
          edges {
            node {
              id
              sku
              title
              price
              product {
                vendor
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `;

    const { data } = await shopify.client.request(operation);

    products = products.concat(
      data.productVariants.edges.map(({ node }: any) => node)
    );

    after = `"${data.productVariants.pageInfo.endCursor}"`;
    hasMore = data.productVariants.pageInfo.hasNextPage;
  } while (hasMore);

  return products.filter(
    ({ product }: any) =>
      admins.includes(email) || vendors.includes(product.vendor)
  );
}

const router = express.Router();

router.get(
  "/api/products",
  requireAuth,
  async (req: Request, res: Response) => {
    const { email, vendors } = req.currentUser!;

    const products = await getAllProducts(email, vendors);

    res.send(products);
  }
);

export { router as indexOrderRouter };
