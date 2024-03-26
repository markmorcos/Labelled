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
  "/api/orders/:id",
  requireAuth,
  [param("id").isMongoId()],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as readOrderRouter };
