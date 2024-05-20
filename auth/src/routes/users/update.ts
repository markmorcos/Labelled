import express, { Request, Response } from "express";
import { body, param } from "express-validator";

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

router.patch(
  "/api/auth/users/:userId",
  [param("userId").isMongoId(), body("brands").isArray()],
  validateRequest,
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    if (!admins.includes(req.currentUser!.email)) {
      throw new NotAuthorizedError();
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError();
    }

    const { email } = user;
    const { password, brands } = req.body;
    const updatedUser = await User.upsert({ email, password, brands });

    return res.status(204).send(updatedUser);
  }
);

export { router as patchAuthRouter };
