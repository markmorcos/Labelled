import express, { Request, Response } from "express";

import { currentUser, requireAuth } from "@labelled/common";

const router = express.Router();

router.get(
  "/api/auth/current-user",
  currentUser,
  requireAuth,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser });
  }
);

export { router as currentUserRouter };
