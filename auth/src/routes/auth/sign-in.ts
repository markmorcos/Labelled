import express, { Request, Response } from "express";
import { body } from "express-validator";
import { sign } from "jsonwebtoken";

import {
  BadRequestError,
  NotFoundError,
  validateRequest,
} from "@labelled/common";

import { User } from "../../models/user";
import { compare } from "../../services/password";

const router = express.Router();

router.post(
  "/api/auth/sign-in",
  [body("email").isEmail().withMessage("Email must be valid")],
  [body("password").trim().notEmpty().withMessage("Password must be provided")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError();
    }

    const passwordsMatch = await compare(user.password, password);
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    req.session!.jwt = sign(
      { id: user.id, email: user.email, brands: user.brands },
      process.env.JWT_KEY!
    );

    res.status(200).send(user);
  }
);

export { router as signInRouter };
