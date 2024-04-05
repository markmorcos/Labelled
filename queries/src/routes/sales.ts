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
        const sku = lineItem.node.sku;
        const originalUnitAmount = Number(
          lineItem.node.originalUnitPriceSet.shopMoney.amount
        );
        const originalLineItemQuantity = Number(lineItem.node.quantity);
        const currentLineItemDiscounts = Number(
          lineItem.node.totalDiscountSet.shopMoney.amount
        );
        const currentLineItemQuantity = Number(lineItem.node.currentQuantity);

        const {
          originalQuantity = 0,
          originalAmount = 0,
          currentDiscounts = 0,
          currentQuantity = 0,
          currentAmount = 0,
        } = sales[sku] || {};

        sales[sku] = {
          originalQuantity: originalQuantity + originalLineItemQuantity,
          originalAmount:
            originalAmount + originalLineItemQuantity * originalUnitAmount,
          currentDiscounts: currentDiscounts + currentLineItemDiscounts,
          currentQuantity: currentQuantity + currentLineItemQuantity,
          currentAmount:
            currentAmount + currentLineItemQuantity * originalUnitAmount,
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
