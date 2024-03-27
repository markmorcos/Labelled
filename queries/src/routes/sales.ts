import express, { Request, Response } from "express";

import { admins, requireAuth } from "@labelled/common";

import * as shopify from "../shopify";
import { AdminQueries } from "@shopify/admin-api-client";

interface Product {
  id: string;
  sku: string;
  title: string;
  price: number;
  product: {
    vendor: string;
  };
}

interface Order {
  lineItems: {
    edges: Array<{
      node: {
        id: string;
        sku: string;
        currentQuantity: number;
        originalUnitPriceSet: {
          shopMoney: {
            amount: number;
          };
        };
      };
    }>;
  };
}

interface Sale {
  quantity: number;
  profit: number;
}

const getAllProducts = async (email: string, brands: string[]) => {
  let after = "null";
  let products: Product[] = [];
  const query = admins.includes(email)
    ? ""
    : `, query: "vendor:${brands.join(" OR ")}"`;

  let hasMore = true;
  do {
    const operation = `
      query {
        productVariants(first: 250, after: ${after}${query}) {
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
      data.productVariants.edges.map(({ node }: { node: Product }) => node)
    );

    after = `"${data.productVariants.pageInfo.endCursor}"`;
    hasMore = data.productVariants.pageInfo.hasNextPage;
  } while (hasMore);

  return products;
};

const getAllOrders = async (skus: string[]) => {
  let after = "null";
  let orders: Order[] = [];
  const query = `, query: "sku:'${skus.join("' OR '")}'"`;

  let hasMore = true;
  do {
    const operation = `
      query {
        orders(first: 250, after: ${after}${query}) {
          edges {
            node {
              id
              currentTotalPriceSet {
                shopMoney {
                  amount
                }
              }
              lineItems(first: 10) {
                edges {
                  node {
                    id
                    sku
                    currentQuantity
                    originalUnitPriceSet {
                      shopMoney {
                        amount
                      }
                    }
                  }
                }
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

    orders = orders.concat(
      data.orders.edges.map(({ node }: AdminQueries) => node)
    );

    after = `"${data.orders.pageInfo.endCursor}"`;
    hasMore = data.orders.pageInfo.hasNextPage;
  } while (hasMore);

  return orders;
};

const router = express.Router();

router.get(
  "/api/queries/sales",
  requireAuth,
  async (req: Request, res: Response) => {
    const { email, brands } = req.currentUser!;

    const products = await getAllProducts(email, brands);
    const orders = await getAllOrders(
      products.map(({ sku }) => sku) as string[]
    );

    const sales: { [sku: string]: Sale } = {};
    for (const order of orders) {
      for (const lineItem of order.lineItems.edges) {
        sales[lineItem.node.sku] = {
          quantity:
            (sales[lineItem.node.sku]?.quantity || 0) +
            Number(lineItem.node.currentQuantity),
          profit:
            (sales[lineItem.node.sku]?.profit || 0) +
            Number(lineItem.node.originalUnitPriceSet.shopMoney.amount),
        };
      }
    }

    res.send(
      products.map((product) => ({
        ...product,
        quantity: sales[product.sku]?.quantity || 0,
        profit: sales[product.sku]?.profit || 0,
      }))
    );
  }
);

export { router as salesRouter };
