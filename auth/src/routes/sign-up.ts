import express, { Request, Response } from "express";
import { body } from "express-validator";
import { randomBytes } from "crypto";

import { validateRequest } from "@labelled/common";

import { User } from "../models/user";
import * as mailer from "../services/mailer";

const router = express.Router();

router.post(
  "/api/auth/sign-up",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("vendors").isArray(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, vendors } = req.body;

    const code = randomBytes(16).toString("hex");
    const user = await User.createIfNotExists({ email, vendors, code });

    await mailer.send({ email, code });

    res.status(200).send(user);
  }
);

export { router as signUpRouter };
