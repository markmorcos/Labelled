import express, { Request, Response } from "express";

import { admins, requireAuth } from "@labelled/common";

import { productVariantsQuery } from "../graphql/products";
import { ordersQuery } from "../graphql/orders";

interface Sale {
  originalQuantity: number;
  originalAmount: number;
  currentDiscounts: number;
  currentQuantity: number;
  currentAmount: number;
}

const router = express.Router();

router.get(
  "/api/queries/sales",
  requireAuth,
  async (req: Request, res: Response) => {
    const { email, brands } = req.currentUser!;

    const productVariants = await productVariantsQuery(
      admins.includes(email) ? "" : `vendor:'${brands.join("' OR '")}'`
    );
    const orders = await ordersQuery(
      `sku:'${productVariants.map(({ sku }) => sku).join("' OR '")}'`
    );

    const sales: { [sku: string]: Sale } = {};
    for (const order of orders) {
      for (const lineItem of order.lineItems.edges) {
        sales[lineItem.node.sku] = {
          originalQuantity:
            (sales[lineItem.node.sku]?.originalQuantity || 0) +
            Number(lineItem.node.originalUnitPriceSet.shopMoney.amount),
          originalAmount: Number(
            lineItem.node.originalUnitPriceSet.shopMoney.amount
          ),
          currentDiscounts:
            (sales[lineItem.node.sku]?.currentDiscounts || 0) +
            Number(lineItem.node.totalDiscountSet.shopMoney.amount),
          currentQuantity:
            (sales[lineItem.node.sku]?.currentQuantity || 0) +
            Number(lineItem.node.currentQuantity),
          currentAmount:
            (sales[lineItem.node.sku]?.currentAmount || 0) +
            Number(lineItem.node.originalUnitPriceSet.shopMoney.amount),
        };
      }
    }

    res.send(
      productVariants
        .map((product) => ({
          ...product,
          originalQuantity: sales[product.sku]?.originalQuantity || 0,
          originalAmount: sales[product.sku]?.originalAmount || 0,
          currentDiscounts: sales[product.sku]?.currentDiscounts || 0,
          currentQuantity: sales[product.sku]?.currentQuantity || 0,
          currentAmount: sales[product.sku]?.currentAmount || 0,
        }))
        .filter(({ originalQuantity }) => originalQuantity > 0)
    );
  }
);

export { router as salesRouter };
