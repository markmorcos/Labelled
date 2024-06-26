import express, { Request, Response } from "express";
import { body } from "express-validator";

import { NotAuthorizedError, admins, validateRequest } from "@labelled/common";

import { User } from "../../models/user";

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

    if (!admins.includes(email)) {
      throw new NotAuthorizedError();
    }

    const user = await User.upsert({ email, password, brands });

    res.status(200).send(user);
  }
);

export { router as signUpRouter };
