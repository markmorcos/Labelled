import express, { Request, Response } from "express";

import { admins, requireAuth } from "@labelled/common";

import * as shopify from "../shopify";

async function getAllOrders(email: string, vendors: string[] = []) {
  let after = "null";
  let orders: any[] = [];

  const operation = `
    query {
      orders(first: 50, after: ${after}, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            name
            createdAt
            currentTotalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            originalTotalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            lineItems(first: 50) {
              edges {
                node {
                  id
                  title
                  quantity
                  variant {
                    id
                    title
                    price
                    product {
                      vendor
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

  let hasMore = true;
  do {
    const { data } = await shopify.client.request(operation);

    orders = orders.concat(data.orders.edges.map(({ node }: any) => node));

    after = `"${data.orders.pageInfo.endCursor}"`;
    hasMore = data.orders.pageInfo.hasNextPage;
  } while (hasMore);

  orders = orders.filter(
    ({ lineItems }) =>
      lineItems.edges.filter(
        ({ node }: any) =>
          admins.includes(email) ||
          vendors.includes(node.variant?.product?.vendor)
      ).length > 0
  );

  orders = orders.map(
    ({ id, name, createdAt, currentTotalPriceSet, lineItems }) => ({
      id,
      name,
      createdAt,
      amount: currentTotalPriceSet.shopMoney.amount,
      vendors: lineItems.edges
        .map(({ node }: any) => node.variant?.product?.vendor)
        .filter(
          (vendor: any) => admins.includes(email) || vendors.includes(vendor)
        ),
    })
  );

  return orders;
}

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const { email, vendors } = req.currentUser!;

  const orders = await getAllOrders(email, vendors);

  res.send(orders);
});

export { router as indexOrderRouter };
