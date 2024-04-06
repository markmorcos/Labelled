import express, { Request, Response } from "express";

import { admins, requireAuth } from "@labelled/common";

import { Product } from "../graphql/products";
import { Queries, fetchKey } from "../redis";

const router = express.Router();

router.get(
  "/api/queries/products",
  requireAuth,
  async (req: Request, res: Response) => {
    const { email, brands } = req.currentUser!;
    const products: Product[] = (await fetchKey(Queries.products)) || [];

    res
      .status(200)
      .send(
        products.filter(
          ({ product }) =>
            admins.includes(email) || brands.includes(product.vendor)
        )
      );
  }
);

export { router as productsRouter };
