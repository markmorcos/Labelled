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
  "/api/queries/products",
  requireAuth,
  async (req: Request, res: Response) => {
    const { email, brands } = req.currentUser!;

    const productVariants = await productVariantsQuery(
      admins.includes(email) ? "" : `vendor:'${brands.join("' OR '")}'`
    );

    res.send(productVariants);
  }
);

export { router as productsRouter };
