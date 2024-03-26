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
  [param("userId").isMongoId(), body("vendors").isArray()],
  validateRequest,
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { vendors } = req.body;

    const user = await User.findById(req.params.userId);

    if (!user) {
      throw new NotFoundError();
    }

    if (!admins.includes(req.currentUser!.email)) {
      throw new NotAuthorizedError();
    }

    user.set({ vendors });
    await user.save();

    return res.status(204).send(user);
  }
);

export { router as patchAuthRouter };
