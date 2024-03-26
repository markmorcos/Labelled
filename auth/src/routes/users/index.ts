import express, { Request, Response } from "express";

import { admins, currentUser, requireAuth } from "@labelled/common";

import { User } from "../../models/user";

const router = express.Router();

router.get(
  "/api/auth/users",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { email } = req.currentUser!;

    if (!admins.includes(email)) {
      return res.status(200).send([req.currentUser!]);
    }

    const users = await User.find({});
    return res.status(200).send(users);
  }
);

export { router as indexAuthRouter };
