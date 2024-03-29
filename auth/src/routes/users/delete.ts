import express, { Request, Response } from "express";
import { param } from "express-validator";

import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  admins,
  currentUser,
  requireAuth,
  validateRequest,
} from "@labelled/common";

import { User } from "../../models/user";

const router = express.Router();

router.delete(
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
    if (user.email === email) {
      throw new BadRequestError("You cannot delete your own account");
    }

    await user.deleteOne();

    return res.status(204).send({ success: true });
  }
);

export { router as deleteAuthRouter };
