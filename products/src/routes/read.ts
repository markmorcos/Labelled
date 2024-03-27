import express, { Request, Response } from "express";
import { param } from "express-validator";

import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@labelled/common";

const router = express.Router();

router.get(
  "/api/products/:id",
  requireAuth,
  [param("id").notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as readOrderRouter };
