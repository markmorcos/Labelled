import express, { Request, Response } from "express";
import { body } from "express-validator";
import { randomBytes } from "crypto";

import { NotFoundError, validateRequest } from "@labelled/common";

import { User } from "../../models/user";
import * as mailer from "../../services/mailer";

const router = express.Router();

router.post(
  "/api/auth/sign-in",
  [body("email").isEmail().withMessage("Email must be valid")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError();
    }

    const code = randomBytes(16).toString("hex");
    user.set({ code });
    await user.save();

    await mailer.send({ email, code });

    res.status(200).send(user);
  }
);

export { router as signInRouter };
