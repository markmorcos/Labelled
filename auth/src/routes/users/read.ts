import express, { Request, Response } from "express";
import { param } from "express-validator";

import {
  NotAuthorizedError,
  NotFoundError,
  admins,
  currentUser,
  requireAuth,
  validateRequest,
} from "@labelled/common";

import { User } from "../../models/user";

const router = express.Router();

router.get(
  "/api/auth/users/:userId",
  [param("userId").isMongoId()],
  validateRequest,
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { email } = req.currentUser!;

    if (!admins.includes(email)) {
      throw new NotAuthorizedError();
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError();
    }

    return res.status(200).send(user);
  }
);

export { router as readAuthRouter };
