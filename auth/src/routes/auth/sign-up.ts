import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest } from "@labelled/common";

import { User } from "../../models/user";
import { sign } from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/auth/sign-up",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, brands } = req.body;

    const user = await User.createIfNotExists({ email, password, brands });

    req.session!.jwt = sign(
      { id: user.id, email: user.email, brands: user.brands },
      process.env.JWT_KEY!
    );

    res.status(200).send(user);
  }
);

export { router as signUpRouter };
